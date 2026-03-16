import psycopg2
from database import DB_CONFIG

try:
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")
    tables = cur.fetchall()
    print("Tables in database:", [t[0] for t in tables])
    cur.close()
    conn.close()
except Exception as e:
    print(f"FAILURE: {e}")
