from fastapi import FastAPI
from database import users_collection, policies_collection, claims_collection, User
from ai_engine import ai_engine
from triggers import check_weather_api, process_instant_payout
from apscheduler.schedulers.background import BackgroundScheduler
import datetime
import uuid
import random
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SafeGig AI Parametric Insurance")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. ONBOARDING ---
@app.post("/register")
def register_worker(user: User):
    users_collection.insert_one(user.model_dump())
    return {"message": "Worker Registered Successfully", "user_id": user.user_id}

# --- 2. RISK PROFILING & POLICY CREATION ---
@app.get("/get_quote/{zone}")
def get_quote(zone: str):
    # Mock forecast data for the zone
    mock_forecast = {"rain_probability": 85, "max_temp": 35, "historical_strike_risk": "Low"}
    
    # AI calculates dynamic weekly premium
    premium = ai_engine.calculate_weekly_premium(zone, mock_forecast)
    return {"zone": zone, "weekly_premium": premium, "coverage": 500.0}

@app.post("/buy_policy")
def buy_policy(user_id: str, zone: str, premium: float):
    policy_id = f"POL-{uuid.uuid4().hex[:6].upper()}"
    start_date = datetime.datetime.now()
    end_date = start_date + datetime.timedelta(days=7) # WEEKLY pricing
    
    policy = {
        "policy_id": policy_id, "user_id": user_id, "zone": zone,
        "start_date": str(start_date), "end_date": str(end_date),
        "weekly_premium": premium, "coverage_amount": 500.0, "status": "Active"
    }
    policies_collection.insert_one(policy)
    policy.pop("_id", None)
    return {"message": "Weekly Policy Activated", "policy": policy}

# --- 3. THE PARAMETRIC ENGINE (Runs automatically) ---
def parametric_monitor_job():
    """This runs every 30 minutes in the background to check for disruptions"""
    print(f"[{datetime.datetime.now()}] 🌤 Monitoring triggers for active zones...")
    
    active_policies = list(policies_collection.find({"status": "Active"}))
    zones_to_check = set([p["zone"] for p in active_policies])
    
    for zone in zones_to_check:
        weather = check_weather_api(zone)
        
        # Check Parametric Triggers
        is_disruption = False
        trigger_type = ""
        
        if weather["rain_mm"] > 50:
            is_disruption = True
            trigger_type = "Heavy Rain"
        elif weather["temp"] > 45:
            is_disruption = True
            trigger_type = "Extreme Heat"
            
        if is_disruption:
            print(f"🚨 DISRUPTION DETECTED in {zone}: {trigger_type}. Initiating Claims...")
            # Find all workers in this zone with active policies
            affected_policies = [p for p in active_policies if p["zone"] == zone]
            
            for policy in affected_policies:
                # --- 4. INTELLIGENT FRAUD DETECTION ---
                # Mock worker metrics (In real life, fetched from their phone/app)
                gps_distance = random.uniform(0, 20) # 0km to 20km away
                
                is_fraud = ai_engine.detect_fraud(
                    user_gps_distance=gps_distance, 
                    deliveries_during_event=0, 
                    moving_velocity=0.0
                )
                
                if is_fraud:
                    print(f"🛑 FRAUD FLAG: Claim rejected for user {policy['user_id']}. GPS Mismatch.")
                    status = "Fraud_Flagged"
                else:
                    # --- 5. AUTOMATED PAYOUT ---
                    process_instant_payout(policy['user_id'], policy['coverage_amount'])
                    status = "Approved"
                    
                # Record Claim
                claim = {
                    "claim_id": f"CLM-{uuid.uuid4().hex[:6].upper()}",
                    "policy_id": policy["policy_id"],
                    "user_id": policy["user_id"],
                    "trigger_type": trigger_type,
                    "amount_paid": policy["coverage_amount"] if status == "Approved" else 0.0,
                    "status": status,
                    "timestamp": str(datetime.datetime.now())
                }
                claims_collection.insert_one(claim)

# Start Background Scheduler
scheduler = BackgroundScheduler()
# For demo purposes, we run it every 1 minute. In real life, minutes=30.
scheduler.add_job(parametric_monitor_job, 'interval', minutes=1)
scheduler.start()

# Endpoint to view user claims
@app.get("/my_claims/{user_id}")
def get_claims(user_id: str):
    claims = list(claims_collection.find({"user_id": user_id}, {"_id": 0}))
    return {"claims": claims}