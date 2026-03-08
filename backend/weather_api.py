import random

def get_weather_for_pincode(pincode: str):
    """
    Simulates calling the OpenWeatherMap API using a pincode.
    In a real app, this would use the requests library to hit the external API.
    """
    # For phase 4 demonstration, we simulate dynamic weather changes based on the pincode.
    if pincode.endswith("9"):
        temp = random.randint(25, 30)
        rain_prob = random.randint(70, 100)
    elif pincode.endswith("0"):
        temp = random.randint(40, 48) # Extreme Heatwave
        rain_prob = random.randint(0, 10)
    else:
        temp = random.randint(30, 39)
        rain_prob = random.randint(0, 30)
        
    if rain_prob > 50:
        desc = "Heavy Rain"
    elif temp > 40:
        desc = "Extreme Heat"
    else:
        desc = "Clear Skies"
        
    return {
        "temperature_celsius": temp,
        "rain_probability_percent": rain_prob,
        "description": desc
    }
