"""
Mock and Calibrated Baseline Data for ForecastGuard AI.
Provides realistic weather data, ensemble spread metrics, and historical records
for major Indian geographic regions.
"""

from typing import Dict, List, Any
import datetime

LOCATIONS: Dict[str, Dict[str, Any]] = {
    "prayagraj": {
        "id": "prayagraj",
        "name": "Prayagraj",
        "state": "Uttar Pradesh",
        "country": "India",
        "lat": 25.4358,
        "lon": 81.8463,
        "elevation": 98,
        "region_type": "Gangetic Plain / Confluence River Basin"
    },
    "delhi": {
        "id": "delhi",
        "name": "New Delhi",
        "state": "Delhi NCR",
        "country": "India",
        "lat": 28.6139,
        "lon": 77.2090,
        "elevation": 216,
        "region_type": "Semi-Arid Urban Cluster"
    },
    "mumbai": {
        "id": "mumbai",
        "name": "Mumbai",
        "state": "Maharashtra",
        "country": "India",
        "lat": 19.0760,
        "lon": 72.8777,
        "elevation": 14,
        "region_type": "Coastal Arabian Sea Corridor"
    },
    "bengaluru": {
        "id": "bengaluru",
        "name": "Bengaluru",
        "state": "Karnataka",
        "country": "India",
        "lat": 12.9716,
        "lon": 77.5946,
        "elevation": 920,
        "region_type": "Deccan Plateau"
    },
    "shimla": {
        "id": "shimla",
        "name": "Shimla",
        "state": "Himachal Pradesh",
        "country": "India",
        "lat": 31.1048,
        "lon": 77.1734,
        "elevation": 2276,
        "region_type": "Himalayan Ridge"
    },
    "chennai": {
        "id": "chennai",
        "name": "Chennai",
        "state": "Tamil Nadu",
        "country": "India",
        "lat": 13.0827,
        "lon": 80.2707,
        "elevation": 6,
        "region_type": "Coromandel Coastal Plain"
    },
    "kolkata": {
        "id": "kolkata",
        "name": "Kolkata",
        "state": "West Bengal",
        "country": "India",
        "lat": 22.5726,
        "lon": 88.3639,
        "elevation": 9,
        "region_type": "Delta Estuary"
    },
    "jaipur": {
        "id": "jaipur",
        "name": "Jaipur",
        "state": "Rajasthan",
        "country": "India",
        "lat": 26.9124,
        "lon": 75.7873,
        "elevation": 431,
        "region_type": "Sub-Tropical Arid Border"
    },
    "guwahati": {
        "id": "guwahati",
        "name": "Guwahati",
        "state": "Assam",
        "country": "India",
        "lat": 26.1445,
        "lon": 91.7362,
        "elevation": 55,
        "region_type": "Brahmaputra Valley"
    },
    "hyderabad": {
        "id": "hyderabad",
        "name": "Hyderabad",
        "state": "Telangana",
        "country": "India",
        "lat": 17.3850,
        "lon": 78.4867,
        "elevation": 542,
        "region_type": "Central Deccan"
    }
}

