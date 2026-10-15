import json
import re
import time
import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

with open('output/trohoalac_full_scraped.json', 'r', encoding='utf-8') as f:
    rooms = json.load(f)

cids = {}
for r in rooms:
    maps_str = r.get('maps_embed') or ''
    m = re.search(r'0x[0-9a-fA-F]+(?:%3A|:)(0x[0-9a-fA-F]+)', maps_str)
    if m:
        cid_hex = m.group(1)
        try:
            cid_dec = str(int(cid_hex, 16))
            if cid_dec not in cids:
                cids[cid_dec] = {
                    'title': r['title'],
                    'cid_hex': cid_hex,
                    'cid_dec': cid_dec,
                    'ward': r.get('ward'),
                    'price': r.get('price'),
                    'images': r.get('images', []),
                    'amenities': r.get('amenities', []),
                    'description': r.get('description'),
                    'address': r.get('address'),
                    'status': r.get('status')
                }
        except Exception:
            pass

print(f"Tổng số CID Google Maps chính chủ tìm thấy trong trohoalac.com: {len(cids)}")

resolved_places = []

with sync_playwright() as p:
    browser = p.chromium.launch(channel='chrome', headless=True)
    page = browser.new_page()
    
    for idx, (cid_dec, info) in enumerate(cids.items(), 1):
        url = f"https://www.google.com/maps?cid={cid_dec}"
        print(f"[{idx}/{len(cids)}] Resolving CID: {cid_dec} ({info['title']})...")
        try:
            page.goto(url, timeout=20000)
            page.wait_for_timeout(3500)
            final_url = page.url
            
            # Extract pin coordinates
            m = re.search(r'!(?:3d|8m2!3d)([0-9]+\.[0-9]+)!4d([0-9]+\.[0-9]+)', final_url)
            if not m:
                m = re.search(r'!3d([0-9]+\.[0-9]+)!4d([0-9]+\.[0-9]+)', final_url)
                
            lat, lng = None, None
            if m:
                lat = float(m.group(1))
                lng = float(m.group(2))
            
            # Extract official name on Google Maps
            title_gmaps = page.title().split(" - Google Maps")[0]
            try:
                h1 = page.locator('h1').first.inner_text(timeout=1000)
                if h1:
                    title_gmaps = h1
            except:
                pass
                
            print(f"   -> '{title_gmaps}' | GPS: ({lat}, {lng})")
            if lat and lng:
                resolved_places.append({
                    "title_trohoalac": info['title'],
                    "name_google_maps": title_gmaps,
                    "cid": cid_dec,
                    "latitude": lat,
                    "longitude": lng,
                    "google_maps_url": final_url,
                    "ward": info['ward'],
                    "address": info['address'],
                    "price": info['price'],
                    "images": info['images'][:6],
                    "amenities": info['amenities'][:8],
                    "description": info['description'],
                    "status": info['status']
                })
        except Exception as e:
            print(f"   ❌ Error: {e}")
        time.sleep(0.5)
        
    browser.close()

with open('output/resolved_google_maps_cids.json', 'w', encoding='utf-8') as f:
    json.dump(resolved_places, f, ensure_ascii=False, indent=2)

print(f"\n🎉 ĐÃ RESOLVE THÀNH CÔNG {len(resolved_places)} ĐỊA ĐIỂM CHÍNH CHỦ GOOGLE MAPS!")
