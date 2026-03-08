import numpy as np
from sklearn.ensemble import IsolationForest

class AIEngine:
    def __init__(self):
        # Initialize Fraud Detection Model (Anomaly Detection)
        self.fraud_detector = IsolationForest(contamination=0.05, random_state=42)
        # Dummy training data: [GPS_distance_from_zone, deliveries_completed_during_event, velocity_kmh]
        dummy_data = np.array([[2, 0, 0], [1, 0, 0], [3, 0, 0], [40, 5, 60]]) 
        self.fraud_detector.fit(dummy_data)

    def calculate_weekly_premium(self, zone: str, weather_forecast: dict) -> float:
        """
        AI Dynamic Pricing based on Weekly Forecast.
        Base premium is ₹49. Risk adds up.
        """
        base_premium = 49.0
        risk_multiplier = 1.0

        # Analyze forecast
        if weather_forecast.get("rain_probability", 0) > 70:
            risk_multiplier += 0.4  # High chance of rain
        if weather_forecast.get("max_temp", 30) > 42:
            risk_multiplier += 0.3  # Heatwave expected
        if weather_forecast.get("historical_strike_risk", "Low") == "High":
            risk_multiplier += 0.2
        
        final_premium = round(base_premium * risk_multiplier, 2)
        # Cap premium at ₹99/week
        return min(final_premium, 99.0)

    def detect_fraud(self, user_gps_distance: float, deliveries_during_event: int, moving_velocity: float) -> bool:
        """
        Returns True if FRAUD is detected, False if claim is VALID.
        """
        features = np.array([[user_gps_distance, deliveries_during_event, moving_velocity]])
        prediction = self.fraud_detector.predict(features)
        
        # -1 means Anomaly (Fraud), 1 means Normal (Valid)
        is_fraud = prediction[0] == -1
        
        # Additional logical checks
        if user_gps_distance > 15: # User is 15km away from the rain zone
            is_fraud = True
            
        return is_fraud

ai_engine = AIEngine()