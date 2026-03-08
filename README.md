# 🛡️ SafeGig India - AI Parametric Insurance

SafeGig is a modern AI-powered income protection application designed specifically for gig workers (delivery partners, drivers, etc.). It automatically profiles risk using AI and issues weekly micro-insurance policies. 

When major disruptions hit (like extreme heat, heavy rain, or strikes), the Parametric Engine triggers automatically. SafeGig's AI detects geographical anomalies to prevent fraud, and instantly processes automated payouts to gig workers without them ever having to file a manual claim!

## ✨ Key Features
- **Dynamic AI Quoting:** Uses `Scikit-learn` models and simulated weather data to calculate real-time weekly premiums.
- **Parametric Engine Monitor:** background jobs acting as "oracles" that scan local weather APIs and trigger payouts instantly.
- **Intelligent Fraud Detection:** Identifies mismatched GPS anomalies (Isolation Forest model) to prevent false claims.
- **Cross-Platform App:** Built natively with React Native inside Expo.

## 🏗️ Tech Stack
- **Frontend App:** React Native, Expo CLI, Axios.
- **Backend API:** Python, FastAPI, Uvicorn, APScheduler.
- **Database:** MongoDB (Local).
- **Machine Learning:** Scikit-Learn (Isolation Forests), Numpy.

---

## 🚀 How to Run the Project Locally

To run the full stack, you must launch all three components separately. Follow these steps exactly:

### Step 1: Start MongoDB
The backend requires a local MongoDB server to save gig worker profiles, policies, and claim history.
1. Download [MongoDB Community Server](https://www.mongodb.com/try/download/community) if you don't already have it.
2. Ensure the `MongoDB` service is running in your background on port `27017`.
*(If this is not running, the FastAPI server will crash).*

### Step 2: Start the Python Backend
The AI engine and the parametric monitors sit here.
1. Open a new terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install the necessary Python packages:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the FastAPI local server:
   ```bash
   uvicorn main:app --reload
   ```
*(You must leave this terminal open and running! The APIs will be hosted on `http://127.0.0.1:8000`)*

### Step 3: Start the React Native Frontend
The user dashboard where gig workers buy policies and view payouts.
1. Open a **second** new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the Node modules:
   ```bash
   npm install
   ```
3. Start the Expo bundler:
   ```bash
   npx expo start --clear
   ```
4. Once the QR code appears in the terminal, **press `w` on your keyboard** to launch the actual mobile view inside of your web browser!

> **Testing on a physical phone?**
> You can download the "Expo Go" app on your iOS/Android device to scan the QR code. However, you must first edit `frontend/App.js` (line 6) and change `127.0.0.1` to match your computer's exact local Wi-Fi IP address!
