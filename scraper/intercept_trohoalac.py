import json
import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

api_responses = {}

def handle_response(response):
    url = response.url
    # Look for API requests
    if "api" in url or "graphql" in url or "json" in response.headers.get("content-type", ""):
        print(f"📡 API Response: {url}")
        try:
            data = response.json()
            api_responses[url] = data
            print(f"   -> Keys / count: {len(data) if isinstance(data, (list, dict)) else type(data)}")
        except Exception:
            pass

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel='chrome', headless=True)
        page = browser.new_page()
        page.on("response", handle_response)
        
        print("🌐 Navigating to https://trohoalac.com/phong-tro ...")
        page.goto("https://trohoalac.com/phong-tro", timeout=30000)
        page.wait_for_timeout(6000)
        
        print("\n🌐 Navigating to https://trohoalac.com/map ...")
        try:
            page.goto("https://trohoalac.com/map", timeout=30000)
            page.wait_for_timeout(6000)
        except Exception as e:
            print(f"Map navigation error: {e}")
            
        browser.close()

    with open("output/trohoalac_api_dump.json", "w", encoding="utf-8") as f:
        json.dump(api_responses, f, ensure_ascii=False, indent=2)
    print(f"\n🎉 Saved {len(api_responses)} API responses to output/trohoalac_api_dump.json")

if __name__ == '__main__':
    main()
