from fastapi import FastAPI
from pydantic import BaseModel
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
import time
import datetime

from ai_engine import ai_engine
from weather_api import get_weather_for_pincode

app = FastAPI(title="SafeGig Backend - Phase 4")

# --- App Configuration & CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database Setup (MongoDB) ---
try:
    client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=2000)
    client.server_info()  # Forces a check to ensure it's connected
    db = client["safegig_db"]
    users_collection = db["users"]
    db_status = "Connected to MongoDB successfully! ✅"
except ServerSelectionTimeoutError:
    db_status = "Failed to connect to MongoDB. Is the server running? ❌"
    db = None
    users_collection = None


# --- Phase 4: Route 1 - The "Smart Brain" Calculator ---
@app.get("/get_premium/{pincode}")
def get_premium(pincode: str):
    """
    Goal: Pull real weather via API simulation and use Scikit-learn to determine premium.
    """
    # 1. Fetch live weather using our external API simulator
    weather_data = get_weather_for_pincode(pincode)
    
    # 2. Feed that data into the AI Model
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


# --- Phase 2: Route 2 - Prove User Registration (MongoDB Write & Read) ---
class MockUser(BaseModel):
    name: str

@app.post("/test_db")
def test_db_connection(user: MockUser):
    if db is None or users_collection is None:
        return {"error": "MongoDB is not running. Please start MongoDB locally!"}

    fake_user_data = {
        "name": user.name,
        "timestamp": time.time(),
        "role": "Delivery Partner"
    }
    insert_result = users_collection.insert_one(fake_user_data)
    saved_user = users_collection.find_one({"_id": insert_result.inserted_id})
    saved_user["_id"] = str(saved_user["_id"])

    return {
        "status": "Success",
        "database_status": db_status,
        "saved_and_retrieved_data": saved_user
    }

# --- Base Route ---
@app.get("/")
def home():
    return {
        "app": "SafeGig Backend Phase 5",
        "db_status": db_status
    }

# --- Phase 5: The Watchman (Automated Triggers) ---
def parametric_monitor_job():
    """
    Runs every minute in the background.
    """
    print(f"\n[{datetime.datetime.now()}] 🌤️ Checking weather for active zones...")
    
    # In a real app we would loop through MongoDB active policies here.
    # For now, let's monitor standard "500081" and the trigger condition "500089"
    test_zones = ["500081", "500089"]
    
    for zone in test_zones:
        weather = get_weather_for_pincode(zone)
        print(f"Zone {zone}: Temp {weather['temperature_celsius']}°C, Rain Prob: {weather['rain_probability_percent']}%")
        
        if weather['rain_probability_percent'] > 50:
            print(f"🚨 DISRUPTION DETECTED in {zone}: Heavy Rain!")
            print(f"💸 TRIGGER PAYOUT: Sending ₹500 to workers in {zone} instantly!")
        elif weather['temperature_celsius'] > 45:
            print(f"🚨 DISRUPTION DETECTED in {zone}: Extreme Heat!")
            print(f"💸 TRIGGER PAYOUT: Sending ₹500 to workers in {zone} instantly!")

@app.on_event("startup")
def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(parametric_monitor_job, 'interval', minutes=1)
    scheduler.start()
    print("Watchman Scheduler Started! Monitoring for disruptions every minute.")