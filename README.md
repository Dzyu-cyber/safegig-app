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

## ✅ Verification Plan

- **Automated Tests:** Comprehensive unit tests on the AI risk mathematical formulas and integration testing on Backend API endpoints (Auth, Premium calculations, Fraud metrics).
- **Manual Verification:** End-to-end device testing of the OTP flow and React Native UI. Sandbox payment testing, followed by triggering a mocked weather event via Postman/cURL to ensure the parametric claim is instantly dispatched and appropriately logged.

---
*Built to financially empower the delivery heroes of the gig economy.*
