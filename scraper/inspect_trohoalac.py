import urllib.request
import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

url = "https://trohoalac.com/phong-tro"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print(f"HTML Length: {len(html)}")
        
        if '__NEXT_DATA__' in html:
            print("🎉 Found __NEXT_DATA__!")
            m = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', html)
            if m:
                data = json.loads(m.group(1))
                page_props = data.get('props', {}).get('pageProps', {})
                print(f"pageProps keys: {list(page_props.keys())}")
                # check if rooms/places are here
                with open('output/trohoalac_next_data.json', 'w', encoding='utf-8') as f:
                    json.dump(page_props, f, ensure_ascii=False, indent=2)
                print("Saved pageProps to output/trohoalac_next_data.json")
        else:
            print("No __NEXT_DATA__. Checking API URLs in HTML...")
            api_matches = re.findall(r'https?://[a-zA-Z0-9.-]+(?:/api/[a-zA-Z0-9._/-]+)', html)
            print("APIs found:", set(api_matches))
            
            # Check script files
            scripts = re.findall(r'src="(/[^"]+\.js)"', html)
            print("Script files:", scripts[:5])
except Exception as e:
    print(f"Error: {e}")
