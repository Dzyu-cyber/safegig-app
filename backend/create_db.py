import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

db_params = {
    "dbname": "postgres",
    "user": "postgres",
    "password": "admin123",
    "host": "localhost",
    "port": "5432"
}

try:
    conn = psycopg2.connect(**db_params)
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()
    cur.execute("CREATE DATABASE safegig_db")
    cur.close()
    conn.close()
    print("SUCCESS: Database 'safegig_db' created.")
except Exception as e:
    print(f"FAILURE: {e}")
