import sqlite3
import requests
import json
import os

print("=== 1. CHECK LOCAL SQLITE ===")
sqlite_path = "backend/data/connecthub.sqlite"
if os.path.exists(sqlite_path):
    conn = sqlite3.connect(sqlite_path)
    cur = conn.cursor()
    cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [r[0] for r in cur.fetchall()]
    print("Tables:", tables)
    if 'places' in tables:
        cur.execute("SELECT COUNT(*) FROM places;")
        print("Total places in SQLite:", cur.fetchone()[0])
        cur.execute("PRAGMA table_info(places);")
        cols = [f"{c[1]} ({c[2]})" for c in cur.fetchall()]
        print("Columns in places table:", cols)
        cur.execute("SELECT id, name, area, latitude, longitude FROM places ORDER BY id DESC LIMIT 5;")
        print("Latest places:")
        for r in cur.fetchall():
            print("  *", r)
    conn.close()
else:
    print("No SQLite file at", sqlite_path)

print("\n=== 2. CHECK REMOTE SUPABASE REST ===")
supabase_url = "https://fjavwjypitffzrfkfsmq.supabase.co"
anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqYXZ3anlwaXRmZnpyZmtmc21xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2OTIyNTUsImV4cCI6MjEwNjI2ODI1NX0.a_RInJbJAvYh9gQXRPotjitEfUIEPsaT5lgpnTuh4N0"

headers = {
    "apikey": anon_key,
    "Authorization": f"Bearer {anon_key}",
}

try:
    r = requests.get(f"{supabase_url}/rest/v1/places?select=id,name,latitude,longitude&limit=5", headers=headers, timeout=10)
    print("Supabase Status:", r.status_code)
    if r.status_code == 200:
        places = r.json()
        print(f"Supabase returned {len(places)} places:")
        for p in places:
            print("  *", p)
    else:
        print("Supabase response:", r.text[:200])
except Exception as e:
    print("Supabase error:", e)
