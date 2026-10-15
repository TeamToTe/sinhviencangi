"""
📥 Import dữ liệu đã verify vào Supabase DB
CHỈ CHẠY SAU KHI ĐÃ VERIFY DỮ LIỆU BẰNG FILE hoalac_verify_checklist.csv

Usage:
  # Dry run (xem preview, không insert)
  python scraper/import_to_db.py --dry-run

  # Import thật
  python scraper/import_to_db.py --csv scraper/output/hoalac_places.csv

  # Import chỉ các quán đã verified
  python scraper/import_to_db.py --csv scraper/output/hoalac_places.csv --only-verified
"""

import argparse
import csv
import json
import os
import sys

def load_csv(filepath: str) -> list[dict]:
    """Load POIs từ CSV file."""
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        return list(reader)


def map_category_to_id(category_key: str) -> int:
    """Map ConnectHub category key sang category_id trong DB."""
    # Mapping theo thứ tự seed trong migration
    mapping = {
        'boarding_house': 1,
        'food_drink': 2,
        'grocery': 3,
        'pharmacy': 4,
        'services': 5,
        'entertainment': 6,
        'campus': 7,
    }
    return mapping.get(category_key, 2)  # Default: food_drink


def build_insert_payload(row: dict) -> dict:
    """Chuyển 1 row CSV sang payload INSERT cho bảng places."""
    return {
        "category_id": map_category_to_id(row.get("category", "")),
        "name": row.get("name", ""),
        "area": row.get("area_name", ""),
        "address": row.get("address", ""),
        "latitude": float(row.get("lat", 0)),
        "longitude": float(row.get("lng", 0)),
        "min_price": int(row.get("min_price", 0)) or None,
        "max_price": int(row.get("max_price", 0)) or None,
        "opening_hours": row.get("opening_hours", "") or None,
        "phone": row.get("phone", "") or None,
        "amenities": row.get("tags", "").split(",") if row.get("tags") else None,
    }


def preview_import(rows: list[dict]):
    """Preview dữ liệu sẽ import."""
    print("\n📋 PREVIEW DỮ LIỆU SẼ IMPORT:")
    print("=" * 70)
    
    for i, row in enumerate(rows, 1):
        payload = build_insert_payload(row)
        print(f"\n[{i}] {payload['name']}")
        print(f"    Category ID: {payload['category_id']}")
        print(f"    Area: {payload['area']}")
        print(f"    Coords: ({payload['latitude']}, {payload['longitude']})")
        print(f"    Phone: {payload.get('phone', 'N/A')}")
        print(f"    Hours: {payload.get('opening_hours', 'N/A')}")
        if payload.get('amenities'):
            print(f"    Tags: {', '.join(payload['amenities'][:5])}")
    
    print(f"\n📊 Tổng: {len(rows)} địa điểm")
    print("=" * 70)


def main():
    parser = argparse.ArgumentParser(description="Import POI data to Supabase")
    parser.add_argument(
        '--csv', default='scraper/output/hoalac_places.csv',
        help='Path to CSV file'
    )
    parser.add_argument(
        '--dry-run', action='store_true',
        help='Chỉ preview, không insert vào DB'
    )
    parser.add_argument(
        '--only-verified', action='store_true',
        help='Chỉ import các quán có status = verified'
    )
    args = parser.parse_args()
    
    # Load data
    csv_path = args.csv
    if not os.path.isabs(csv_path):
        csv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), csv_path)
    
    if not os.path.exists(csv_path):
        print(f"❌ File không tồn tại: {csv_path}")
        print("   Chạy scraper trước: python scraper/scrape_hoalac.py --mode full")
        sys.exit(1)
    
    rows = load_csv(csv_path)
    print(f"📂 Loaded {len(rows)} rows from {csv_path}")
    
    # Filter verified only
    if args.only_verified:
        rows = [r for r in rows if r.get('status') == 'verified']
        print(f"🔍 Filtered to {len(rows)} verified places")
    
    if not rows:
        print("⚠️  Không có dữ liệu để import!")
        sys.exit(0)
    
    # Preview
    preview_import(rows)
    
    if args.dry_run:
        print("\n🏃 DRY RUN - Không insert vào DB")
        print("   Để import thật, bỏ flag --dry-run")
        
        # Export SQL statements for manual import
        sql_file = os.path.join(os.path.dirname(csv_path), "import_places.sql")
        with open(sql_file, 'w', encoding='utf-8') as f:
            f.write("-- Auto-generated INSERT statements from scraped data\n")
            f.write("-- Review trước khi chạy!\n\n")
            
            for row in rows:
                payload = build_insert_payload(row)
                tags_sql = "ARRAY[" + ",".join(f"'{t.strip()}'" for t in (payload['amenities'] or [])) + "]" if payload.get('amenities') else "NULL"
                
                f.write(f"""INSERT INTO places (category_id, name, area, address, latitude, longitude, min_price, max_price, opening_hours, phone, amenities)
VALUES ({payload['category_id']}, '{payload['name'].replace("'", "''")}', '{(payload['area'] or '').replace("'", "''")}', '{(payload['address'] or '').replace("'", "''")}', {payload['latitude']}, {payload['longitude']}, {payload.get('min_price') or 'NULL'}, {payload.get('max_price') or 'NULL'}, {f"'{payload['opening_hours']}'" if payload.get('opening_hours') else 'NULL'}, {f"'{payload['phone']}'" if payload.get('phone') else 'NULL'}, {tags_sql});\n\n""")
        
        print(f"\n📝 SQL statements exported to: {sql_file}")
        print("   Có thể copy paste vào Supabase SQL Editor để import")
        return
    
    # Real import via Supabase REST API
    print("\n⚠️  IMPORT THẬT VÀO DATABASE")
    print("   Cần set biến môi trường:")
    print("   SUPABASE_URL=https://xxx.supabase.co")
    print("   SUPABASE_SERVICE_KEY=eyJhbG...")
    
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
    
    if not supabase_url or not supabase_key:
        print("\n❌ Chưa set SUPABASE_URL và SUPABASE_SERVICE_KEY!")
        print("   Dùng --dry-run để export SQL thay thế.")
        sys.exit(1)
    
    import requests
    
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }
    
    success = 0
    errors = 0
    
    for row in rows:
        payload = build_insert_payload(row)
        try:
            resp = requests.post(
                f"{supabase_url}/rest/v1/places",
                headers=headers,
                json=payload,
                timeout=10,
            )
            if resp.status_code in (200, 201):
                success += 1
                print(f"  ✅ {payload['name']}")
            else:
                errors += 1
                print(f"  ❌ {payload['name']}: {resp.status_code} {resp.text[:100]}")
        except Exception as e:
            errors += 1
            print(f"  ❌ {payload['name']}: {e}")
    
    print(f"\n📊 Import hoàn tất: {success} thành công, {errors} lỗi")


if __name__ == "__main__":
    main()
