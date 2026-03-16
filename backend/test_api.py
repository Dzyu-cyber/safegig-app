import requests

base_url = "http://localhost:8000"

# 1. Create User
user_data = {
    "user_id": "test_user_1",
    "name": "Test User",
    "phone": "1234567890",
    "platform": "Zomato",
    "zone": "560001"
}

print("Creating user...")
try:
    resp = requests.post(f"{base_url}/test_db", json=user_data)
    print("User response:", resp.status_code, resp.json())
except Exception as e:
    print("User error:", e)

# 2. Buy Policy
policy_data = {
    "user_id": "test_user_1",
    "zone": "560001",
    "premium_paid": 89.0,
    "coverage_amount": 4000.0
}

print("\nBuying policy...")
try:
    resp = requests.post(f"{base_url}/buy_policy", json=policy_data)
    print("Policy response:", resp.status_code, resp.json())
except Exception as e:
    print("Policy error:", e)
