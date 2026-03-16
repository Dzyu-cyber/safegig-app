from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
import datetime
import time

from database import get_db_connection, init_db, UserSchema, PolicySchema
from ai_engine import ai_engine
from weather_api import get_weather_for_pincode

app = FastAPI(title="SafeGig Backend - Phase 5 (PostgreSQL)")

# --- App Configuration & CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Startup Task ---
@app.on_event("startup")
def startup_event():
    init_db()
    
    # Start the Watchman Scheduler
    scheduler = BackgroundScheduler()
    scheduler.add_job(parametric_monitor_job, 'interval', minutes=1)
    scheduler.start()
    print("Watchman Scheduler Started! Monitoring for disruptions every minute.")

# --- Routes ---

@app.get("/")
def home():
    conn = get_db_connection()
    status = "Connected to PostgreSQL successfully!" if conn else "Failed to connect to PostgreSQL."
    if conn: conn.close()
    return {
        "app": "SafeGig Backend Phase 5",
        "db_status": status
    }

@app.get("/get_premium/{pincode}")
def get_premium(pincode: str):
    weather_data = get_weather_for_pincode(pincode)
    calculated_premium = ai_engine.calculate_weekly_premium(
        temperature_c=weather_data["temperature_celsius"],
        rain_probability=weather_data["rain_probability_percent"]
    )

    return {
        "message": "AI Premium Calculated",
        "pincode": pincode,
        "weather_data": weather_data,
        "calculated_premium": calculated_premium,
        "currency": "INR"
    }

@app.post("/test_db")
def test_db_connection(user: UserSchema):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database not reachable")
    
    cur = conn.cursor()
    try:
        # Upsert user
        cur.execute("""
            INSERT INTO users (user_id, name, phone, platform, zone)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (user_id) DO UPDATE SET
            name = EXCLUDED.name,
            platform = EXCLUDED.platform,
            zone = EXCLUDED.zone
            RETURNING *;
        """, (user.user_id, user.name, user.phone, user.platform, user.zone))
        saved_user = cur.fetchone()
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

    return {
        "status": "Success",
        "data": saved_user
    }

@app.post("/buy_policy")
def buy_policy(request: PolicySchema):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database not reachable")
    
    cur = conn.cursor()
    try:
        start_date = datetime.datetime.now()
        end_date = start_date + datetime.timedelta(days=7)
        
        cur.execute("""
            INSERT INTO policies (user_id, zone, start_date, end_date, weekly_premium, coverage_amount)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING policy_id;
        """, (request.user_id, request.zone, start_date, end_date, request.premium_paid, request.coverage_amount))
        
        policy_id = cur.fetchone()['policy_id']
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

    return {
        "status": "Success",
        "policy_id": policy_id
    }

# --- Parametric Engine ---

def parametric_monitor_job():
    print(f"\n[{datetime.datetime.now()}] Checking weather for active zones...")
    
    conn = get_db_connection()
    if not conn: return
    
    cur = conn.cursor()
    try:
        # Get active zones
        cur.execute("SELECT DISTINCT zone FROM policies WHERE status = 'Active';")
        zones = cur.fetchall()
        
        for row in zones:
            zone = row['zone']
            weather = get_weather_for_pincode(zone)
            print(f"Zone {zone}: Temp {weather['temperature_celsius']}°C, Rain Prob: {weather['rain_probability_percent']}%")
            
            # Simplified trigger logic
            if weather['rain_probability_percent'] > 50 or weather['temperature_celsius'] > 45:
                print(f"DISRUPTION DETECTED in {zone}!")
                # Here we would insert claims for all users in this zone
                cur.execute("""
                    INSERT INTO claims (policy_id, user_id, trigger_type, amount_paid, status)
                    SELECT policy_id, user_id, %s, 500, 'Approved'
                    FROM policies 
                    WHERE zone = %s AND status = 'Active';
                """, ("Weather Disruption", zone))
                conn.commit()
                print(f"Auto-Claims processed for zone {zone}")
                
    except Exception as e:
        print(f"Error in monitor job: {e}")
    finally:
        cur.close()
        conn.close()