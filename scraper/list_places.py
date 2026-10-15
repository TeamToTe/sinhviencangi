import sys, csv
sys.stdout.reconfigure(encoding='utf-8')
with open('output/hoalac_places.csv', mode='r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    for i, r in enumerate(reader, 1):
        print(f"{i:2d}. [{r.get('category')}] {r.get('name')} | lat: {r.get('lat')} lng: {r.get('lng')} | {r.get('area_name')}")
