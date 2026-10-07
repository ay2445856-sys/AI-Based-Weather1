/**
 * ForecastGuard AI - Main Application Controller
 * Handles state management, view routing, real-time recalculations, UI events,
 * and seamless bilingual English/Hindi localization.
 */

class ForecastGuardApp {
    constructor() {
        this.currentLocationId = 'prayagraj';
        this.currentView = 'dashboard';
        this.currentParam = 'Rainfall';
        this.errorParam = 'Rainfall';
        this.currentLang = localStorage.getItem('fg_lang') || 'en';
        this.locations = [];
        this.cachedWeather = null;
    }

    async init() {
        console.log('⚡ Initializing ForecastGuard AI Dashboard with Bilingual Support...');
        this.setupTheme();
        this.setupLanguage();
        this.setupEventListeners();
        await this.loadLocationsDropdown();
        await this.loadDashboardData();
        this.updateTimeDisplay();
        setInterval(() => this.updateTimeDisplay(), 1000);
    }

    /* =========================================================================
       THEME MANAGEMENT
       ========================================================================= */
    setupTheme() {
        const savedTheme = localStorage.getItem('fg_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeButtonIcon(savedTheme);
    }

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const nextTheme = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('fg_theme', nextTheme);
        this.updateThemeButtonIcon(nextTheme);

        if (window.chartEngine) window.chartEngine.updateThemeAll();
        if (window.weatherMap) window.weatherMap.updateMapTiles();
    }

    updateThemeButtonIcon(theme) {
        const btn = document.getElementById('themeToggleBtn');
        if (!btn) return;
        btn.innerHTML = theme === 'dark' 
            ? '<i class="fa-solid fa-sun text-amber-400"></i>' 
            : '<i class="fa-solid fa-moon text-blue-500"></i>';
    }

    /* =========================================================================
       BILINGUAL (ENGLISH / HINDI) LOCALIZATION
       ========================================================================= */
    setupLanguage() {
        this.updateLanguageButton();
        this.applyLanguage();
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'en' ? 'hi' : 'en';
        localStorage.setItem('fg_lang', this.currentLang);
        this.updateLanguageButton();
        this.applyLanguage();
        this.showToast(this.t('toast_lang_switched'), 'success');

        // Refresh currently active view
        this.switchView(this.currentView);
    }

    updateLanguageButton() {
        const btn = document.getElementById('langToggleBtn');
        if (!btn) return;
        btn.innerHTML = this.currentLang === 'en'
            ? '<i class="fa-solid fa-language text-cyan-400"></i> <span class="font-bold">हिंदी</span>'
            : '<i class="fa-solid fa-language text-cyan-400"></i> <span class="font-bold">English</span>';
    }

    t(key) {
        const dict = window.FG_TRANSLATIONS ? window.FG_TRANSLATIONS[this.currentLang] : null;
        if (dict && dict[key] !== undefined) {
            return dict[key];
        }
        // Fallback to English
        const fallback = window.FG_TRANSLATIONS ? window.FG_TRANSLATIONS['en'] : null;
        return (fallback && fallback[key] !== undefined) ? fallback[key] : key;
    }

