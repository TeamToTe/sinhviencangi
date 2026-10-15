import re
import urllib.parse
import time
import json
import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

test_queries = [
    "Quầy thuốc Mỹ lệ 1 Thạch Hòa",
    "Nhà Hàng 379 Minh Nga 1 Thạch Hòa",
    "Chợ Hòa Lạc Thạch Thất Hà Nội",
    "Nhà Trọ Trạng Nguyên Thôn 5 Thạch Hòa",
    "Nhà Văn Hóa Thôn 4 Hòa Lạc",
    "Nhà Văn hóa thôn 5 Hoà Lạc",
]

def search_places(queries):
    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch(channel='chrome', headless=True)
        page = browser.new_page()
        
        for q in queries:
            encoded = urllib.parse.quote(q)
            url = f"https://www.google.com/maps/search/{encoded}"
            print(f"\n🔍 Searching: {q} ...")
            try:
                page.goto(url, timeout=25000)
                # Wait for redirect to /place/ or search list
                page.wait_for_timeout(4000)
                curr_url = page.url
                print(f"   -> URL: {curr_url}")
                
                # Check if redirected to a place
                m = re.search(r'!3d([0-9]+\.[0-9]+)!4d([0-9]+\.[0-9]+)', curr_url)
                if not m:
                    # check @lat,lng
                    m_at = re.search(r'@([0-9]+\.[0-9]+),([0-9]+\.[0-9]+)', curr_url)
                
                # Get place title from H1 if present
                title = page.title()
                try:
                    h1 = page.locator('h1').first.inner_text(timeout=2000)
                    if h1:
                        title = h1
                except:
                    pass
                
                lat, lng = None, None
                if m:
                    lat = float(m.group(1))
                    lng = float(m.group(2))
                elif m_at:
                    lat = float(m_at.group(1))
                    lng = float(m_at.group(2))
                
                print(f"   -> Result: '{title}' | GPS: ({lat}, {lng})")
                results.append({
                    "query": q,
                    "title": title,
                    "lat": lat,
                    "lng": lng,
                    "url": curr_url
                })
            except Exception as e:
                print(f"   ❌ Error: {e}")
            time.sleep(1)
        
        browser.close()
    return results

if __name__ == '__main__':
    res = search_places(test_queries)
    print("\n=== SUMMARY RESULTS ===")
    for r in res:
        print(f"• {r['title']} -> ({r['lat']}, {r['lng']})")
