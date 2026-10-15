import requests

# Bounding box along DT420 from Cho Hoa Lac (105.518) to Tan Xa / Phu Huu (105.545)
# Lat around 21.020 - 21.032
query = """[out:json][timeout:25];
(
  node(21.020, 105.515, 21.032, 105.545);
);
out tags;
"""

headers = {'User-Agent': 'FPTStudentMapBot/1.0', 'Accept': 'application/json'}
r = requests.post('https://maps.mail.ru/osm/tools/overpass/api/interpreter', data={'data': query}, headers=headers, timeout=25)
print('Status:', r.status_code)
if r.status_code == 200:
    nodes = r.json().get('elements', [])
    named = [n for n in nodes if n.get('tags', {}).get('name')]
    print(f'Found {len(named)} named nodes:')
    for n in named:
        print(f"  * {n.get('tags', {}).get('name')}: ({n.get('lat')}, {n.get('lon')})")
