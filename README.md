<h1 align="center">🛡️ SafeGig</h1>

<p align="center">
  <strong>Parametric Insurance for the Gig Economy</strong><br>
  <em>Phase 1: Ideation & Foundation — "Know Your Delivery Worker"</em>
</p>

## 📖 Overview

SafeGig is an innovative, AI-driven parametric insurance platform tailored specifically for delivery partners and gig economy workers. It provides instant, automated financial protection against external, uncontrollable factors—like extreme weather, natural disasters, and unexpected roadblocks. When a gig worker can't operate due to these environmental blockers, SafeGig ensures they don't suffer a devastating loss of daily wages.

## 🎯 The Requirement & Persona Scenarios

Gig workers face daily risks that are entirely out of their control. Traditional insurance is paper-heavy, slow, and simply doesn't cover daily wage loss due to immediate environmental circumstances. 

### Persona: Raj, Zomato/Swiggy Delivery Partner
- **Scenario:** Raj relies on daily deliveries in Mumbai to support his family. During peak monsoon, localized extreme flooding hits his primary operating zone.
- **Problem:** He cannot safely deliver food, resulting in a total loss of an entire day's earnings.
- **Solution with SafeGig:** Raj had previously purchased the "Max Shield" for his specific zone. The backend parametric engine detects the extreme flood (via the OpenWeatherMap API) in Raj's location. Without Raj lifting a finger to file paperwork, SafeGig automatically verifies the trigger, validates his location history for fraud prevention, and instantly processes a payout to cover his estimated lost daily income.

### Application Workflow
1. **Onboarding:** Raj logs in via Phone OTP (Firebase) and sets his delivery profile (e.g., 2-wheeler, Mumbai Zone).
2. **Dynamic Pricing:** The AI engine calculates a dynamic weekly premium based on his operating zone and vehicle type.
3. **Shield Selection:** Raj purchases a weekly policy (e.g., Standard or Max Shield) using his preferred payment method (Razorpay/Stripe).
4. **Parametric Monitoring:** Our backend continuous monitors external APIs (Weather, Traffic) for his registered zone.
5. **Instant Payout:** A trigger is hit (e.g., severe rainfall). The app automatically validates his history, passes the fraud check, and immediately initiates a claim payout directly to his account.

## 💳 Weekly Premium Model & Triggers

Traditional monthly or yearly insurance premiums are difficult for gig workers to afford upfront. SafeGig operates on a **Weekly Premium Model**, aligning perfectly with their typical weekly payout cycles from major delivery aggregators.

### Parametric Triggers (Shield Tiers)
- 🥉 **Basic Shield (~₹70/week):** Extreme Rainfall, Extreme Heat.
- 🥈 **Standard Shield (~₹90/week):** Adds Extreme Pollution, Strikes/Roadblocks.
- 🥇 **Max Shield (~₹120/week):** Adds App Server Outages (Delivery platforms), Floods, Cyclonic Winds.

### Platform Justification: Mobile-First Strategy
SafeGig is intentionally designed as a **Mobile Application** (React Native). Gig workers conduct 100% of their business on their smartphones while moving. A mobile-first approach is essential to collect background location data (critical for fraud validation), send instant push notifications for claim alerts, and seamlessly integrate with local communication channels like WhatsApp for support and reminders.

## 🧠 AI & Machine Learning Integration

SafeGig leverages AI and Machine Learning in two core workflows to ensure economic viability and platform security:

1. **Dynamic Premium Calculation:**
   Instead of flat pricing, the *AI Risk Assessment Engine* dynamically adjusts the base tier pricing. If historical or forecasted weather data predicts high rainfall in a specific pin code during the upcoming week, the premium adjusts incrementally (e.g., ₹70 → ₹74) to accurately reflect the localized risk.
   
2. **Intelligent Fraud Detection:**
   - **Location Validation:** Validates if the user's historical GPS pings genuinely place them in the triggered disaster zone.
   - **Anomaly Detection:** ML algorithms detect patterns of duplicate claims, spoofed GPS locations, or irregular behavior, automatically flagging suspicious activities to the admin dashboard before a payout is authorized.

## 🛠️ Technology Stack

Our architecture is optimized for real-time parametric monitoring, rapid mobile development, and scalable data processing.

