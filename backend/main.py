from fastapi import FastAPI
from pydantic import BaseModel
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from fastapi.middleware.cors import CORSMiddleware
import time

app = FastAPI(title="SafeGig Backend - Phase 2")

# --- App Configuration & CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database Setup (MongoDB) ---
# We use a try-except block in case MongoDB is not installed/running yet
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


# --- Phase 2: Route 1 - The "Calculator" ---
@app.get("/get_premium")
def get_premium():
    """
    Goal: Prove the backend can respond via the internet with simple math.
    """
    return {
        "message": "Success",
        "calculated_premium": 49,
        "currency": "INR"
    }


# --- Phase 2: Route 2 - Prove User Registration (MongoDB Write & Read) ---
class MockUser(BaseModel):
    name: str

@app.post("/test_db")
def test_db_connection(user: MockUser):
    """
    Goal: Prove we can save a fake user ('Test') to MongoDB and read it back.
    """
    if db is None or users_collection is None:
        return {"error": "MongoDB is not running. Please start MongoDB locally!"}

    # 1. SAVE to MongoDB
    fake_user_data = {
        "name": user.name,
        "timestamp": time.time(),
        "role": "Delivery Partner"
    }
    insert_result = users_collection.insert_one(fake_user_data)
    
    # 2. READ it back using the inserted ID
    saved_user = users_collection.find_one({"_id": insert_result.inserted_id})
    
    # Convert MongoDB's special ObjectId to a string so FastAPI can return it safely
    saved_user["_id"] = str(saved_user["_id"])

    return {
        "status": "Success",
        "database_status": db_status,
        "saved_and_retrieved_data": saved_user
    }


# --- Phase 2: Base Route ---
@app.get("/")
def home():
    return {
        "app": "SafeGig Backend Phase 2",
        "db_status": db_status
    }