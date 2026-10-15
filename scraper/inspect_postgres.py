import psycopg2
import urllib.parse

# Password in backend/.env: vi6pQ5q7*qs!%mB
password = "vi6pQ5q7*qs!%mB"
encoded_password = urllib.parse.quote_plus(password)
host = "db.fjavwjypitffzrfkfsmq.supabase.co"
port = 5432
dbname = "postgres"
user = "postgres"

db_url = f"postgresql://{user}:{encoded_password}@{host}:{port}/{dbname}"

print("Connecting to Supabase PostgreSQL at", host)
try:
    conn = psycopg2.connect(db_url, connect_timeout=15)
    cur = conn.cursor()
    cur.execute("""
        SELECT table_name, column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        ORDER BY table_name, ordinal_position;
    """)
    rows = cur.fetchall()
    print("Found columns in Supabase public schema:")
    current_table = None
    for tbl, col, dt in rows:
        if tbl != current_table:
            current_table = tbl
            print(f"\n--- Table: {tbl} ---")
        print(f"  {col}: {dt}")
        
    print("\n=== Check categories in Supabase ===")
    cur.execute("SELECT * FROM categories;")
    cats = cur.fetchall()
    print(f"Categories ({len(cats)} rows):", cats)
    
    print("\n=== Check places in Supabase ===")
    cur.execute("SELECT * FROM places;")
    pls = cur.fetchall()
    print(f"Places ({len(pls)} rows):", pls)
    
    conn.close()
except Exception as e:
    print("Failed to connect directly to Supabase Postgres:", e)
