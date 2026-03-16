import psycopg2
from psycopg2.extras import RealDictCursor
from pydantic import BaseModel
import os

# Database Connection Details
DB_CONFIG = {
    "dbname": "safegig_db",
    "user": "postgres",
    "password": "admin123", # USER: Please update this or use environment variables
    "host": "localhost",
    "port": "5432"
}

def get_db_connection():
    try:
        conn = psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)
        return conn
    except Exception as e:
        print(f"Error connecting to PostgreSQL: {e}")
        return None

def init_db():
    conn = get_db_connection()
    if not conn:
        return
    
    cur = conn.cursor()
    
    # Create Users Table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            user_id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(100),
            phone VARCHAR(20),
            platform VARCHAR(50),
            zone VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    
    # Create Policies Table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS policies (
            policy_id SERIAL PRIMARY KEY,
            user_id VARCHAR(50) REFERENCES users(user_id),
            zone VARCHAR(100),
            start_date TIMESTAMP,
            end_date TIMESTAMP,
            weekly_premium FLOAT,
            coverage_amount FLOAT,
            status VARCHAR(20) DEFAULT 'Active'
        );
    """)
    
    # Create Claims Table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS claims (
            claim_id SERIAL PRIMARY KEY,
            policy_id INTEGER REFERENCES policies(policy_id),
            user_id VARCHAR(50) REFERENCES users(user_id),
            trigger_type VARCHAR(50),
            amount_paid FLOAT,
            status VARCHAR(20),
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    
    conn.commit()
    cur.close()
    conn.close()
    print("PostgreSQL Tables Initialized!")

# Data Models (Schemas)
class UserSchema(BaseModel):
    user_id: str
    name: str = "Rahul Sharma"
    phone: str
    platform: str
    zone: str

class PolicySchema(BaseModel):
    user_id: str
    zone: str
    premium_paid: float
    coverage_amount: float = 4000.0

class ClaimSchema(BaseModel):
    policy_id: int
    user_id: str
    trigger_type: str
    amount_paid: float
    status: str = "Approved"