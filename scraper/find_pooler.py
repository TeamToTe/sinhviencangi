import psycopg2
import socket

regions = [
    'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ap-northeast-2',
    'ap-south-1', 'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
    'ca-central-1', 'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3',
    'sa-east-1'
]

password = "vi6pQ5q7*qs!%mB"
tenant = "fjavwjypitffzrfkfsmq"
user = f"postgres.{tenant}"

print("Scanning Supabase pooler regions for tenant:", tenant)
found_region = None

for r in regions:
    host = f"aws-0-{r}.pooler.supabase.com"
    try:
        ip = socket.gethostbyname(host)
    except Exception:
        continue
    
    try:
        conn = psycopg2.connect(
            host=host,
            port=6543,
            dbname="postgres",
            user=user,
            password=password,
            connect_timeout=4
        )
        print(f"🎉 BINGO! Connected successfully to region: {r} ({host})")
        found_region = r
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM places;")
        print("Places count in Supabase:", cur.fetchone()[0])
        conn.close()
        break
    except Exception as e:
        err_msg = str(e).strip()
        if "password authentication failed" in err_msg:
            print(f"🔑 Region {r} matches tenant! (Password check needed: {err_msg})")
            found_region = r
            break
        elif "tenant/user" in err_msg:
            # Wrong region
            pass
        else:
            print(f"Region {r}: {err_msg[:60]}")

if not found_region:
    print("Could not find pooler region among standard list.")
