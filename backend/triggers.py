import random

def check_weather_api(zone: str):
    """
    MOCK: Simulates checking OpenWeatherMap API.
    In production, this makes a requests.get() to weather API.
    """
    # Simulating a random weather event for demo purposes
    events = [
        {"type": "Normal", "rain_mm": 0, "temp": 32},
        {"type": "Heavy Rain", "rain_mm": 65, "temp": 26}, # Trigger! (>50mm)
        {"type": "Extreme Heat", "rain_mm": 0, "temp": 46}  # Trigger! (>45C)
    ]
    # For testing, let's force a trigger 30% of the time
    current_weather = random.choices(events, weights=[70, 15, 15], k=1)[0]
    return current_weather

def process_instant_payout(user_id: str, amount: float):
    """
    MOCK: Simulates Razorpay/UPI Transfer for lost income.
    """
    print(f"💰 PAYMENT SUCCESS: Sent ₹{amount} to User {user_id} via UPI.")
    return True