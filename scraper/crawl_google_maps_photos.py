import json
import math
import re
import sys
import time
import urllib.parse
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate distance in meters between two GPS coordinates."""
    if lat1 is None or lon1 is None or lat2 is None or lon2 is None:
        return float('inf')
    R = 6371000  # Earth radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

def remove_vietnamese_accents(text):
    """Normalize Vietnamese characters to unaccented lowercase."""
    text = text.lower()
    patterns = {
        '[àáạảãâầấậẩẫăằắặẳẵ]': 'a',
        '[èéẹẻẽêềếệểễ]': 'e',
        '[ìíịỉĩ]': 'i',
        '[òóọỏõôồốộổỗơờớợởỡ]': 'o',
        '[ùúụủũưừứựửữ]': 'u',
        '[ỳýỵỷỹ]': 'y',
        '[đ]': 'd'
    }
    for regex, replacement in patterns.items():
        text = re.sub(regex, replacement, text)
    return text

def calculate_name_similarity(name1, name2):
    """Calculate similarity score (0.0 to 1.0) between two names."""
    if not name1 or not name2:
        return 0.0

    n1 = remove_vietnamese_accents(name1)
    n2 = remove_vietnamese_accents(name2)

    # Clean words
    w1 = set(re.findall(r'\b[a-z0-9]+\b', n1))
    w2 = set(re.findall(r'\b[a-z0-9]+\b', n2))

    # Stopwords to discard for core comparison
    stop = {'quan', 'tiem', 'cua', 'hang', 'nha', 'tro', 'chung', 'cu', 'mini', 'xa', 'huyen', 'thon', 'ha', 'noi', 'thach', 'that', 'hoa', 'lac', 'phong', 'ktx', 'building'}
    w1_core = w1 - stop
    w2_core = w2 - stop

    target1 = w1_core if w1_core else w1
    target2 = w2_core if w2_core else w2

    if not target1 or not target2:
        return 0.0

    intersection = len(target1 & target2)
    union = len(target1 | target2)
    jaccard = intersection / union if union > 0 else 0.0

    # Direct substring inclusion
    n1_clean = re.sub(r'[^a-z0-9]', '', n1)
    n2_clean = re.sub(r'[^a-z0-9]', '', n2)
    if n1_clean in n2_clean or n2_clean in n1_clean:
        jaccard = max(jaccard, 0.85)

    return round(jaccard, 2)

def extract_gps_from_url(url):
    """Extract pin coordinates or viewport coordinates from Google Maps URL."""
    m1 = re.search(r'!8m2!3d([0-9]+\.[0-9]+)!4d([0-9]+\.[0-9]+)', url)
    if m1:
        return float(m1.group(1)), float(m1.group(2))
    m2 = re.search(r'!3d([0-9]+\.[0-9]+)!4d([0-9]+\.[0-9]+)', url)
    if m2:
        return float(m2.group(1)), float(m2.group(2))
    m3 = re.search(r'@([0-9]+\.[0-9]+),([0-9]+\.[0-9]+)', url)
    if m3:
        return float(m3.group(1)), float(m3.group(2))
    return None, None

def extract_title_from_url(url):
    """Extract decoded place title from URL path."""
    m = re.search(r'/place/([^/@]+)', url)
    if m:
        return urllib.parse.unquote_plus(m.group(1)).strip()
    return ""

def clean_photo_url(src):
    """Convert Google Maps photo URL to high quality standard format."""
    if not src or not ('googleusercontent.com' in src):
        return None
    # Skip icons and logos
    if any(k in src for k in ['mapslogo', 'default_geocode', 'tactile', 'placeinfo', 'vt/pb', 'streetview']):
        return None
    # Replace dimension parameters
    cleaned = re.sub(r'=w\d+-h\d+.*', '=w1000-h750-k-no', src)
    if '=w1000-h750-k-no' not in cleaned:
        cleaned += '=w1000-h750-k-no'
    return cleaned

def run_crawler():
    with open('scraper/output/places_to_crawl.json', 'r', encoding='utf-8') as f:
        clean_places = json.load(f)

    print(f"Total target places to crawl: {len(clean_places)}")
    audit_results = []

    with sync_playwright() as p:
        try:
            browser = p.chromium.launch(channel='chrome', headless=True)
        except Exception:
            browser = p.chromium.launch(channel='msedge', headless=True)

        context = browser.new_context(
            viewport={"width": 1280, "height": 800},
            locale="vi-VN",
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        for idx, item in enumerate(clean_places, 1):
            local_name = item['name']
            local_lat = item['lat']
            local_lng = item['lng']
            area = item.get('area', '')
            addr = item.get('address', '')
            category = item.get('category', '')

            print(f"\n==================================================")
            print(f"[{idx}/{len(clean_places)}] ĐANG XỬ LÝ: '{local_name}' ({category})")
            print(f"    Tọa độ gốc: ({local_lat}, {local_lng}) | Địa chỉ: {addr}")

            # Specific search queries to help Google Maps locate the right POI
            search_query = f"{local_name} Hòa Lạc Thạch Thất Hà Nội"
            if "fpt" in local_name.lower():
                search_query = f"{local_name} Thạch Hòa Thạch Thất"

            enc_query = urllib.parse.quote(search_query)
            search_url = f"https://www.google.com/maps/search/{enc_query}"

            result_entry = {
                "id": item['id'],
                "local_name": local_name,
                "category": category,
                "local_lat": local_lat,
                "local_lng": local_lng,
                "search_query": search_query,
                "matched_name": None,
                "matched_lat": None,
                "matched_lng": None,
                "distance_meters": None,
                "name_similarity": 0.0,
                "status": "SKIPPED",
                "reason": "",
                "photos": [],
                "google_maps_url": None
            }

            try:
                page.goto(search_url, timeout=25000, wait_until="domcontentloaded")
                page.wait_for_timeout(3500)
                curr_url = page.url

                target_place_url = None

                # Case 1: Direct place page
                if "/place/" in curr_url and "/search/" not in curr_url:
                    target_place_url = curr_url
                    print("   -> Redirected directly to place page!")
                else:
                    # Case 2: In search feed. Evaluate all candidates in the feed!
                    feed_links = page.locator('div[role="feed"] a[href*="/place/"]').all()
                    print(f"   -> Feed contains {len(feed_links)} candidates. Evaluating each...")

                    is_campus = any(k in local_name.lower() for k in ['fpt', 'quoc gia', 'vnu', 'campus'])
                    max_allowed_dist = 1200 if is_campus else 450
                    min_allowed_sim = 0.40 if is_campus else 0.45

                    best_candidate_href = None
                    best_candidate_score = -999999.0
                    best_cand_info = None

                    for cand in feed_links[:8]:
                        href = cand.get_attribute("href")
                        cand_name = extract_title_from_url(href) or cand.get_attribute("aria-label") or ""
                        cand_lat, cand_lng = extract_gps_from_url(href)
                        cand_dist = haversine_distance(local_lat, local_lng, cand_lat, cand_lng)
                        cand_sim = calculate_name_similarity(local_name, cand_name)

                        # Check if within valid boundaries
                        if cand_dist <= max_allowed_dist and cand_sim >= min_allowed_sim:
                            # Score favoring close distance and high similarity
                            score = (cand_sim * 100) - (cand_dist / 10)
                            if score > best_candidate_score:
                                best_candidate_score = score
                                best_candidate_href = href
                                best_cand_info = (cand_name, cand_dist, cand_sim)

                    if best_candidate_href:
                        cand_name, cand_dist, cand_sim = best_cand_info
                        print(f"   -> Best valid candidate: '{cand_name}' (Dist: {cand_dist}m, Sim: {cand_sim*100:.0f}%)")
                        page.goto(best_candidate_href, timeout=25000, wait_until="domcontentloaded")
                        page.wait_for_timeout(3500)
                        target_place_url = page.url
                    else:
                        print("   -> Không có ứng viên nào trong feed thỏa mãn điều kiện khoảng cách & tên!")
                        target_place_url = curr_url

                result_entry["google_maps_url"] = target_place_url

                # Extract verified details from final place page
                matched_title = extract_title_from_url(target_place_url)
                if not matched_title or matched_title == "Kết quả":
                    try:
                        h1 = page.locator("div[role='main'] h1").first
                        if h1.is_visible(timeout=1000):
                            matched_title = h1.inner_text().strip()
                    except Exception:
                        pass

                result_entry["matched_name"] = matched_title
                g_lat, g_lng = extract_gps_from_url(target_place_url)
                result_entry["matched_lat"] = g_lat
                result_entry["matched_lng"] = g_lng

                dist = haversine_distance(local_lat, local_lng, g_lat, g_lng)
                sim = calculate_name_similarity(local_name, matched_title)

                result_entry["distance_meters"] = dist
                result_entry["name_similarity"] = sim

                print(f"   -> Kết quả Google: '{matched_title}'")
                print(f"   -> Tọa độ Google: ({g_lat}, {g_lng})")
                print(f"   -> Khoảng cách GPS: {dist} mét | Độ tương đồng tên: {sim*100:.0f}%")

                is_campus = any(k in local_name.lower() for k in ['fpt', 'quoc gia', 'vnu', 'campus'])
                is_distance_ok = (dist <= 1200) if is_campus else (dist <= 450)
                is_name_ok = (sim >= 0.40) if is_campus else (sim >= 0.45)

                if is_distance_ok and is_name_ok and "/place/" in target_place_url:
                    # Extract photos
                    photos = []
                    page.wait_for_timeout(2000)
                    img_locators = page.locator('button[aria-label*="Photo"] img, button[aria-label*="Ảnh"] img, img[src*="googleusercontent.com"]').all()
                    for img_el in img_locators:
                        src = img_el.get_attribute("src")
                        clean = clean_photo_url(src)
                        if clean and clean not in photos:
                            photos.append(clean)
                        if len(photos) >= 3:
                            break

                    if photos:
                        result_entry["photos"] = photos
                        result_entry["status"] = "ACCEPTED"
                        result_entry["reason"] = f"Khớp chuẩn: Cách {dist}m, tên trùng khớp {sim*100:.0f}%, tìm thấy {len(photos)} ảnh thực tế."
                        print(f"   ✅ CHẤP NHẬN: {len(photos)} ảnh thật được ghi nhận!")
                    else:
                        result_entry["status"] = "SKIPPED_NO_PHOTOS"
                        result_entry["reason"] = f"Tên và vị trí khớp ({dist}m, {sim*100:.0f}%) nhưng không tìm thấy ảnh chụp trên Google Maps."
                        print("   ⚠️ BỎ QUA: Không có ảnh thực tế trên Google Maps.")
                else:
                    reasons = []
                    if not is_distance_ok:
                        reasons.append(f"Khoảng cách {dist}m quá xa (> {'1200m' if is_campus else '450m'})")
                    if not is_name_ok:
                        reasons.append(f"Tên '{matched_title}' không đủ độ tin cậy so với '{local_name}' ({sim*100:.0f}%)")
                    result_entry["status"] = "SKIPPED_UNCONFIRMED"
                    result_entry["reason"] = " | ".join(reasons)
                    print(f"   ❌ TỪ CHỐI / BỎ QUA: {result_entry['reason']}")

            except Exception as e:
                result_entry["status"] = "ERROR"
                result_entry["reason"] = f"Lỗi: {str(e)}"
                print(f"   ❌ Lỗi: {e}")

            audit_results.append(result_entry)
            time.sleep(1)

        browser.close()

    # Save JSON Audit
    with open('scraper/output/google_maps_photo_audit.json', 'w', encoding='utf-8') as f:
        json.dump(audit_results, f, ensure_ascii=False, indent=2)

    # Generate Markdown Table Report
    md_lines = [
        "# BÁO CÁO KIỂM TRA ĐỐI SOÁT ẢNH GOOGLE MAPS (STRICT AUDIT)",
        "",
        "> [!IMPORTANT]",
        "> Chỉ các địa điểm đạt chuẩn vị trí (khoảng cách <= 450m hoặc <= 1200m đối với Campus) VÀ độ tương đồng tên cao mới được chấp thuận lấy ảnh.",
        "",
        f"- **Tổng số địa điểm kiểm tra**: {len(audit_results)}",
        f"- **Số địa điểm ĐẠT CHUẨN (ACCEPTED)**: {sum(1 for r in audit_results if r['status'] == 'ACCEPTED')}",
        f"- **Số địa điểm BỎ QUA ĐỂ BẢO ĐẢM AN TOÀN**: {sum(1 for r in audit_results if r['status'] != 'ACCEPTED')}",
        "",
        "| STT | Tên địa điểm gốc | Tên trên Google Maps | Khoảng cách | Tương đồng tên | Kết quả | Số ảnh lấy được |",
        "| :--- | :--- | :--- | :---: | :---: | :---: | :---: |"
    ]

    for idx, r in enumerate(audit_results, 1):
        status_badge = "✅ CHẤP NHẬN" if r['status'] == 'ACCEPTED' else "⛔ BỎ QUA"
        dist_str = f"{r['distance_meters']}m" if r['distance_meters'] is not None and r['distance_meters'] != float('inf') else "N/A"
        sim_str = f"{r['name_similarity']*100:.0f}%"
        photo_cnt = len(r['photos'])
        md_lines.append(f"| {idx} | **{r['local_name']}** | {r['matched_name'] or 'N/A'} | {dist_str} | {sim_str} | {status_badge} | {photo_cnt} ảnh |")

    md_lines.append("\n## Chi tiết các địa điểm được chấp thuận ảnh thực tế:\n")
    for r in audit_results:
        if r['status'] == 'ACCEPTED':
            md_lines.append(f"### 📍 {r['local_name']}")
            md_lines.append(f"- **Google Place**: [{r['matched_name']}]({r['google_maps_url']})")
            md_lines.append(f"- **Tọa độ thực tế**: `({r['matched_lat']}, {r['matched_lng']})` (lệch {r['distance_meters']}m)")
            md_lines.append(f"- **Độ khớp tên**: {r['name_similarity']*100:.0f}%")
            md_lines.append("- **Ảnh thực tế đã tải**:")
            for p_url in r['photos']:
                md_lines.append(f"  - {p_url}")
            md_lines.append("")

    with open('scraper/output/google_maps_photo_audit.md', 'w', encoding='utf-8') as f:
        f.write("\n".join(md_lines))

    print("\n==================================================")
    print("🎉 ĐÃ HOÀN TẤT KIỂM TOÁN VÀ CÀO ẢNH GOOGLE MAPS!")
    print(f"- File JSON: scraper/output/google_maps_photo_audit.json")
    print(f"- File Báo cáo: scraper/output/google_maps_photo_audit.md")

if __name__ == '__main__':
    run_crawler()