CURRENT_WEATHER_DATA: Dict[str, Dict[str, Any]] = {
    "prayagraj": {
        "temperature": 31.0,
        "humidity": 68,
        "wind_speed": 18.0,
        "rain_probability": 72,
        "condition": "Humid & Thunderstorm Threat",
        "weather_icon": "thunderstorm",
        "forecast_confidence": 64,
        "bust_risk": "HIGH",
        "bust_probability": 87,
        "ensemble_spread": 4.8,
        "observed_rainfall": 45.0,
        "forecast_rainfall": 10.0,
        "last_updated": "2026-10-06 23:00 IST"
    },
    "delhi": {
        "temperature": 29.5,
        "humidity": 55,
        "wind_speed": 12.0,
        "rain_probability": 25,
        "condition": "Hazy Sunshine",
        "weather_icon": "cloud-sun",
        "forecast_confidence": 88,
        "bust_risk": "LOW",
        "bust_probability": 18,
        "ensemble_spread": 1.2,
        "observed_rainfall": 0.0,
        "forecast_rainfall": 2.0,
        "last_updated": "2026-10-06 23:00 IST"
    },
    "mumbai": {
        "temperature": 32.2,
        "humidity": 82,
        "wind_speed": 22.5,
        "rain_probability": 65,
        "condition": "Tropical Passing Showers",
        "weather_icon": "cloud-rain",
        "forecast_confidence": 71,
        "bust_risk": "MEDIUM",
        "bust_probability": 54,
        "ensemble_spread": 3.1,
        "observed_rainfall": 28.0,
        "forecast_rainfall": 15.0,
        "last_updated": "2026-10-06 23:00 IST"
    },
    "bengaluru": {
        "temperature": 24.8,
        "humidity": 62,
        "wind_speed": 14.0,
        "rain_probability": 20,
        "condition": "Pleasant & Partly Cloudy",
        "weather_icon": "cloud",
        "forecast_confidence": 92,
        "bust_risk": "LOW",
        "bust_probability": 14,
        "ensemble_spread": 0.9,
        "observed_rainfall": 0.0,
        "forecast_rainfall": 0.5,
        "last_updated": "2026-10-06 23:00 IST"
    },
    "shimla": {
        "temperature": 16.4,
        "humidity": 78,
        "wind_speed": 19.5,
        "rain_probability": 80,
        "condition": "Dense Fog & Orographic Rain",
        "weather_icon": "smog",
        "forecast_confidence": 58,
        "bust_risk": "HIGH",
        "bust_probability": 82,
        "ensemble_spread": 5.4,
        "observed_rainfall": 52.0,
        "forecast_rainfall": 18.0,
        "last_updated": "2026-10-06 23:00 IST"
    },
    "chennai": {
        "temperature": 33.1,
        "humidity": 75,
        "wind_speed": 16.0,
        "rain_probability": 40,
        "condition": "Warm Maritime Breeze",
        "weather_icon": "wind",
        "forecast_confidence": 79,
        "bust_risk": "MEDIUM",
        "bust_probability": 42,
        "ensemble_spread": 2.4,
        "observed_rainfall": 5.0,
        "forecast_rainfall": 8.0,
        "last_updated": "2026-10-06 23:00 IST"
    },
    "kolkata": {
        "temperature": 30.6,
        "humidity": 84,
        "wind_speed": 17.2,
        "rain_probability": 70,
        "condition": "Cyclonic Shear Clouds",
        "weather_icon": "cloud-showers-heavy",
        "forecast_confidence": 62,
        "bust_risk": "HIGH",
        "bust_probability": 78,
        "ensemble_spread": 4.5,
        "observed_rainfall": 64.0,
        "forecast_rainfall": 22.0,
        "last_updated": "2026-10-06 23:00 IST"
    },
    "jaipur": {
        "temperature": 34.5,
        "humidity": 38,
        "wind_speed": 11.0,
        "rain_probability": 10,
        "condition": "Dry & Sunny",
        "weather_icon": "sun",
        "forecast_confidence": 94,
        "bust_risk": "LOW",
        "bust_probability": 11,
        "ensemble_spread": 0.8,
        "observed_rainfall": 0.0,
        "forecast_rainfall": 0.0,
        "last_updated": "2026-10-06 23:00 IST"
    },
    "guwahati": {
        "temperature": 27.2,
        "humidity": 88,
        "wind_speed": 15.0,
        "rain_probability": 68,
        "condition": "River Mist & Local Showers",
        "weather_icon": "cloud-rain",
        "forecast_confidence": 66,
        "bust_risk": "HIGH",
        "bust_probability": 74,
        "ensemble_spread": 4.1,
        "observed_rainfall": 38.0,
        "forecast_rainfall": 12.0,
        "last_updated": "2026-10-06 23:00 IST"
    },
    "hyderabad": {
        "temperature": 28.9,
        "humidity": 60,
        "wind_speed": 13.5,
        "rain_probability": 35,
        "condition": "Partly Overcast",
        "weather_icon": "cloud-sun",
        "forecast_confidence": 83,
        "bust_risk": "LOW",
        "bust_probability": 25,
        "ensemble_spread": 1.7,
        "observed_rainfall": 2.0,
        "forecast_rainfall": 1.5,
        "last_updated": "2026-10-06 23:00 IST"
    }
}