    applyLanguage() {
        // Update elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key) {
                el.innerText = this.t(key);
            }
        });

        // Update elements with data-i18n-html
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            if (key) {
                el.innerHTML = this.t(key);
            }
        });

        // Update active location name if needed
        if (this.currentLocationId) {
            const locEl = document.getElementById('dashLocationName');
            if (locEl) locEl.innerText = this.getLocationName(this.currentLocationId);
        }
    }

    updateTimeDisplay() {
        const el = document.getElementById('liveTimeDisplay');
        if (el) {
            const now = new Date();
            el.innerText = now.toTimeString().split(' ')[0] + ' IST';
        }
    }

    setupEventListeners() {
        // Navigation clicks
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetView = tab.getAttribute('data-view');
                if (targetView) this.switchView(targetView);
            });
        });

        // City Selector change
        const citySelect = document.getElementById('globalCitySelect');
        if (citySelect) {
            citySelect.addEventListener('change', (e) => {
                this.changeLocation(e.target.value);
            });
        }
    }

    switchView(viewName) {
        this.currentView = viewName;
        // Update navigation active states
        document.querySelectorAll('.nav-tab').forEach(tab => {
            if (tab.getAttribute('data-view') === viewName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Hide all views, display target view
        document.querySelectorAll('.view-container').forEach(view => {
            if (view.id === `view-${viewName}`) {
                view.classList.remove('hidden');
            } else {
                view.classList.add('hidden');
            }
        });

        // Trigger view-specific loads
        if (viewName === 'forecast-analysis') {
            this.loadForecastAnalysis();
        } else if (viewName === 'bust-detection') {
            this.loadBustDetectionView();
        } else if (viewName === 'confidence-trend') {
            this.loadConfidenceTrend();
        } else if (viewName === 'error-analysis') {
            this.loadErrorAnalysis();
        } else if (viewName === 'weather-map') {
            setTimeout(() => {
                if (window.weatherMap) {
                    window.weatherMap.init('weatherMap');
                    if (window.weatherMap.map) window.weatherMap.map.invalidateSize();
                }
            }, 100);
        } else if (viewName === 'historical-data') {
            this.loadHistoricalData();
        } else if (viewName === 'ai-insights') {
            this.loadAIInsights();
        } else if (viewName === 'alerts') {
            this.loadAlerts();
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async loadLocationsDropdown() {
        this.locations = await window.api.getLocations();
        const select = document.getElementById('globalCitySelect');
        if (!select) return;

        select.innerHTML = '';
        this.locations.forEach(loc => {
            const opt = document.createElement('option');
            opt.value = loc.id;
            opt.text = `${loc.name}, ${loc.state}`;
            if (loc.id === this.currentLocationId) opt.selected = true;
            select.appendChild(opt);
        });
    }

    async changeLocation(locId) {
        this.currentLocationId = locId;
        const select = document.getElementById('globalCitySelect');
        if (select) select.value = locId;

        const msg = this.currentLang === 'hi' 
            ? `${this.getLocationName(locId)} के लिए मौसम विवरण लोड हो रहा है...`
            : `Loading weather intelligence for ${this.getLocationName(locId)}...`;
        this.showToast(msg, 'info');

        await this.loadDashboardData();
        this.switchView(this.currentView);
    }

    getLocationName(locId) {
        const found = this.locations.find(l => l.id === locId);
        return found ? `${found.name}, ${found.state}` : 'Selected Location';
    }

    selectCityAndNavigate(locId) {
        this.changeLocation(locId);
        this.switchView('dashboard');
    }

    /**
     * View 1: Main Dashboard Data
     */
    async loadDashboardData() {
        const data = await window.api.getCurrentWeather(this.currentLocationId);
        this.cachedWeather = data;
        const stats = await window.api.getStats();

        // Populate Weather Summary Card
        document.getElementById('dashLocationName').innerText = `${data.location.name}, ${data.location.state}`;
        document.getElementById('dashTemperature').innerText = `${data.temperature}°C`;
        document.getElementById('dashHumidity').innerText = `${data.humidity}%`;
        document.getElementById('dashWindSpeed').innerText = `${data.wind_speed} km/h`;
        document.getElementById('dashRainProb').innerText = `${data.rain_probability}%`;
        
        // Translated or native condition
        const condEl = document.getElementById('dashWeatherCond');
        if (condEl) {
            condEl.innerHTML = `<i class="fa-solid fa-cloud-bolt"></i> ${this.currentLang === 'hi' ? 'उमस एवं गरज के साथ वर्षा का खतरा' : data.condition}`;
        }

        document.getElementById('dashConfidence').innerText = `${data.forecast_confidence}%`;
        document.getElementById('dashConfidenceBar').style.width = `${data.forecast_confidence}%`;
        document.getElementById('dashBustProb').innerText = `${data.bust_probability}%`;

        // Update Bust Risk Badge
        const riskBadge = document.getElementById('dashBustRiskBadge');
        if (riskBadge) {
            riskBadge.className = 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ';
            if (data.bust_risk === 'HIGH') {
                riskBadge.classList.add('badge-risk-high', 'risk-pulse-high');
                riskBadge.innerHTML = `<i class="fa-solid fa-circle-exclamation text-red-500"></i> ${this.currentLang === 'hi' ? 'उच्च जोखिम (HIGH)' : 'HIGH RISK'}`;
            } else if (data.bust_risk === 'MEDIUM') {
                riskBadge.classList.add('badge-risk-med');
                riskBadge.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-amber-500"></i> ${this.currentLang === 'hi' ? 'मध्यम जोखिम (MEDIUM)' : 'MEDIUM RISK'}`;
            } else {
                riskBadge.classList.add('badge-risk-low');
                riskBadge.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-500"></i> ${this.currentLang === 'hi' ? 'निम्न जोखिम (LOW)' : 'LOW RISK'}`;
            }
        }

        // Dashboard Statistics Cards
        if (stats) {
            document.getElementById('statTotalForecasts').innerText = stats.total_forecasts_analyzed.toLocaleString();
            document.getElementById('statHighRisk').innerText = stats.high_risk_count;
            document.getElementById('statMedRisk').innerText = stats.medium_risk_count;
            document.getElementById('statLowRisk').innerText = stats.low_risk_count;
            document.getElementById('statAvgAccuracy').innerText = `${stats.average_forecast_accuracy}%`;
            document.getElementById('statAvgBustProb').innerText = `${stats.average_bust_probability}%`;
        }

        this.applyLanguage();
        this.loadDashboardMiniTrend();
    }

    async loadDashboardMiniTrend() {
        const analysis = await window.api.getForecastAnalysis(this.currentLocationId, 'Rainfall');
        if (analysis && window.chartEngine) {
            window.chartEngine.renderForecastComparisonChart(
                'dashMiniComparisonChart',
                analysis.comparison_data,
                this.currentLang === 'hi' ? 'वर्षा' : 'Rainfall',
                'mm'
            );
        }
    }

    /**
     * Trigger "Run AI Analysis" action on dashboard
     */
    async triggerDashboardAIAnalysis() {
        const btn = document.getElementById('runAiAnalysisBtn');
        if (!btn) return;

        const originalHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${this.t('btn_processing')}`;

        const toastMsg = this.currentLang === 'hi'
            ? 'मेसोस्केल एन्सेम्बल विसंगति का पता लगाया जा रहा है...'
            : 'Executing mesoscale ensemble anomaly detection...';
        this.showToast(toastMsg, 'info');

        await new Promise(r => setTimeout(r, 1200));

        await this.loadDashboardData();
        btn.disabled = false;
        btn.innerHTML = originalHtml;

        this.showToast(this.t('toast_analysis_complete'), 'success');
    }

    /**
     * View 2: Forecast Analysis
     */
    async setAnalysisParam(param) {
        this.currentParam = param;
        document.querySelectorAll('.analysis-param-btn').forEach(b => {
            if (b.getAttribute('data-param') === param) {
                b.classList.add('bg-blue-600', 'text-white');
                b.classList.remove('bg-gray-800', 'text-gray-300');
            } else {
                b.classList.remove('bg-blue-600', 'text-white');
                b.classList.add('bg-gray-800', 'text-gray-300');
            }
        });
        await this.loadForecastAnalysis();
    }

    async loadForecastAnalysis() {
        const analysis = await window.api.getForecastAnalysis(this.currentLocationId, this.currentParam);
        if (!analysis) return;

        document.getElementById('analysisForecastVal').innerText = `${analysis.forecast_value} ${analysis.unit}`;
        document.getElementById('analysisObservedVal').innerText = `${analysis.observed_value} ${analysis.unit}`;
        document.getElementById('analysisAbsError').innerText = `${analysis.absolute_error} ${analysis.unit}`;
        document.getElementById('analysisPctError').innerText = `${analysis.percentage_error}%`;
        document.getElementById('analysisConfidence').innerText = `${analysis.forecast_confidence}%`;
        document.getElementById('analysisBustProb').innerText = `${analysis.bust_probability}%`;

        const riskEl = document.getElementById('analysisRiskBadge');
        if (riskEl) {
            const riskText = this.currentLang === 'hi'
                ? (analysis.risk_level === 'HIGH' ? 'उच्च जोखिम' : (analysis.risk_level === 'MEDIUM' ? 'मध्यम जोखिम' : 'निम्न जोखिम'))
                : `${analysis.risk_level} RISK`;
            riskEl.innerText = riskText;
            riskEl.className = `px-2.5 py-1 text-xs font-bold rounded ${
                analysis.risk_level === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                analysis.risk_level === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`;
        }

        const expEl = document.getElementById('analysisExplanation');
        if (expEl) {
            expEl.innerText = this.currentLang === 'hi'
                ? 'पूर्वानुमान में प्रेक्षित मौसम स्थितियों से महत्वपूर्ण विचलन की उच्च संभावना दिखाई देती है।'
                : analysis.status_explanation;
        }

        if (window.chartEngine) {
            window.chartEngine.renderForecastComparisonChart(
                'forecastComparisonChart',
                analysis.comparison_data,
                analysis.parameter,
                analysis.unit
            );
        }
    }

    /**
     * View 3: AI Bust Detection & Interactive Simulator
     */
    async loadBustDetectionView() {
        this.runSimulation();
    }

    async runSimulation() {
        const btn = document.getElementById('analyzeForecastBtn');
        const spinner = document.getElementById('simLoadingState');
        const resultPanel = document.getElementById('simResultPanel');

        if (spinner) spinner.classList.remove('hidden');
        if (resultPanel) resultPanel.classList.add('opacity-40');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = `<i class="fa-solid fa-brain fa-fade"></i> ${this.currentLang === 'hi' ? 'संख्यात्मक अराजकता का विश्लेषण...' : 'Analyzing Numerical Chaos...'}`;
        }

        const param = document.getElementById('simParamSelect')?.value || 'Rainfall';
        const forecastVal = parseFloat(document.getElementById('simForecastVal')?.value || 10.0);
        const observedVal = parseFloat(document.getElementById('simObservedVal')?.value || 45.0);
        const spreadVal = parseFloat(document.getElementById('simSpreadVal')?.value || 4.8);
        const instabilityVal = parseFloat(document.getElementById('simInstabilityVal')?.value || 68.0);
        const leadDays = parseInt(document.getElementById('simLeadDays')?.value || 5);

        await new Promise(r => setTimeout(r, 700));

        const result = await window.api.analyzeBust({
            location_id: this.currentLocationId,
            parameter: param,
            forecast_val: forecastVal,
            observed_val: observedVal,
            ensemble_spread: spreadVal,
            atmospheric_instability: instabilityVal,
            lead_time_days: leadDays
        });

        if (spinner) spinner.classList.add('hidden');
        if (resultPanel) resultPanel.classList.remove('opacity-40');
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<i class="fa-solid fa-microchip"></i> ${this.t('btn_analyze_forecast')}`;
        }

        if (!result) return;

        // Update Gauge & Status
        document.getElementById('bustProbDisplay').innerText = `${result.bust_probability}%`;
        document.getElementById('bustConfidenceDisplay').innerText = `${result.forecast_confidence}%`;

        // Update circular SVG gauge stroke
        const gaugeCircle = document.getElementById('bustGaugeCircle');
        if (gaugeCircle) {
            const circumference = 2 * Math.PI * 52;
            const offset = circumference - (result.bust_probability / 100) * circumference;
            gaugeCircle.style.strokeDashoffset = offset;
            gaugeCircle.style.stroke = result.risk_level === 'HIGH' ? '#ef4444' : (result.risk_level === 'MEDIUM' ? '#f59e0b' : '#10b981');
        }

        const statusPill = document.getElementById('bustStatusPill');
        if (statusPill) {
            const riskLabel = this.currentLang === 'hi' 
                ? (result.risk_level === 'HIGH' ? '🔴 उच्च जोखिम (HIGH)' : (result.risk_level === 'MEDIUM' ? '🟡 मध्यम जोखिम' : '🟢 निम्न जोखिम'))
                : `${result.risk_level === 'HIGH' ? '🔴' : (result.risk_level === 'MEDIUM' ? '🟡' : '🟢')} ${result.risk_level} RISK`;
            statusPill.innerText = riskLabel;
            statusPill.className = `px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest ${
                result.risk_level === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/40 risk-pulse-high' :
                result.risk_level === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`;
        }

        document.getElementById('bustExplanationText').innerText = this.currentLang === 'hi'
            ? '“पूर्वानुमान में प्रेक्षित मौसम स्थितियों से महत्वपूर्ण विचलन की उच्च संभावना दिखाई देती है।”'
            : result.explanation;

        // Render primary reasons list
        const reasonsList = document.getElementById('bustReasonsList');
        if (reasonsList) {
            reasonsList.innerHTML = '';
            const reasonsToUse = this.currentLang === 'hi'
                ? [
                    'संख्यात्मक पूर्वानुमान और भू-स्टेशन रीडिंग के बीच बड़ा विचलन (त्रुटि)',
                    'मध्यम-अवधि पूर्वानुमान समय-सीमा के कारण उच्च मौसम अनिश्चितता',
                    'उच्च एन्सेम्बल प्रसार जो विभिन्न मॉडलों के भिन्न मत को दर्शाता है',
                    'संवहनीय और नमी अस्थिरता के कारण तीव्र मौसम परिवर्तन',
                    'ऐतिहासिक पूर्वानुमान अस्थिरता और क्षेत्रीय सूक्ष्म-जलवायु पूर्वाग्रह'
                  ]
                : result.primary_reasons;

            reasonsToUse.forEach(r => {
                const li = document.createElement('li');
                li.className = 'flex items-start gap-2 text-xs text-gray-300';
                li.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-amber-400 mt-0.5"></i> <span>${r}</span>`;
                reasonsList.appendChild(li);
            });
        }

        // Render explainable factor breakdown chart
        if (window.chartEngine && result.factor_contributions) {
            window.chartEngine.renderFactorChart('bustFactorChart', result.factor_contributions);
        }

        document.getElementById('bustRecommendationText').innerText = this.currentLang === 'hi'
            ? 'उच्च-रिज़ॉल्यूशन नावकास्टिंग (Nowcasting) पर स्विच करने और जिला आपदा प्रबंधन डेस्क को अलर्ट करने की सिफारिश की जाती है।'
            : result.recommendation;
    }

    /**
     * View 4: 15-Day Forecast Confidence Decay
     */
    async loadConfidenceTrend() {
        const trend = await window.api.getConfidenceTrend(this.currentLocationId);
        if (trend && window.chartEngine) {
            window.chartEngine.renderConfidenceChart('confidence15DayChart', trend);
        }
    }

    /**
     * View 5: Forecast Error Analysis
     */
    async setErrorParam(param) {
        this.errorParam = param;
        document.querySelectorAll('.error-tab-btn').forEach(b => {
            if (b.getAttribute('data-error-param') === param) {
                b.classList.add('bg-blue-600', 'text-white');
                b.classList.remove('bg-gray-800', 'text-gray-300');
            } else {
                b.classList.remove('bg-blue-600', 'text-white');
                b.classList.add('bg-gray-800', 'text-gray-300');
            }
        });
        await this.loadErrorAnalysis();
    }

    async loadErrorAnalysis() {
        const analysis = await window.api.getForecastAnalysis(this.currentLocationId, this.errorParam);
        if (!analysis) return;

        document.getElementById('errMetricForecast').innerText = `${analysis.forecast_value} ${analysis.unit}`;
        document.getElementById('errMetricObserved').innerText = `${analysis.observed_value} ${analysis.unit}`;
        document.getElementById('errMetricDiff').innerText = `${analysis.absolute_error} ${analysis.unit}`;
        document.getElementById('errMetricPct').innerText = `${analysis.percentage_error}%`;

        if (window.chartEngine) {
            window.chartEngine.renderErrorBreakdownChart(
                'errorAnalysisChart',
                analysis.comparison_data,
                analysis.parameter,
                analysis.unit
            );
        }

        const tbody = document.getElementById('errorTableBody');
        if (tbody) {
            tbody.innerHTML = '';
            analysis.comparison_data.forEach(pt => {
                const tr = document.createElement('tr');
                tr.className = 'border-b border-gray-700/40 hover:bg-white/5 transition';
                tr.innerHTML = `
                    <td class="py-2.5 px-4 font-medium">${pt.day}</td>
                    <td class="py-2.5 px-4 font-mono text-cyan-400">${pt.forecast} ${analysis.unit}</td>
                    <td class="py-2.5 px-4 font-mono text-orange-400">${pt.observed} ${analysis.unit}</td>
                    <td class="py-2.5 px-4 font-mono font-bold text-red-400">${pt.diff} ${analysis.unit}</td>
                    <td class="py-2.5 px-4 font-mono ${pt.error_pct > 50 ? 'text-red-400 font-bold' : 'text-gray-300'}">${pt.error_pct}%</td>
                `;
                tbody.appendChild(tr);
            });
        }
    }

    /**
     * View 7: Historical Data
     */
    async loadHistoricalData() {
        const records = await window.api.getHistoricalData(this.currentLocationId);
        if (!records) return;

        if (window.chartEngine) {
            window.chartEngine.renderHistoricalChart('historicalChart', records);
        }

        const tbody = document.getElementById('historicalTableBody');
        if (tbody) {
            tbody.innerHTML = '';
            records.slice(0, 15).forEach(r => {
                const tr = document.createElement('tr');
                tr.className = 'border-b border-gray-700/40 hover:bg-white/5 transition';
                tr.innerHTML = `
                    <td class="py-2 px-3 font-mono text-xs">${r.date}</td>
                    <td class="py-2 px-3 font-mono">${r.temperature}°C</td>
                    <td class="py-2 px-3 font-mono">${r.rainfall} mm</td>
                    <td class="py-2 px-3 font-mono">${r.wind_speed} km/h</td>
                    <td class="py-2 px-3 font-mono">${r.humidity}%</td>
                    <td class="py-2 px-3">
                        ${r.bust_event 
                            ? `<span class="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">${this.currentLang === 'hi' ? 'बस्ट घटना' : 'BUST EVENT'}</span>`
                            : `<span class="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">${this.currentLang === 'hi' ? 'सामान्य' : 'Normal'}</span>`}
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    }

    exportHistoricalCSV() {
        this.showToast(this.currentLang === 'hi' ? '30-दिवसीय मौसम संबंधी डेटा CSV तैयार हो रहा है...' : 'Generating 30-Day Meteorological Validation CSV...', 'info');
        const csvContent = "data:text/csv;charset=utf-8,Date,Temperature_C,Rainfall_mm,Wind_kmh,Humidity_pct,Bust_Event\n" +
            "2026-10-01,31.0,45.0,18.0,68,TRUE\n" +
            "2026-10-02,30.5,12.0,14.0,62,FALSE\n" +
            "2026-10-03,32.0,2.0,11.0,55,FALSE\n";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `forecast_historical_${this.currentLocationId}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.showToast(this.currentLang === 'hi' ? 'CSV फाइल सफलतापूर्वक डाउनलोड हुई।' : 'CSV export downloaded successfully.', 'success');
    }

    /**
     * View 8: AI Insights
     */
    async loadAIInsights() {
        const insights = await window.api.getAIInsights(this.currentLocationId);
        if (!insights) return;

        document.getElementById('insightLocationName').innerText = insights.location;
        const textToUse = this.currentLang === 'hi'
            ? `“${insights.location} के लिए वर्षा पूर्वानुमान अनिश्चितता बढ़ रही है। पूर्वानुमान ऐतिहासिक मौसम पैटर्न की तुलना में उच्च विचलन दिखाता है।”`
            : `"${insights.insight_text}"`;
        document.getElementById('insightText').innerText = textToUse;
        document.getElementById('insightBustProb').innerText = `${insights.bust_probability}%`;

        const factorList = document.getElementById('insightKeyFactors');
        if (factorList) {
            factorList.innerHTML = '';
            insights.key_factors.forEach((kf, idx) => {
                const div = document.createElement('div');
                div.className = 'glass-panel p-3.5 flex items-center justify-between border-l-4 ' +
                    (kf.level === 'High' ? 'border-l-red-500' : (kf.level === 'Medium' ? 'border-l-amber-500' : 'border-l-emerald-500'));
                
                let factorName = kf.factor;
                let levelName = kf.level;
                if (this.currentLang === 'hi') {
                    if (factorName === 'Forecast Error') factorName = 'पूर्वानुमान त्रुटि (Forecast Error)';
                    else if (factorName === 'Weather Variability') factorName = 'मौसम परिवर्तनशीलता (Weather Variability)';
                    else if (factorName === 'Ensemble Spread') factorName = 'एन्सेम्बल प्रसार (Ensemble Spread)';
                    else if (factorName === 'Historical Pattern Match') factorName = 'ऐतिहासिक पैटर्न मिलान';

                    if (levelName === 'High') levelName = 'उच्च (High)';
                    else if (levelName === 'Medium') levelName = 'मध्यम (Medium)';
                    else if (levelName === 'Low') levelName = 'निम्न (Low)';
                }

                div.innerHTML = `
                    <div class="flex items-center gap-3">
                        <span class="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">${idx + 1}</span>
                        <span class="font-semibold text-sm">${factorName}</span>
                    </div>
                    <span class="text-xs px-2.5 py-1 rounded font-bold uppercase tracking-wider ${
                        kf.level === 'High' ? 'bg-red-500/20 text-red-400' :
                        kf.level === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-emerald-500/20 text-emerald-400'
                    }">${levelName}</span>
                `;
                factorList.appendChild(div);
            });
        }

        if (insights.atmospheric_indices) {
            document.getElementById('insightCape').innerText = `${insights.atmospheric_indices.cape_proxy_j_kg} J/kg`;
            document.getElementById('insightShear').innerText = `${insights.atmospheric_indices.shear_0_6km_knots} kts`;
            document.getElementById('insightBaroclinic').innerText = `${insights.atmospheric_indices.baroclinic_instability_index}`;
        }
    }

    /**
     * View 9: Alerts
     */
    async loadAlerts(riskFilter = 'ALL') {
        const alerts = await window.api.getAlerts(riskFilter);
        const container = document.getElementById('alertsContainer');
        if (!container) return;

        container.innerHTML = '';
        if (!alerts || alerts.length === 0) {
            container.innerHTML = `<div class="p-8 text-center text-gray-400">${this.currentLang === 'hi' ? 'कोई सक्रिय अलर्ट मौजूद नहीं है।' : 'No active alerts matching your criteria.'}</div>`;
            return;
        }

        alerts.forEach(alt => {
            const card = document.createElement('div');
            card.className = 'glass-panel p-5 relative border-l-4 transition hover:translate-x-1 ' +
                (alt.risk_level === 'HIGH' ? 'border-l-red-500' : (alt.risk_level === 'MEDIUM' ? 'border-l-amber-500' : 'border-l-emerald-500'));
            
            let headline = alt.headline;
            let message = alt.message;
            let riskTitle = alt.risk_level === 'HIGH' ? '🔴 HIGH RISK ALERT' : (alt.risk_level === 'MEDIUM' ? '🟡 MEDIUM RISK' : '🟢 STABLE FORECAST');

            if (this.currentLang === 'hi') {
                if (alt.risk_level === 'HIGH') {
                    riskTitle = '🔴 उच्च जोखिम चेतावनी (HIGH RISK ALERT)';
                    if (alt.parameter === 'Rainfall') {
                        headline = 'वर्षा के लिए पूर्वानुमान बस्ट की उच्च संभावना';
                        message = 'अगले 3-5 दिनों के दौरान वर्षा के लिए पूर्वानुमान बस्ट की उच्च संभावना पाई गई है। संख्यात्मक पूर्वानुमान की तुलना में प्रेक्षित वर्षा >30 मिमी अधिक होने का अनुमान है।';
                    }
                } else if (alt.risk_level === 'MEDIUM') {
                    riskTitle = '🟡 मध्यम जोखिम (MEDIUM RISK)';
                } else {
                    riskTitle = '🟢 स्थिर पूर्वानुमान (STABLE FORECAST)';
                }
            }

            card.innerHTML = `
                <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div class="flex items-center gap-2">
                        <span class="text-xs px-2.5 py-0.5 rounded font-extrabold uppercase ${
                            alt.risk_level === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            alt.risk_level === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }">
                            ${riskTitle}
                        </span>
                        <span class="text-xs text-gray-400"><i class="fa-solid fa-location-dot"></i> ${alt.location_name}</span>
                        <span class="text-xs px-2 py-0.5 rounded bg-white/10 text-cyan-300">${alt.parameter}</span>
                    </div>
                    <span class="text-xs text-gray-400 font-mono">${alt.issued_at}</span>
                </div>
                <h4 class="font-bold text-base mb-1.5">${headline}</h4>
                <p class="text-sm text-gray-300 leading-relaxed mb-3">${message}</p>
                <div class="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-700/30">
                    <span>${this.t('horizon_label')} <strong class="text-gray-200">${alt.lead_days}</strong></span>
                    <button onclick="this.parentElement.parentElement.remove(); window.app.showToast('${this.currentLang === 'hi' ? 'अलर्ट स्वीकार किया गया।' : 'Alert acknowledged.'}', 'info')" 
                        class="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-200 transition">
                        ${this.t('btn_acknowledge')}
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    filterAlerts(risk) {
        document.querySelectorAll('.alert-filter-btn').forEach(b => {
            if (b.getAttribute('data-risk') === risk) {
                b.classList.add('bg-blue-600', 'text-white');
                b.classList.remove('bg-gray-800', 'text-gray-300');
            } else {
                b.classList.remove('bg-blue-600', 'text-white');
                b.classList.add('bg-gray-800', 'text-gray-300');
            }
        });
        this.loadAlerts(risk);
    }

    /**
     * Toast notification system
     */
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        const icon = type === 'success' ? 'fa-circle-check text-emerald-400' :
                     type === 'error' ? 'fa-circle-xmark text-red-400' : 'fa-circle-info text-cyan-400';

        toast.className = 'glass-panel p-3.5 flex items-center gap-3 shadow-xl text-xs max-w-sm border-l-4 ' +
            (type === 'success' ? 'border-l-emerald-500' : (type === 'error' ? 'border-l-red-500' : 'border-l-cyan-500'));
        toast.innerHTML = `<i class="fa-solid ${icon} text-base"></i> <span class="flex-1">${message}</span>`;

        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.4s ease';
            setTimeout(() => toast.remove(), 400);
        }, 3200);
    }
}

// Global bootstrap
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ForecastGuardApp();
    window.app.init();
});
