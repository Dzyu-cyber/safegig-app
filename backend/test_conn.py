import psycopg2
from database import DB_CONFIG

try:
    conn = psycopg2.connect(**DB_CONFIG)
    print("SUCCESS: Connected to database.")
    conn.close()
except Exception as e:
    print(f"FAILURE: {e}")
