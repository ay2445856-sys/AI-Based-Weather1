# ForecastGuard AI
## AI-Based Forecast Bust Detection for Medium-Range Weather Forecasts

> **Smart India Hackathon (SIH) Intelligent Weather Platform**  
> *A modern, professional weather intelligence and AI analytics dashboard that monitors medium-range weather forecasts (Day 1 to Day 15), compares numerical predictions with observed ground station data, and estimates the probability that a forecast may "bust" (fail catastrophically).*

---

## 🌟 Key Features

1. **Executive Weather & Bust Risk Dashboard**
   - Real-time station telemetry for major Indian geographical regions (Prayagraj, New Delhi, Mumbai, Bengaluru, Shimla, Chennai, Kolkata, Jaipur, etc.).
   - Key parameters: Temperature (°C), Humidity (%), Wind Speed (km/h), Rain Probability (%), Weather Condition.
   - Dual Intelligence Metrics: **AI Forecast Confidence (%)** and **Forecast Bust Risk** categorized into 🟢 **LOW**, 🟡 **MEDIUM**, and 🔴 **HIGH** (e.g. 87% Bust Risk for Prayagraj convective rainfall).
   - "Run AI Analysis" action button for instant neural inference.

2. **Comparative Forecast Analysis**
   - Multi-parameter comparative analysis (Rainfall, Temperature, Wind Speed, Humidity, Pressure).
   - Real scorecard calculating: Absolute Error, Percentage Error, Forecast Confidence, and Bust Probability.
   - 7-Day comparative bar and difference line chart powered by Chart.js.

3. **AI Bust Detection & Custom Scenario Simulator**
   - High-fidelity radial risk gauge with dynamic SVG stroke animation.
   - Deep-dive diagnostic triggers (large forecast error, high weather uncertainty, high ensemble spread, rapid weather change, historical instability).
   - Interactive parameter simulator: Test custom forecast vs observed readings, ensemble spread ($\sigma$), and convective CAPE proxy values with instant re-calculation.
   - Explainable AI (XAI): SHAP-style percentage attribution bars for risk drivers.

4. **15-Day Medium-Range Forecast Confidence Decay**
   - Visualizing the physical predictability curve from Day 1 (95%) down to Day 15 (24%).
   - Dynamic upper/lower uncertainty envelope bands reflecting ensemble chaos.

5. **Multi-Parameter Error Breakdown**
   - Dedicated interactive error tabs for Temperature, Rainfall, Wind Speed, and Humidity.
   - Dual-axis error graph showing raw differences alongside percentage error rates.

6. **Interactive Geographic GIS Weather Map**
   - Leaflet.js map with custom-styled pins color-coded by risk level (🟢 Low, 🟡 Medium, 🔴 High).
   - Animated radar pulsation on high-risk stations and simulated precipitation cones.
   - Station inspect popups that seamlessly synchronize with the entire dashboard.

7. **Historical Archive & Validation**
   - 30-day continuous ground-truth archive.
   - Dual-axis temperature and rainfall co-registration chart.
   - Verified historical bust flags with one-click CSV export.

8. **AI Generated Weather Insights**
   - Natural language synoptic summaries dynamically constructed by the backend inference engine.
   - Key driving risk factors and atmospheric instability metrics (CAPE, shear, baroclinicity).

9. **Live Alert Notification Center**
   - Filterable alert feed by Risk Level (High, Medium, Stable) and geographic region.
   - Individual alert acknowledgment.

10. **About Project & SIH 2026 Innovation Roadmap**
    - Problem statement, solution architecture, technical innovation, and future milestones (ECMWF 50-member ensembles, INSAT-3DR satellite assimilation, Doppler radar sync, SMS disaster dispatch).

---

## 🏗️ Architecture

```
Weather API / NWP Ensemble
          ↓
Forecast & Observed Ground Station Data
          ↓
Quality Preprocessing & Normalization
          ↓
AI/ML Bust Detection Engine (Sigmoidal Logistic + Ensemble Spread)
          ↓
Uncertainty Quantification & Risk Classification (Low / Med / High)
          ↓
Real-Time FastAPI Web Dashboard & Leaflet GIS Alerts
```

---

## 🚀 How to Run the Application

### Option 1: One-Click Runner (Recommended)
Simply open a terminal in the project directory and run:
```bash
python run.py
```
This starts the FastAPI backend server on `http://127.0.0.1:8000` and automatically opens the dashboard in your default web browser!

### Option 2: Direct Uvicorn Launch
```bash
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
Then visit: [http://127.0.0.1:8000](http://127.0.0.1:8000)

### API Documentation (Swagger / OpenAPI)
Visit: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, Modern CSS Glassmorphism, Tailwind CSS, Vanilla JS, Chart.js, Leaflet.js, FontAwesome 6.
- **Backend:** Python 3.14, FastAPI, Uvicorn, Pydantic.
- **Algorithms:** Calibrated Ensemble Spread ($\sigma$), Mesoscale Instability Index, Multi-Feature Logistic Regressor, Explainable Feature Attribution.