# 15-day forecast confidence array matching the exact prompt prompt requirement
FIFTEEN_DAY_CONFIDENCE: List[Dict[str, int]] = [
    {"day": 1, "day_label": "Day 1 (24h)", "confidence": 95, "lower_bound": 92, "upper_bound": 98},
    {"day": 2, "day_label": "Day 2 (48h)", "confidence": 92, "lower_bound": 88, "upper_bound": 96},
    {"day": 3, "day_label": "Day 3 (72h)", "confidence": 88, "lower_bound": 83, "upper_bound": 93},
    {"day": 4, "day_label": "Day 4 (96h)", "confidence": 81, "lower_bound": 75, "upper_bound": 87},
    {"day": 5, "day_label": "Day 5 (120h)", "confidence": 76, "lower_bound": 69, "upper_bound": 83},
    {"day": 6, "day_label": "Day 6 (144h)", "confidence": 68, "lower_bound": 60, "upper_bound": 76},
    {"day": 7, "day_label": "Day 7 (168h)", "confidence": 61, "lower_bound": 52, "upper_bound": 70},
    {"day": 8, "day_label": "Day 8 (192h)", "confidence": 55, "lower_bound": 45, "upper_bound": 65},
    {"day": 9, "day_label": "Day 9 (216h)", "confidence": 49, "lower_bound": 38, "upper_bound": 60},
    {"day": 10, "day_label": "Day 10 (240h)", "confidence": 43, "lower_bound": 32, "upper_bound": 54},
    {"day": 11, "day_label": "Day 11 (264h)", "confidence": 38, "lower_bound": 26, "upper_bound": 50},
    {"day": 12, "day_label": "Day 12 (288h)", "confidence": 34, "lower_bound": 22, "upper_bound": 46},
    {"day": 13, "day_label": "Day 13 (312h)", "confidence": 30, "lower_bound": 18, "upper_bound": 42},
    {"day": 14, "day_label": "Day 14 (336h)", "confidence": 27, "lower_bound": 14, "upper_bound": 40},
    {"day": 15, "day_label": "Day 15 (360h)", "confidence": 24, "lower_bound": 10, "upper_bound": 38}
]

# Forecast vs Observed Time-Series by parameter for Prayagraj
PRAYAGRAJ_PARAM_DATA: Dict[str, Dict[str, Any]] = {
    "Rainfall": {
        "unit": "mm",
        "current_forecast": 10.0,
        "current_observed": 45.0,
        "trend": [
            {"day": "Day +1", "forecast": 2.0, "observed": 3.5, "diff": 1.5, "error_pct": 75.0},
            {"day": "Day +2", "forecast": 5.0, "observed": 6.2, "diff": 1.2, "error_pct": 24.0},
            {"day": "Day +3", "forecast": 8.0, "observed": 14.0, "diff": 6.0, "error_pct": 75.0},
            {"day": "Day +4", "forecast": 12.0, "observed": 28.0, "diff": 16.0, "error_pct": 133.3},
            {"day": "Day +5", "forecast": 10.0, "observed": 45.0, "diff": 35.0, "error_pct": 350.0},
            {"day": "Day +6", "forecast": 15.0, "observed": 39.0, "diff": 24.0, "error_pct": 160.0},
            {"day": "Day +7", "forecast": 8.0, "observed": 22.0, "diff": 14.0, "error_pct": 175.0}
        ]
    },
    "Temperature": {
        "unit": "°C",
        "current_forecast": 35.5,
        "current_observed": 31.0,
        "trend": [
            {"day": "Day +1", "forecast": 33.0, "observed": 32.8, "diff": 0.2, "error_pct": 0.6},
            {"day": "Day +2", "forecast": 34.0, "observed": 33.5, "diff": 0.5, "error_pct": 1.5},
            {"day": "Day +3", "forecast": 35.0, "observed": 33.0, "diff": 2.0, "error_pct": 5.7},
            {"day": "Day +4", "forecast": 36.2, "observed": 32.1, "diff": 4.1, "error_pct": 11.3},
            {"day": "Day +5", "forecast": 35.5, "observed": 31.0, "diff": 4.5, "error_pct": 12.7},
            {"day": "Day +6", "forecast": 34.8, "observed": 30.5, "diff": 4.3, "error_pct": 12.4},
            {"day": "Day +7", "forecast": 34.0, "observed": 31.2, "diff": 2.8, "error_pct": 8.2}
        ]
    },
    "Wind Speed": {
        "unit": "km/h",
        "current_forecast": 11.0,
        "current_observed": 18.0,
        "trend": [
            {"day": "Day +1", "forecast": 10.0, "observed": 11.2, "diff": 1.2, "error_pct": 12.0},
            {"day": "Day +2", "forecast": 12.0, "observed": 13.0, "diff": 1.0, "error_pct": 8.3},
            {"day": "Day +3", "forecast": 10.5, "observed": 15.1, "diff": 4.6, "error_pct": 43.8},
            {"day": "Day +4", "forecast": 11.0, "observed": 18.0, "diff": 7.0, "error_pct": 63.6},
            {"day": "Day +5", "forecast": 12.0, "observed": 19.5, "diff": 7.5, "error_pct": 62.5},
            {"day": "Day +6", "forecast": 13.0, "observed": 17.0, "diff": 4.0, "error_pct": 30.8},
            {"day": "Day +7", "forecast": 11.5, "observed": 14.0, "diff": 2.5, "error_pct": 21.7}
        ]
    },
    "Humidity": {
        "unit": "%",
        "current_forecast": 52.0,
        "current_observed": 68.0,
        "trend": [
            {"day": "Day +1", "forecast": 50.0, "observed": 52.0, "diff": 2.0, "error_pct": 4.0},
            {"day": "Day +2", "forecast": 53.0, "observed": 56.0, "diff": 3.0, "error_pct": 5.7},
            {"day": "Day +3", "forecast": 55.0, "observed": 62.0, "diff": 7.0, "error_pct": 12.7},
            {"day": "Day +4", "forecast": 54.0, "observed": 67.0, "diff": 13.0, "error_pct": 24.1},
            {"day": "Day +5", "forecast": 52.0, "observed": 68.0, "diff": 16.0, "error_pct": 30.8},
            {"day": "Day +6", "forecast": 55.0, "observed": 70.0, "diff": 15.0, "error_pct": 27.3},
            {"day": "Day +7", "forecast": 58.0, "observed": 65.0, "diff": 7.0, "error_pct": 12.1}
        ]
    },
    "Pressure": {
        "unit": "hPa",
        "current_forecast": 1012.0,
        "current_observed": 1004.5,
        "trend": [
            {"day": "Day +1", "forecast": 1014.0, "observed": 1013.2, "diff": 0.8, "error_pct": 0.08},
            {"day": "Day +2", "forecast": 1013.0, "observed": 1011.8, "diff": 1.2, "error_pct": 0.12},
            {"day": "Day +3", "forecast": 1012.5, "observed": 1009.0, "diff": 3.5, "error_pct": 0.35},
            {"day": "Day +4", "forecast": 1012.0, "observed": 1006.2, "diff": 5.8, "error_pct": 0.57},
            {"day": "Day +5", "forecast": 1012.0, "observed": 1004.5, "diff": 7.5, "error_pct": 0.74},
            {"day": "Day +6", "forecast": 1011.0, "observed": 1005.1, "diff": 5.9, "error_pct": 0.58},
            {"day": "Day +7", "forecast": 1013.0, "observed": 1008.0, "diff": 5.0, "error_pct": 0.49}
        ]
    }
}

