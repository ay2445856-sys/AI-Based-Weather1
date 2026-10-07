"""
Weather Service Provider Layer for ForecastGuard AI.
Provides unified weather data interface with extensible architecture for real API integrations
(e.g., Open-Meteo, IMD, ECMWF) and calibrated demo baseline datasets.
"""

from typing import Dict, List, Any, Optional
import math
from .mock_data import (
    LOCATIONS,
    CURRENT_WEATHER_DATA,
    FIFTEEN_DAY_CONFIDENCE,
    PRAYAGRAJ_PARAM_DATA,
    generate_historical_records,
    ACTIVE_ALERTS,
    DASHBOARD_STATS
)
from ..models.schemas import (
    Location,
    CurrentWeather,
    ForecastAnalysisResponse,
    MetricPoint,
    ConfidencePoint,
    HistoricalRecord,
    AlertItem,
    MapMarker,
    StatSummary
)
from .ml_engine import ml_engine

class WeatherService:
    """
    Service layer handling forecast extraction, observed comparisons,
    and alert dispatch.
    """

    def get_locations(self) -> List[Location]:
        return [Location(**data) for data in LOCATIONS.values()]

    def get_location_by_id(self, loc_id: str) -> Optional[Location]:
        data = LOCATIONS.get(loc_id.lower())
        if data:
            return Location(**data)
        return None

    def get_current_weather(self, loc_id: str) -> Optional[CurrentWeather]:
        loc = self.get_location_by_id(loc_id)
        if not loc:
            return None
        
        weather = CURRENT_WEATHER_DATA.get(loc_id.lower(), CURRENT_WEATHER_DATA["prayagraj"])
        return CurrentWeather(
            location=loc,
            temperature=weather["temperature"],
            humidity=weather["humidity"],
            wind_speed=weather["wind_speed"],
            rain_probability=weather["rain_probability"],
            condition=weather["condition"],
            weather_icon=weather["weather_icon"],
            forecast_confidence=weather["forecast_confidence"],
            bust_risk=weather["bust_risk"],
            bust_probability=weather["bust_probability"],
            ensemble_spread=weather["ensemble_spread"],
            last_updated=weather["last_updated"]
        )

    def get_forecast_analysis(self, loc_id: str, parameter: str = "Rainfall") -> ForecastAnalysisResponse:
        loc = self.get_location_by_id(loc_id) or self.get_location_by_id("prayagraj")
        
        # Match parameter data
        param_data = PRAYAGRAJ_PARAM_DATA.get(parameter, PRAYAGRAJ_PARAM_DATA["Rainfall"])
        
        # Scale slightly if different city selected for dynamic realism
        multiplier = 1.0
        if loc_id == "delhi":
            multiplier = 0.4 if parameter == "Rainfall" else 0.95
        elif loc_id == "mumbai":
            multiplier = 1.2 if parameter == "Rainfall" else 1.05
        elif loc_id == "shimla":
            multiplier = 0.5 if parameter == "Temperature" else 1.3

        curr_forecast = round(param_data["current_forecast"] * (multiplier if parameter == "Rainfall" else 1.0), 1)
        curr_observed = round(param_data["current_observed"] * (multiplier if parameter == "Rainfall" else 1.0), 1)
        
        # In Prayagraj rainfall, match prompt explicitly: 10 mm vs 45 mm -> Error: 35 mm
        if loc.id == "prayagraj" and parameter == "Rainfall":
            curr_forecast = 10.0
            curr_observed = 45.0

        abs_error = round(abs(curr_forecast - curr_observed), 1)
        pct_error = round((abs_error / max(0.1, curr_forecast)) * 100.0, 1)

        # Run through ML model for calibrated risk
        ml_result = ml_engine.calculate_bust_probability(
            forecast_val=curr_forecast,
            observed_val=curr_observed,
            parameter=parameter,
            ensemble_spread=4.8 if loc.id == "prayagraj" else 2.5,
            atmospheric_instability=68.0,
            lead_time_days=5
        )

        comparison_points = []
        for item in param_data["trend"]:
            f_val = round(item["forecast"] * (multiplier if parameter == "Rainfall" else 1.0), 1)
            o_val = round(item["observed"] * (multiplier if parameter == "Rainfall" else 1.0), 1)
            diff = round(abs(f_val - o_val), 1)
            err_pct = round((diff / max(0.1, f_val)) * 100.0, 1)
            comparison_points.append(MetricPoint(
                day=item["day"],
                forecast=f_val,
                observed=o_val,
                diff=diff,
                error_pct=err_pct
            ))

        return ForecastAnalysisResponse(
            location=loc,
            parameter=parameter,
            unit=param_data["unit"],
            forecast_value=curr_forecast,
            observed_value=curr_observed,
            absolute_error=abs_error,
            percentage_error=pct_error,
            forecast_confidence=ml_result.forecast_confidence,
            bust_probability=ml_result.bust_probability,
            risk_level=ml_result.risk_level,
            comparison_data=comparison_points,
            status_explanation=ml_result.explanation
        )

    def get_confidence_trend(self, loc_id: str) -> List[ConfidencePoint]:
        loc = self.get_location_by_id(loc_id)
        modifier = 0
        if loc and loc.id in ["delhi", "bengaluru", "jaipur"]:
            modifier = 3  # More stable regions
        elif loc and loc.id in ["shimla", "kolkata"]:
            modifier = -4 # More volatile mountain/cyclonic regimes

        return [
            ConfidencePoint(
                day=item["day"],
                day_label=item["day_label"],
                confidence=max(10, min(99, item["confidence"] + modifier)),
                lower_bound=max(5, item["lower_bound"] + modifier),
                upper_bound=min(100, item["upper_bound"] + modifier)
            )
            for item in FIFTEEN_DAY_CONFIDENCE
        ]

    def get_historical_data(self, loc_id: str) -> List[HistoricalRecord]:
        raw_recs = generate_historical_records(loc_id)
        return [HistoricalRecord(**r) for r in raw_recs]

    def get_map_markers(self) -> List[MapMarker]:
        markers = []
        for loc_id, loc_data in LOCATIONS.items():
            weather = CURRENT_WEATHER_DATA.get(loc_id, CURRENT_WEATHER_DATA["prayagraj"])
            markers.append(MapMarker(
                id=loc_id,
                name=loc_data["name"],
                state=loc_data["state"],
                lat=loc_data["lat"],
                lon=loc_data["lon"],
                temperature=weather["temperature"],
                rainfall=weather.get("observed_rainfall", 0.0),
                forecast_confidence=weather["forecast_confidence"],
                bust_probability=weather["bust_probability"],
                risk_level=weather["bust_risk"],
                condition=weather["condition"]
            ))
        return markers

    def get_alerts(self, loc_filter: Optional[str] = None, risk_filter: Optional[str] = None) -> List[AlertItem]:
        results = []
        for alt in ACTIVE_ALERTS:
            if risk_filter and risk_filter.upper() != "ALL" and alt["risk_level"] != risk_filter.upper():
                continue
            if loc_filter and loc_filter.lower() not in alt["location_name"].lower():
                continue
            results.append(AlertItem(**alt))
        return results

    def get_dashboard_stats(self) -> StatSummary:
        return StatSummary(**DASHBOARD_STATS)

# Global singleton
weather_service = WeatherService()
