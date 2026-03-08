import numpy as np
from sklearn.linear_model import LinearRegression

class AIEngine:
    def __init__(self):
        # Initialize a basic Linear Regression Model for premium pricing
        self.pricing_model = LinearRegression()
        
        # Historical Data: X = [Temperature_C, Rain_Probability_%]
        # Y = Premium in Rupees (Target based on historical loss ratios)
        X_train = np.array([
            [30, 10],  # Normal day -> Base risk
            [35, 20],  # Warm day -> Slight risk
            [40, 10],  # Very hot  -> Elevated risk
            [45, 0],   # Extreme Heatwave -> High payout risk
            [25, 60],  # Cool but rainy -> High risk
            [28, 90],  # Heavy Storm -> Very High risk
        ])
        
        # Premiums required to cover those risks safely
        y_train = np.array([49, 52, 65, 80, 75, 95])
        
        # Train our model right when the server starts!
        self.pricing_model.fit(X_train, y_train)

    def calculate_weekly_premium(self, temperature_c: float, rain_probability: float) -> int:
        """
        Takes live weather data and predicts the exact premium dynamically.
        """
        features = np.array([[temperature_c, rain_probability]])
        predicted_premium = self.pricing_model.predict(features)[0]
        
        # Hard cap the premium constraints to prevent crazy numbers
        final_premium = max(49, min(int(predicted_premium), 99))
        return final_premium

ai_engine = AIEngine()