# 30-day historical time-series for analysis
def generate_historical_records(city_id: str) -> List[Dict[str, Any]]:
    records = []
    base_date = datetime.date(2026, 9, 7)
    
    # Baseline adjustments per city
    offsets = {
        "prayagraj": {"temp": 30.0, "rain_factor": 1.4, "bust_days": [4, 11, 19, 25, 29]},
        "delhi": {"temp": 28.5, "rain_factor": 0.4, "bust_days": [8, 22]},
        "mumbai": {"temp": 31.0, "rain_factor": 1.8, "bust_days": [2, 9, 14, 21]},
        "shimla": {"temp": 17.0, "rain_factor": 2.1, "bust_days": [3, 7, 13, 20, 27]},
        "bengaluru": {"temp": 24.5, "rain_factor": 0.6, "bust_days": [15]},
    }
    cfg = offsets.get(city_id, {"temp": 29.0, "rain_factor": 1.0, "bust_days": [5, 18]})
    
    for day_i in range(30):
        rec_date = base_date + datetime.timedelta(days=day_i)
        is_bust = (day_i in cfg["bust_days"])
        
        # Synthetic realistic weather values
        rain_val = round(max(0.0, ((day_i * 3) % 17) * cfg["rain_factor"] + (25.0 if is_bust else 0.0)), 1)
        temp_val = round(cfg["temp"] + ((day_i % 5) - 2.5) * 1.2 - (3.5 if rain_val > 15 else 0), 1)
        wind_val = round(12.0 + ((day_i * 2) % 9) + (7.0 if is_bust else 0), 1)
        humidity_val = int(min(98, max(40, 55 + (day_i % 20) + (25 if rain_val > 5 else 0))))
        
        condition = "Thunderstorm / High Discrepancy" if is_bust else ("Light Rain" if rain_val > 5 else "Clear to Partly Cloudy")
        
        records.append({
            "date": rec_date.strftime("%Y-%m-%d"),
            "temperature": temp_val,
            "rainfall": rain_val,
            "wind_speed": wind_val,
            "humidity": humidity_val,
            "bust_event": is_bust,
            "observed_condition": condition
        })
    return records

