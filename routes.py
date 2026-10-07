"""
API Route Handlers for ForecastGuard AI.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from ..models.schemas import (
    Location,
    CurrentWeather,
    ForecastAnalysisResponse,
    BustDetectionRequest,
    BustDetectionResponse,
    ConfidencePoint,
    HistoricalRecord,
    AlertItem,
    MapMarker,
    StatSummary
)
from ..services.weather_service import weather_service
from ..services.ml_engine import ml_engine

router = APIRouter(prefix="/api", tags=["forecast-guard"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ForecastGuard AI - Forecast Bust Detection Engine",
        "version": "2.4.0",
        "ai_model_status": "ONLINE",
        "mode": "Demonstration & Prototype (Calibrated Baseline)"
    }

@router.get("/locations", response_model=List[Location])
def get_locations():
    return weather_service.get_locations()

@router.get("/current/{location_id}", response_model=CurrentWeather)
def get_current_weather(location_id: str):
    res = weather_service.get_current_weather(location_id)
    if not res:
        raise HTTPException(status_code=404, detail=f"Location '{location_id}' not found.")
    return res

@router.get("/stats", response_model=StatSummary)
def get_dashboard_stats():
    return weather_service.get_dashboard_stats()

@router.get("/forecast-analysis/{location_id}", response_model=ForecastAnalysisResponse)
def get_forecast_analysis(
    location_id: str,
    parameter: str = Query("Rainfall", description="Parameter name e.g. Rainfall, Temperature, Wind Speed, Humidity, Pressure")
):
    return weather_service.get_forecast_analysis(location_id, parameter=parameter)

@router.post("/bust-detection/analyze", response_model=BustDetectionResponse)
def analyze_bust_probability(payload: BustDetectionRequest):
    return ml_engine.calculate_bust_probability(
        forecast_val=payload.forecast_val,
        observed_val=payload.observed_val,
        parameter=payload.parameter or "Rainfall",
        ensemble_spread=payload.ensemble_spread or 4.0,
        atmospheric_instability=payload.atmospheric_instability or 65.0,
        lead_time_days=payload.lead_time_days or 5
    )

@router.get("/confidence-trend/{location_id}", response_model=List[ConfidencePoint])
def get_confidence_trend(location_id: str):
    return weather_service.get_confidence_trend(location_id)

@router.get("/historical/{location_id}", response_model=List[HistoricalRecord])
def get_historical_weather(location_id: str):
    return weather_service.get_historical_data(location_id)

@router.get("/map-markers", response_model=List[MapMarker])
def get_map_markers():
    return weather_service.get_map_markers()

@router.get("/alerts", response_model=List[AlertItem])
def get_alerts(
    risk: Optional[str] = Query(None, description="Risk level filter: ALL, HIGH, MEDIUM, LOW"),
    location: Optional[str] = Query(None, description="Location search query")
):
    return weather_service.get_alerts(loc_filter=location, risk_filter=risk)

@router.get("/insights/{location_id}")
def get_ai_insights(location_id: str):
    loc = weather_service.get_location_by_id(location_id) or weather_service.get_location_by_id("prayagraj")
    curr = weather_service.get_current_weather(loc.id)

    # Dynamic diagnostic summary
    if curr.bust_risk == "HIGH":
        summary = (
            f"Rainfall forecast uncertainty is increasing for {loc.name}. The forecast shows a high deviation "
            f"compared with historical weather patterns. Strong convective dynamics and multi-model ensemble spread "
            f"(σ = {curr.ensemble_spread}) suggest severe localized under-prediction."
        )
        pattern_match = "Low"
        variability = "High"
        error_stat = "High"
        ensemble_stat = "High"
    elif curr.bust_risk == "MEDIUM":
        summary = (
            f"Moderate synoptic divergence identified in {loc.name}. Boundary layer moisture transport exhibits "
            f"phase shifts across operational models. Forecast error is within intermediate bounds."
        )
        pattern_match = "Moderate"
        variability = "Moderate"
        error_stat = "Medium"
        ensemble_stat = "Medium"
    else:
        summary = (
            f"Synoptic conditions over {loc.name} are stable. High pattern match with 30-year climatological normals "
            f"and tight ensemble convergence confirm dependable medium-range guidance."
        )
        pattern_match = "High"
        variability = "Low"
        error_stat = "Low"
        ensemble_stat = "Low"

    return {
        "location": loc.name,
        "risk_level": curr.bust_risk,
        "bust_probability": curr.bust_probability,
        "insight_text": summary,
        "key_factors": [
            {"factor": "Forecast Error", "level": error_stat, "status": "critical" if error_stat == "High" else "normal"},
            {"factor": "Weather Variability", "level": variability, "status": "critical" if variability == "High" else "normal"},
            {"factor": "Ensemble Spread", "level": ensemble_stat, "status": "critical" if ensemble_stat == "High" else "normal"},
            {"factor": "Historical Pattern Match", "level": pattern_match, "status": "warning" if pattern_match == "Low" else "normal"}
        ],
        "atmospheric_indices": {
            "cape_proxy_j_kg": 1850 if curr.bust_risk == "HIGH" else 620,
            "shear_0_6km_knots": 34 if curr.bust_risk == "HIGH" else 15,
            "baroclinic_instability_index": 0.74 if curr.bust_risk == "HIGH" else 0.28
        }
    }
