from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class Location(BaseModel):
    id: str
    name: str
    state: str
    country: str = "India"
    lat: float
    lon: float
    elevation: int = 100

class CurrentWeather(BaseModel):
    location: Location
    temperature: float
    humidity: int
    wind_speed: float
    rain_probability: int
    condition: str
    weather_icon: str
    forecast_confidence: int
    bust_risk: str  # LOW, MEDIUM, HIGH
    bust_probability: int
    ensemble_spread: float
    last_updated: str

class MetricPoint(BaseModel):
    day: str
    forecast: float
    observed: float
    diff: float
    error_pct: float

class ForecastAnalysisResponse(BaseModel):
    location: Location
    parameter: str
    unit: str
    forecast_value: float
    observed_value: float
    absolute_error: float
    percentage_error: float
    forecast_confidence: int
    bust_probability: int
    risk_level: str
    comparison_data: List[MetricPoint]
    status_explanation: str

class BustDetectionRequest(BaseModel):
    location_id: Optional[str] = "prayagraj"
    parameter: Optional[str] = "Rainfall"
    forecast_val: float
    observed_val: float
    ensemble_spread: Optional[float] = 4.2
    atmospheric_instability: Optional[float] = 65.0
    lead_time_days: Optional[int] = 5

class FactorContribution(BaseModel):
    name: str
    impact: str  # High, Medium, Low
    weight_pct: int
    description: str

class BustDetectionResponse(BaseModel):
    bust_probability: int
    risk_level: str  # LOW, MEDIUM, HIGH
    forecast_confidence: int
    headline: str
    explanation: str
    primary_reasons: List[str]
    factor_contributions: List[FactorContribution]
    recommendation: str

class ConfidencePoint(BaseModel):
    day: int
    day_label: str
    confidence: int
    lower_bound: int
    upper_bound: int

class HistoricalRecord(BaseModel):
    date: str
    temperature: float
    rainfall: float
    wind_speed: float
    humidity: int
    bust_event: bool
    observed_condition: str

class AlertItem(BaseModel):
    id: str
    location_name: str
    parameter: str
    risk_level: str  # HIGH, MEDIUM, LOW
    headline: str
    message: str
    issued_at: str
    valid_until: str
    lead_days: str

class MapMarker(BaseModel):
    id: str
    name: str
    state: str
    lat: float
    lon: float
    temperature: float
    rainfall: float
    forecast_confidence: int
    bust_probability: int
    risk_level: str
    condition: str

class StatSummary(BaseModel):
    total_forecasts_analyzed: int
    high_risk_count: int
    medium_risk_count: int
    low_risk_count: int
    average_forecast_accuracy: float
    average_bust_probability: float
    active_critical_alerts: int
