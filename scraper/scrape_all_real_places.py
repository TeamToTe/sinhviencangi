import re
import urllib.parse
import time
import json
import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

place_queries = [
    # Food
    ("food-379-minh-nga-1", "Nhà Hàng 379 Minh Nga 1 Thạch Hòa", "food_drink", "Ẩm thực"),
    ("food-thai-linh-ga-ca", "Ẩm Thực Thái Linh Gà Cá Thạch Hòa", "food_drink", "Ẩm thực"),
    ("food-bun-bay-cuong", "Cửa hàng bún Bẩy Cường Hòa Lạc", "food_drink", "Ẩm thực"),
    ("food-ga-ri-thanh-luan", "Gà Ri Thành Luân Hòa Lạc Thạch Hòa", "food_drink", "Ẩm thực"),
    
    # Grocery
    ("grocery-cho-hoa-lac", "Chợ Hòa Lạc Thạch Thất Hà Nội", "grocery", "Siêu thị & Tạp hóa"),
    ("grocery-tap-hoa-manh-quan", "Tạp hóa Mạnh Quân Hòa Lạc", "grocery", "Siêu thị & Tạp hóa"),
    
    # Pharmacy
    ("pharmacy-my-le-1", "Quầy thuốc Mỹ lệ 1 Thạch Hòa", "pharmacy", "Y tế & Sức khỏe"),
    ("pharmacy-phuong-nam", "Phương Nam Pharmacy Thạch Hòa Thạch Thất", "pharmacy", "Y tế & Sức khỏe"),
    ("pharmacy-nga-cuong", "Quầy thuốc Nga Cường Thạch Hòa Thạch Thất", "pharmacy", "Y tế & Sức khỏe"),
    
    # Services
    ("service-honda-cuong-thanh", "HEAD Honda Cường Thành Hòa Lạc", "services", "Dịch vụ học tập & Đời sống"),
    ("service-ky-ngan", "Kỳ Ngàn Building Hòa Lạc", "services", "Dịch vụ học tập & Đời sống"),
    ("service-nvh-thon-4", "Nhà Văn Hóa Thôn 4 Hòa Lạc", "services", "Dịch vụ học tập & Đời sống"),
    ("service-nvh-thon-5", "Nhà Văn hóa thôn 5 Hoà Lạc", "services", "Dịch vụ học tập & Đời sống"),
    ("service-henna-tattoo", "Henna Tattoo Thạch Hòa Thạch Thất", "services", "Dịch vụ học tập & Đời sống"),
    
    # Entertainment
    ("ent-san-cau-long-368", "Sân Cầu Lông 368 Badminton Hòa Lạc", "entertainment", "Giải trí & Thể thao"),
    ("ent-galaxy-billiards", "Galaxy Billiards Club Thạch Hòa Thạch Thất", "entertainment", "Giải trí & Thể thao"),
    ("ent-nexus-gaming", "Nexus Gaming Thạch Hòa Thạch Thất", "entertainment", "Giải trí & Thể thao"),
    
    # Boarding House
    ("house-trang-nguyen", "Nhà Trọ Trạng Nguyên Thôn 5 Thạch Hòa", "boarding_house", "Nhà trọ & Chung cư mini"),
    ("house-minh-cuong", "Nhà Trọ Minh Cương Thạch Hòa", "boarding_house", "Nhà trọ & Chung cư mini"),
    ("house-hoang-nam-2", "Nhà Trọ Hoàng Nam 2 Thạch Hòa", "boarding_house", "Nhà trọ & Chung cư mini"),
    
    # Campus / Transit
    ("campus-bus-cho-hoa-lac", "Điểm đón xe buýt Chợ Hòa Lạc QL21", "campus", "Trường & Điểm đón Bus"),
]

def batch_scrape():
    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch(channel='chrome', headless=True)
        page = browser.new_page()
        
        for pid, query, cat, cat_vn in place_queries:
            encoded = urllib.parse.quote(query)
            url = f"https://www.google.com/maps/search/{encoded}"
            print(f"🔍 Searching: {query} ...")
            try:
                page.goto(url, timeout=25000)
                page.wait_for_timeout(4000)
                curr_url = page.url
                
                # Check for first search result if in search results list
                if "/search/" in curr_url and not re.search(r'!3d[0-9]', curr_url):
                    first_item = page.locator('div[role="feed"] a[href*="/place/"]').first
                    if first_item.count() > 0:
                        first_item.click()
                        page.wait_for_timeout(3500)
                        curr_url = page.url
                
                m = re.search(r'!3d([0-9]+\.[0-9]+)!4d([0-9]+\.[0-9]+)', curr_url)
                lat, lng = None, None
                if m:
                    lat = float(m.group(1))
                    lng = float(m.group(2))
                else:
                    m_at = re.search(r'@([0-9]+\.[0-9]+),([0-9]+\.[0-9]+)', curr_url)
                    if m_at:
                        lat = float(m_at.group(1))
                        lng = float(m_at.group(2))
                
                # Get actual place name
                title = query
                try:
                    h1 = page.locator('h1').first.inner_text(timeout=2000)
                    if h1 and len(h1) > 1 and h1 != "Results":
                        title = h1
                except:
                    pass
                
                print(f"   -> '{title}' | GPS: ({lat}, {lng})")
                results.append({
                    "id": pid,
                    "query": query,
                    "name": title,
                    "category": cat,
                    "category_vn": cat_vn,
                    "lat": lat,
                    "lng": lng,
                    "maps_url": curr_url
                })
            except Exception as e:
                print(f"   ❌ Error searching '{query}': {e}")
                results.append({
                    "id": pid,
                    "query": query,
                    "name": query,
                    "category": cat,
                    "category_vn": cat_vn,
                    "lat": None,
                    "lng": None,
                    "maps_url": None
                })
            time.sleep(1)
            
        browser.close()
        
    with open('output/scraped_live_google_maps.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print("\n✅ Saved results to output/scraped_live_google_maps.json")

if __name__ == '__main__':
    batch_scrape()
