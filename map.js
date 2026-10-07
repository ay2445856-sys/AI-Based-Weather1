/**
 * ForecastGuard AI - Interactive Weather & Risk Map (Powered by Leaflet.js)
 * Visualizes geographic dispersion of medium-range forecast bust risks across India.
 */

class WeatherMapManager {
    constructor() {
        this.map = null;
        this.markersLayer = null;
        this.heatLayerGroup = null;
        this.tileLayer = null;
        this.isInitialized = false;
        this.markersData = [];
    }

    init(mapContainerId = 'weatherMap') {
        const container = document.getElementById(mapContainerId);
        if (!container || this.isInitialized) return;

        // Centered on geographic India
        this.map = L.map(mapContainerId, {
            center: [22.9734, 78.6569],
            zoom: 5,
            minZoom: 4,
            maxZoom: 10,
            scrollWheelZoom: true
        });

        // Professional sleek basemap tiles (CartoDB Dark Matter / Voyager)
        this.updateMapTiles();

        this.markersLayer = L.layerGroup().addTo(this.map);
        this.heatLayerGroup = L.layerGroup().addTo(this.map);

        this.isInitialized = true;
        this.loadMarkers();
    }

    updateMapTiles() {
        if (!this.map) return;
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        
        if (this.tileLayer) {
            this.map.removeLayer(this.tileLayer);
        }

        const tileUrl = isDark
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

        this.tileLayer = L.tileLayer(tileUrl, {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(this.map);
    }

    async loadMarkers(filterRisk = 'ALL') {
        if (!this.map || !window.api) return;

        const markers = await window.api.getMapMarkers();
        if (!markers) return;
        this.markersData = markers;

        this.markersLayer.clearLayers();
        this.heatLayerGroup.clearLayers();

        markers.forEach(loc => {
            if (filterRisk !== 'ALL' && loc.risk_level !== filterRisk) {
                return;
            }

            let pinClass = 'pin-low';
            let iconGlyph = '🟢';
            let pulseClass = '';

            if (loc.risk_level === 'HIGH') {
                pinClass = 'pin-high';
                iconGlyph = '🔴';
                pulseClass = 'risk-pulse-high';
            } else if (loc.risk_level === 'MEDIUM') {
                pinClass = 'pin-med';
                iconGlyph = '🟡';
            }

            // Custom Leaflet DivIcon
            const customIcon = L.divIcon({
                className: 'custom-pin-wrapper',
                html: `<div class="custom-map-pin ${pinClass} ${pulseClass}">${loc.bust_probability}%</div>`,
                iconSize: [34, 34],
                iconAnchor: [17, 17],
                popupAnchor: [0, -20]
            });

            const marker = L.marker([loc.lat, loc.lon], { icon: customIcon });

            // Interactive Rich Popup
            const popupHtml = `
                <div class="p-2 min-w-[210px] text-left">
                    <div class="flex items-center justify-between border-b border-gray-600/30 pb-1.5 mb-2">
                        <h4 class="font-bold text-sm tracking-wide text-white">${loc.name}</h4>
                        <span class="text-xs px-2 py-0.5 rounded font-bold ${
                            loc.risk_level === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                            loc.risk_level === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-emerald-500/20 text-emerald-400'
                        }">${loc.risk_level} RISK</span>
                    </div>
                    <div class="space-y-1 text-xs text-gray-300">
                        <div class="flex justify-between">
                            <span class="text-gray-400">Current Temp:</span>
                            <span class="font-mono font-bold">${loc.temperature}°C</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Observed Rain:</span>
                            <span class="font-mono font-bold">${loc.rainfall} mm</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Forecast Confidence:</span>
                            <span class="font-mono font-bold text-cyan-400">${loc.forecast_confidence}%</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Bust Probability:</span>
                            <span class="font-mono font-bold ${loc.risk_level === 'HIGH' ? 'text-red-400' : 'text-emerald-400'}">${loc.bust_probability}%</span>
                        </div>
                        <div class="pt-1 text-gray-400 text-[11px] italic">${loc.condition}</div>
                    </div>
                    <button onclick="window.app.selectCityAndNavigate('${loc.id}')"
                        class="mt-3 w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded text-xs transition flex items-center justify-center gap-1.5 shadow">
                        <i class="fa-solid fa-crosshairs"></i> Inspect Station
                    </button>
                </div>
            `;

            marker.bindPopup(popupHtml);
            this.markersLayer.addLayer(marker);

            // Add simulated precipitation radar circle for high bust zones
            if (loc.risk_level === 'HIGH') {
                const circle = L.circle([loc.lat, loc.lon], {
                    radius: 75000,
                    color: '#ef4444',
                    fillColor: '#ef4444',
                    fillOpacity: 0.15,
                    weight: 1.5,
                    dashArray: '4, 6'
                });
                this.heatLayerGroup.addLayer(circle);
            }
        });
    }

    flyToCity(lat, lon, zoom = 7) {
        if (!this.map) return;
        this.map.flyTo([lat, lon], zoom, { duration: 1.2 });
    }

    filterByRisk(risk) {
        this.loadMarkers(risk);
    }
}

window.weatherMap = new WeatherMapManager();