# Alerts feed
ACTIVE_ALERTS: List[Dict[str, Any]] = [
    {
        "id": "ALT-2026-001",
        "location_name": "Prayagraj, Uttar Pradesh",
        "parameter": "Rainfall",
        "risk_level": "HIGH",
        "headline": "High Probability of Forecast Bust Detected for Rainfall",
        "message": "High probability of forecast bust detected for rainfall during the next 3–5 days. Observed precipitation expected to exceed numerical forecast by >30 mm due to unmodeled mesoscale convective system.",
        "issued_at": "2026-10-06 21:30 IST",
        "valid_until": "2026-10-10 23:59 IST",
        "lead_days": "3-5 Days"
    },
    {
        "id": "ALT-2026-002",
        "location_name": "Shimla, Himachal Pradesh",
        "parameter": "Temperature & Rainfall",
        "risk_level": "HIGH",
        "headline": "Severe Orographic Bust Warning",
        "message": "Ensemble spread across NWP models indicates high variance in cloudburst thresholding along Himalayan ridge slopes. High bust risk for Day 4 precipitation.",
        "issued_at": "2026-10-06 20:15 IST",
        "valid_until": "2026-10-09 18:00 IST",
        "lead_days": "2-4 Days"
    },
    {
        "id": "ALT-2026-003",
        "location_name": "Kolkata, West Bengal",
        "parameter": "Wind Speed & Rainfall",
        "risk_level": "HIGH",
        "headline": "Cyclonic Shear Forecast Discrepancy",
        "message": "Ensemble divergence noted for Bay of Bengal depression landfall vector. High bust probability regarding gust velocity.",
        "issued_at": "2026-10-06 19:45 IST",
        "valid_until": "2026-10-11 12:00 IST",
        "lead_days": "4-6 Days"
    },
    {
        "id": "ALT-2026-004",
        "location_name": "Mumbai, Maharashtra",
        "parameter": "Rainfall",
        "risk_level": "MEDIUM",
        "headline": "Moderate Coastal Convergence Uncertainty",
        "message": "Medium risk of forecast bust for coastal showers. Disparity of 12-18 mm between operational GFS and ECMWF medium-range tracks.",
        "issued_at": "2026-10-06 18:00 IST",
        "valid_until": "2026-10-09 06:00 IST",
        "lead_days": "2-3 Days"
    },
    {
        "id": "ALT-2026-005",
        "location_name": "Chennai, Tamil Nadu",
        "parameter": "Temperature",
        "risk_level": "MEDIUM",
        "headline": "Maritime Sea-Breeze Onset Timing Variance",
        "message": "Sea breeze penetration timing differs by 2.5 hours among ensemble members. Temperature forecast may diverge by ±2.8°C.",
        "issued_at": "2026-10-06 17:30 IST",
        "valid_until": "2026-10-08 18:00 IST",
        "lead_days": "1-2 Days"
    },
    {
        "id": "ALT-2026-006",
        "location_name": "New Delhi, Delhi NCR",
        "parameter": "All Parameters",
        "risk_level": "LOW",
        "headline": "Stable Synoptic Forecast Regime",
        "message": "Strong ensemble consensus and minimal atmospheric instability over northern plains. Forecast confidence exceeds 88%.",
        "issued_at": "2026-10-06 15:00 IST",
        "valid_until": "2026-10-12 23:59 IST",
        "lead_days": "6 Days"
    },
    {
        "id": "ALT-2026-007",
        "location_name": "Bengaluru, Karnataka",
        "parameter": "Rainfall & Wind",
        "risk_level": "LOW",
        "headline": "High Confidence Baseline Conditions",
        "message": "Plateau weather regime exhibits high predictability with less than 5% member deviation. Low risk of forecast bust.",
        "issued_at": "2026-10-06 14:00 IST",
        "valid_until": "2026-10-13 23:59 IST",
        "lead_days": "7 Days"
    }
]

# Overall Dashboard Statistics
DASHBOARD_STATS = {
    "total_forecasts_analyzed": 1248,
    "high_risk_count": 126,
    "medium_risk_count": 318,
    "low_risk_count": 804,
    "average_forecast_accuracy": 84.6,
    "average_bust_probability": 28.4,
    "active_critical_alerts": 3
}
