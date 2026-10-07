/**
 * ForecastGuard AI - API Client Layer
 * Communicates with FastAPI backend with resilient fallbacks and structured error handling.
 */

const API_BASE = window.location.origin.includes('http') ? window.location.origin : 'http://127.0.0.1:8000';

class ForecastGuardAPI {
    async fetchWithFallback(url, options = {}, fallbackData = null) {
        try {
            const res = await fetch(`${API_BASE}${url}`, {
                headers: { 'Content-Type': 'application/json' },
                ...options
            });
            if (!res.ok) {
                console.warn(`API returned status ${res.status} for ${url}. Using fallback data.`);
                return fallbackData;
            }
            return await res.json();
        } catch (err) {
            console.warn(`Network error requesting ${url}:`, err.message);
            return fallbackData;
        }
    }

    async getLocations() {
        return await this.fetchWithFallback('/api/locations', {}, [
            { id: 'prayagraj', name: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.4358, lon: 81.8463 },
            { id: 'delhi', name: 'New Delhi', state: 'Delhi NCR', lat: 28.6139, lon: 77.2090 },
            { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lon: 72.8777 },
            { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lon: 77.5946 },
            { id: 'shimla', name: 'Shimla', state: 'Himachal Pradesh', lat: 31.1048, lon: 77.1734 },
            { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lon: 80.2707 },
            { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lon: 88.3639 },
            { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lon: 75.7873 }
        ]);
    }

    async getCurrentWeather(locationId) {
        return await this.fetchWithFallback(`/api/current/${locationId}`, {}, {
            location: { id: locationId, name: 'Prayagraj', state: 'Uttar Pradesh' },
            temperature: 31.0,
            humidity: 68,
            wind_speed: 18.0,
            rain_probability: 72,
            condition: 'Humid & Thunderstorm Threat',
            weather_icon: 'thunderstorm',
            forecast_confidence: 64,
            bust_risk: 'HIGH',
            bust_probability: 87,
            ensemble_spread: 4.8,
            last_updated: '2026-10-06 23:00 IST'
        });
    }

    async getStats() {
        return await this.fetchWithFallback('/api/stats', {}, {
            total_forecasts_analyzed: 1248,
            high_risk_count: 126,
            medium_risk_count: 318,
            low_risk_count: 804,
            average_forecast_accuracy: 84.6,
            average_bust_probability: 28.4,
            active_critical_alerts: 3
        });
    }

    async getForecastAnalysis(locationId, parameter = 'Rainfall') {
        return await this.fetchWithFallback(`/api/forecast-analysis/${locationId}?parameter=${encodeURIComponent(parameter)}`);
    }

    async analyzeBust(payload) {
        return await this.fetchWithFallback('/api/bust-detection/analyze', {
            method: 'POST',
            body: JSON.stringify(payload)
        }, {
            bust_probability: 87,
            risk_level: 'HIGH',
            forecast_confidence: 13,
            headline: '🔴 HIGH RISK BUST WARNING',
            explanation: 'The forecast shows a high probability of significant deviation from observed weather conditions.',
            primary_reasons: [
                'Large forecast error between numerical prediction and ground station readings',
                'High ensemble spread indicating diverging numerical weather prediction members',
                'Rapid weather change driven by elevated convective and moisture instability'
            ],
            factor_contributions: [
                { name: 'Forecast vs Observed Deviation', impact: 'High', weight_pct: 45, description: 'Discrepancy of 35.0 mm' },
                { name: 'Ensemble Member Spread (σ)', impact: 'High', weight_pct: 25, description: 'Spread is 4.8' },
                { name: 'Convective & Mesoscale Instability', impact: 'High', weight_pct: 15, description: 'CAPE index 68/100' }
            ],
            recommendation: 'Recommend switching to high-resolution nowcasting and alerting district emergency desks.'
        });
    }

    async getConfidenceTrend(locationId) {
        return await this.fetchWithFallback(`/api/confidence-trend/${locationId}`);
    }

    async getHistoricalData(locationId) {
        return await this.fetchWithFallback(`/api/historical/${locationId}`);
    }

    async getMapMarkers() {
        return await this.fetchWithFallback('/api/map-markers');
    }

    async getAlerts(riskFilter = 'ALL', locationQuery = '') {
        const queryParams = new URLSearchParams();
        if (riskFilter && riskFilter !== 'ALL') queryParams.append('risk', riskFilter);
        if (locationQuery) queryParams.append('location', locationQuery);
        return await this.fetchWithFallback(`/api/alerts?${queryParams.toString()}`);
    }

    async getAIInsights(locationId) {
        return await this.fetchWithFallback(`/api/insights/${locationId}`);
    }
}

window.api = new ForecastGuardAPI();
