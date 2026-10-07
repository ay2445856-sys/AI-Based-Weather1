/**
 * ForecastGuard AI - Charts Engine (Powered by Chart.js)
 * Manages responsive, theme-adaptive charts for forecast error, confidence trends, and comparisons.
 */

class ChartEngine {
    constructor() {
        this.instances = {};
    }

    getThemeColors() {
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        return {
            textColor: isDark ? '#f0f6fc' : '#0f172a',
            mutedColor: isDark ? '#94a3b8' : '#64748b',
            gridColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
            accentBlue: '#2563eb',
            accentCyan: '#06b6d4',
            forecastColor: '#38bdf8',
            observedColor: '#f97316',
            errorColor: '#ef4444',
            confidenceFill: isDark ? 'rgba(6, 182, 212, 0.15)' : 'rgba(37, 99, 235, 0.12)'
        };
    }

    destroyChart(key) {
        if (this.instances[key]) {
            this.instances[key].destroy();
            delete this.instances[key];
        }
    }

    /**
     * 1. Forecast vs Observed Comparison Chart (Forecast Analysis Section)
     */
    renderForecastComparisonChart(canvasId, comparisonData, paramName, unit) {
        this.destroyChart(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const colors = this.getThemeColors();
        const labels = comparisonData.map(d => d.day);
        const forecastVals = comparisonData.map(d => d.forecast);
        const observedVals = comparisonData.map(d => d.observed);
        const errorVals = comparisonData.map(d => d.diff);

        this.instances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: `Forecast (${unit})`,
                        data: forecastVals,
                        backgroundColor: 'rgba(56, 189, 248, 0.75)',
                        borderColor: '#38bdf8',
                        borderWidth: 1.5,
                        borderRadius: 6,
                        order: 2
                    },
                    {
                        label: `Observed (${unit})`,
                        data: observedVals,
                        backgroundColor: 'rgba(249, 115, 22, 0.85)',
                        borderColor: '#ea580c',
                        borderWidth: 1.5,
                        borderRadius: 6,
                        order: 2
                    },
                    {
                        label: `Difference Error (${unit})`,
                        data: errorVals,
                        type: 'line',
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        borderWidth: 2.5,
                        pointBackgroundColor: '#ef4444',
                        pointRadius: 5,
                        fill: false,
                        order: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: colors.textColor, font: { family: 'Plus Jakarta Sans', size: 12 } }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        titleColor: '#38bdf8',
                        bodyColor: '#ffffff',
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            footer: (items) => {
                                const idx = items[0].dataIndex;
                                return `Error %: ${comparisonData[idx].error_pct}%`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: colors.mutedColor },
                        grid: { display: false }
                    },
                    y: {
                        ticks: { color: colors.mutedColor },
                        grid: { color: colors.gridColor },
                        title: { display: true, text: `${paramName} (${unit})`, color: colors.textColor }
                    }
                }
            }
        });
    }

    /**
     * 2. 15-Day Medium-Range Forecast Confidence Chart
     */
    renderConfidenceChart(canvasId, confidenceData) {
        this.destroyChart(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const colors = this.getThemeColors();
        const labels = confidenceData.map(d => `Day ${d.day}`);
        const confidenceVals = confidenceData.map(d => d.confidence);
        const upperBounds = confidenceData.map(d => d.upper_bound);
        const lowerBounds = confidenceData.map(d => d.lower_bound);

        this.instances[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Forecast Confidence (%)',
                        data: confidenceVals,
                        borderColor: '#06b6d4',
                        backgroundColor: colors.confidenceFill,
                        fill: true,
                        tension: 0.35,
                        borderWidth: 3,
                        pointBackgroundColor: '#00e5ff',
                        pointBorderColor: '#0f172a',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 8
                    },
                    {
                        label: 'Confidence Envelope (Upper)',
                        data: upperBounds,
                        borderColor: 'rgba(56, 189, 248, 0.35)',
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 0
                    },
                    {
                        label: 'Confidence Envelope (Lower)',
                        data: lowerBounds,
                        borderColor: 'rgba(239, 68, 68, 0.35)',
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: colors.textColor, font: { family: 'Plus Jakarta Sans', size: 12 } }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        callbacks: {
                            label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}%`
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: colors.mutedColor },
                        grid: { color: colors.gridColor }
                    },
                    y: {
                        min: 0,
                        max: 100,
                        ticks: { color: colors.mutedColor, callback: v => `${v}%` },
                        grid: { color: colors.gridColor },
                        title: { display: true, text: 'Confidence Score (%)', color: colors.textColor }
                    }
                }
            }
        });
    }

    /**
     * 3. Forecast Error Analysis Chart (Tabs for Temp, Rain, Wind, Humidity)
     */
    renderErrorBreakdownChart(canvasId, metricTrend, paramName, unit) {
        this.destroyChart(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const colors = this.getThemeColors();
        const labels = metricTrend.map(d => d.day);
        const errorPct = metricTrend.map(d => d.error_pct);
        const rawDiff = metricTrend.map(d => d.diff);

        this.instances[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: `Difference Error (${unit})`,
                        data: rawDiff,
                        borderColor: '#f43f5e',
                        backgroundColor: 'rgba(244, 63, 94, 0.2)',
                        borderWidth: 2.5,
                        yAxisID: 'y',
                        pointRadius: 4,
                        tension: 0.3
                    },
                    {
                        label: 'Error Percentage (%)',
                        data: errorPct,
                        borderColor: '#eab308',
                        backgroundColor: 'rgba(234, 179, 8, 0.1)',
                        borderDash: [4, 4],
                        borderWidth: 2,
                        yAxisID: 'y1',
                        pointRadius: 4,
                        tension: 0.2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: colors.textColor } }
                },
                scales: {
                    x: { ticks: { color: colors.mutedColor }, grid: { display: false } },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        ticks: { color: colors.mutedColor },
                        grid: { color: colors.gridColor },
                        title: { display: true, text: `Difference (${unit})`, color: colors.textColor }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        ticks: { color: '#eab308', callback: v => `${v}%` },
                        grid: { drawOnChartArea: false },
                        title: { display: true, text: 'Error %', color: '#eab308' }
                    }
                }
            }
        });
    }

    /**
     * 4. AI Feature Contribution Chart (SHAP-style explainability in Bust Detection)
     */
    renderFactorChart(canvasId, factorContributions) {
        this.destroyChart(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const colors = this.getThemeColors();
        const labels = factorContributions.map(f => f.name);
        const weights = factorContributions.map(f => f.weight_pct);
        const barColors = factorContributions.map(f => {
            if (f.impact === 'High') return 'rgba(239, 68, 68, 0.85)';
            if (f.impact === 'Medium') return 'rgba(245, 158, 11, 0.85)';
            return 'rgba(16, 185, 129, 0.85)';
        });

        this.instances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Risk Contribution Weight (%)',
                    data: weights,
                    backgroundColor: barColors,
                    borderRadius: 8,
                    borderWidth: 0
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            afterLabel: (ctx) => factorContributions[ctx.dataIndex].description
                        }
                    }
                },
                scales: {
                    x: {
                        max: 60,
                        ticks: { color: colors.mutedColor, callback: v => `${v}%` },
                        grid: { color: colors.gridColor },
                        title: { display: true, text: 'Attribution Weight (%)', color: colors.textColor }
                    },
                    y: {
                        ticks: { color: colors.textColor, font: { size: 11, weight: 'bold' } },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    /**
     * 5. Historical Weather 30-Day Trend Chart
     */
    renderHistoricalChart(canvasId, historicalRecords) {
        this.destroyChart(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const colors = this.getThemeColors();
        const labels = historicalRecords.map(r => r.date.slice(5));
        const temps = historicalRecords.map(r => r.temperature);
        const rains = historicalRecords.map(r => r.rainfall);

        this.instances[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Temperature (°C)',
                        data: temps,
                        borderColor: '#f97316',
                        backgroundColor: 'rgba(249, 115, 22, 0.1)',
                        yAxisID: 'yTemp',
                        tension: 0.3,
                        pointRadius: 2
                    },
                    {
                        label: 'Precipitation (mm)',
                        data: rains,
                        type: 'bar',
                        backgroundColor: 'rgba(56, 189, 248, 0.65)',
                        borderColor: '#38bdf8',
                        borderWidth: 1,
                        yAxisID: 'yRain',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: colors.textColor } }
                },
                scales: {
                    x: { ticks: { color: colors.mutedColor, maxTicksLimit: 12 }, grid: { display: false } },
                    yTemp: {
                        type: 'linear',
                        position: 'left',
                        ticks: { color: '#f97316' },
                        grid: { color: colors.gridColor },
                        title: { display: true, text: 'Temperature (°C)', color: '#f97316' }
                    },
                    yRain: {
                        type: 'linear',
                        position: 'right',
                        ticks: { color: '#38bdf8' },
                        grid: { drawOnChartArea: false },
                        title: { display: true, text: 'Rainfall (mm)', color: '#38bdf8' }
                    }
                }
            }
        });
    }

    updateThemeAll() {
        // Redraw active charts when theme toggles
        Object.values(this.instances).forEach(chart => {
            const colors = this.getThemeColors();
            if (chart.options.scales) {
                Object.values(chart.options.scales).forEach(scale => {
                    if (scale.grid) scale.grid.color = colors.gridColor;
                    if (scale.ticks) scale.ticks.color = colors.mutedColor;
                });
            }
            if (chart.options.plugins?.legend?.labels) {
                chart.options.plugins.legend.labels.color = colors.textColor;
            }
            chart.update();
        });
    }
}

window.chartEngine = new ChartEngine();
