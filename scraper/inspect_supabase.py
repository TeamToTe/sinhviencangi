import requests
import json

supabase_url = 'https://fjavwjypitffzrfkfsmq.supabase.co'
anon_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqYXZ3anlwaXRmZnpyZmtmc21xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2OTIyNTUsImV4cCI6MjEwNjI2ODI1NX0.a_RInJbJAvYh9gQXRPotjitEfUIEPsaT5lgpnTuh4N0'

headers = {'apikey': anon_key, 'Authorization': f'Bearer {anon_key}'}
r = requests.get(f'{supabase_url}/rest/v1/', headers=headers)
spec = r.json()
defs = spec.get('definitions', {})

for tbl in ['places', 'categories']:
    if tbl in defs:
        print(f"=== Definition of {tbl} ===")
        for col, p in defs[tbl].get('properties', {}).items():
            print(f"  {col}: {p.get('type')}, format={p.get('format')}, desc={p.get('description')}")
