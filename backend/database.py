from pymongo import MongoClient
from pydantic import BaseModel

# Connect to Local MongoDB (Make sure MongoDB is installed and running)
client = MongoClient("mongodb://localhost:27017/")
db = client["safegig_db"]

users_collection = db["users"]
policies_collection = db["policies"]
claims_collection = db["claims"]

# Data Models (Schemas)
class User(BaseModel):
    user_id: str
    name: str
    phone: str
    platform: str # e.g., Zomato, Swiggy
    zone: str # e.g., Hyderabad_Hitech

class Policy(BaseModel):
    policy_id: str
    user_id: str
    zone: str
    start_date: str
    end_date: str
    weekly_premium: float
    coverage_amount: float # Payout for loss of income
    status: str # "Active", "Expired"

class Claim(BaseModel):
    claim_id: str
    policy_id: str
    user_id: str
    trigger_type: str # "Heavy Rain", "Extreme Heat", "Strike"
    amount_paid: float
    status: str # "Approved", "Fraud_Flagged"
    timestamp: str