- **Frontend (Mobile App):** React Native (Expo) — For fluid cross-platform delivery with a premium UI (glassmorphism, Reanimated micro-animations).
- **Frontend (Admin Web Dashboard):** React.js (Vite) + Tailwind CSS + Recharts (for visual analytics).
- **Backend Core:** Python (FastAPI) — Extremely fast, ideal for AI/ML routing, and asynchronous API handling.
- **Database:** PostgreSQL (with SQLAlchemy) — Chosen over NoSQL primarily because relational databases provide superior integrity for strict financial ledgers, active policies, and claim tracking. *(Note: MongoDB is supported for rapid prototyping).*
- **Background Workers:** Python Celery with Redis — Essential for continuous polling of parametric APIs (Weather/Traffic).
- **Third-Party Integrations:**
  - **Auth:** Firebase Authentication (Phone OTP).
  - **Payments:** Razorpay Sandbox / Stripe Test Mode.
  - **Oracles/APIs:** OpenWeatherMap API, TomTom Traffic API.
  - **Messaging:** Twilio WhatsApp API.

## 🚀 Development Plan: 9-Phase Upgrade

This roadmap breaks down the development into short, focused phases to maximize efficiency, ensure a high-quality user interface, and maintain momentum.

- **Phase 1: Project Setup & UI Foundation** (React Native skeleton, premium design system).
- **Phase 2: Authentication & Profiling** (Firebase Phone OTP, Delivery worker onboarding flow).
- **Phase 3: Shield Selection & Pricing UI** (Dynamic tier mockups and policy checkout flow).
- **Phase 4: AI Risk Assessment Engine** (Predictive modeling for premium adjustments).
- **Phase 5: External API Integrations** (Wiring OpenWeatherMap and TomTom sandbox APIs).
- **Phase 6: Parametric Automation & Claims** (Celery background tasks monitoring active user triggers).
- **Phase 7: Intelligent Fraud Detection** (Location/GPS validation, anomaly flagging).
- **Phase 8: Admin Analytics Dashboard** (Web portal to visualize active claims and flagged metrics).
- **Phase 9: Value-Add Extras** (Twilio Multilingual alerts, localized hydration and utility reminders).

## 🚨 Adversarial Defense & Anti-Spoofing Strategy

### 1. Spotting the Faker from the Genuinely Stranded Worker
*   **"Mock Location" Detection:** Modern smartphone OS layers allow users to spoof GPS using developer tools. Our React Native app directly queries the OS to verify if the location is mocked (`isMockingLocation` flag). If a user claims to be in a flood zone but the OS reports the location is simulated, the claim is instantly dropped.
*   **Time-Sync Validation:** Fakers often change their device time to manipulate claim windows. We validate the device's local timestamp against our secure Python FastApi server timestamp. If there is a massive drift (e.g., device claims it's 2 PM, server knows it's 10 AM), it's a confirmed spoof attempt.

### 2. What Data Catches a Coordinated Fraud Ring?
*   **The "Impossible Sync" (Redis Rate Limiting):** A coordinated script farm of 500 delivery partners will often strike at the exact same millisecond. We use Redis on our backend to monitor incoming claim requests. If 500 claims trigger from the *exact same GPS coordinate* (down to the 6th decimal) or the *exact same IP address* within a 3-minute window, the Python backend flags it as a Sybil attack and temporarily blocks the IP.
*   **Velocity Checks (Physical Reality Check):** We store recent delivery pings in PostgreSQL. If a worker logged a delivery 10 minutes ago in an unaffected zone, and suddenly requests a claim from the epicenter of a market crash zone 40 kilometers away without the necessary physical transit time, the math proves it's a fake GPS jump.

### 3. Flagging Bad Actors Without Punishing Honest Ones (Safe-Fail Approach)
*   **The Conditional Queue:** We don't automatically deny every suspicious claim (which helps hackers reverse-engineer our logic). Instead, claims from newly registered accounts (< 7 days old) or accounts with zero historical deliveries are automatically routed to a "Pending Admin Review" queue in our web dashboard. 
*   **The "Photo Proof" Fallback:** If a genuine worker is accidentally flagged, the app offers a frictionless fallback: the camera opens and asks for a live photo of the current environment (e.g., flooded street). A genuine worker takes the photo in 5 seconds and gets paid. A bot or script farm running on an emulator cannot produce a live photo of a local flood, entirely neutralizing the attack.

## ✅ Verification Plan

- **Automated Tests:** Comprehensive unit tests on the AI risk mathematical formulas and integration testing on Backend API endpoints (Auth, Premium calculations, Fraud metrics).
- **Manual Verification:** End-to-end device testing of the OTP flow and React Native UI. Sandbox payment testing, followed by triggering a mocked weather event via Postman/cURL to ensure the parametric claim is instantly dispatched and appropriately logged.

---
*Built to financially empower the delivery heroes of the gig economy.*
