// Global Financial Dashboard JavaScript
class FinancialDashboard {
    constructor() {
        this.currentExchange = 'FTSE';
        this.charts = {};
        this.data = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSampleData();
        this.createCharts();
        this.updateDisplay();
        this.updateLastUpdateTime();
        
        // Ensure charts render properly
        setTimeout(() => {
            Object.values(this.charts).forEach(chart => {
                if (chart) chart.resize();
            });
        }, 100);
    }

    setupEventListeners() {
        // Exchange tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchExchange(e.target.dataset.exchange);
            });
        });

        // Auto-refresh every 5 minutes (in production, this would be less frequent)
        setInterval(() => {
            this.refreshData();
        }, 300000);
    }

    switchExchange(exchange) {
        this.currentExchange = exchange;
        
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-exchange="${exchange}"]`).classList.add('active');
        
        // Update charts and data
        this.updateDisplay();
    }

    loadSampleData() {
        // Sample data structure - in production, this comes from PHP backend
        this.data = {
            FTSE: {
                summationIndex: {
                    current: 395.42,
                    change: 12.8,
                    history: this.generateSampleData(100, 300, 500)
                },
                oscillator: {
                    current: -15.23,
                    change: -3.2,
                    history: this.generateOscillatorData(100)
                },
                movingAverages: {
                    sma5: 78.5,
                    ema10: 72.3,
                    ema21: 68.1,
                    sma35: 65.2,
                    sma50: 60.8,
                    sma200: 52.8,
                    history: this.generateMAData(100)
                },
                stats: {
                    advancing: 68,
                    declining: 32,
                    total: 100,
                    netAdvances: 36
                }
            },
            TSX: {
                summationIndex: {
                    current: 287.15,
                    change: -8.4,
                    history: this.generateSampleData(100, 200, 400)
                },
                oscillator: {
                    current: 8.67,
                    change: 2.1,
                    history: this.generateOscillatorData(100)
                },
                movingAverages: {
                    sma5: 72.3,
                    ema10: 68.1,
                    ema21: 63.4,
                    sma35: 58.9,
                    sma50: 54.2,
                    sma200: 45.6,
                    history: this.generateMAData(100)
                },
                stats: {
                    advancing: 145,
                    declining: 95,
                    total: 240,
                    netAdvances: 50
                }
            },
            HSI: {
                summationIndex: {
                    current: 156.89,
                    change: 5.2,
                    history: this.generateSampleData(100, 100, 300)
                },
                oscillator: {
                    current: 12.45,
                    change: 1.8,
                    history: this.generateOscillatorData(100)
                },
                movingAverages: {
                    sma5: 68.9,
                    ema10: 64.5,
                    ema21: 59.8,
                    sma35: 54.2,
                    sma50: 48.7,
                    sma200: 41.7,
                    history: this.generateMAData(100)
                },
                stats: {
                    advancing: 56,
                    declining: 26,
                    total: 82,
                    netAdvances: 30
                }
            },
            KLCI: {
                summationIndex: {
                    current: 89.34,
                    change: -2.1,
                    history: this.generateSampleData(100, 50, 150)
                },
                oscillator: {
                    current: -5.67,
                    change: -1.2,
                    history: this.generateOscillatorData(100)
                },
                movingAverages: {
                    sma5: 63.3,
                    ema10: 58.9,
                    ema21: 54.2,
                    sma35: 50.0,
                    sma50: 45.1,
                    sma200: 36.7,
                    history: this.generateMAData(100)
                },
                stats: {
                    advancing: 19,
                    declining: 11,
                    total: 30,
                    netAdvances: 8
                }
            },
            N225: {
                summationIndex: {
                    current: 234.67,
                    change: 15.3,
                    history: this.generateSampleData(100, 150, 350)
                },
                oscillator: {
                    current: 18.92,
                    change: 4.5,
                    history: this.generateOscillatorData(100)
                },
                movingAverages: {
                    sma5: 81.2,
                    ema10: 76.8,
                    ema21: 72.4,
                    sma35: 69.8,
                    sma50: 64.3,
                    sma200: 58.4,
                    history: this.generateMAData(100)
                },
                stats: {
                    advancing: 182,
                    declining: 43,
                    total: 225,
                    netAdvances: 139
                }
            }
        };
    }

    generateSampleData(points, min, max) {
        const data = [];
        let value = (min + max) / 2;
        
        for (let i = 0; i < points; i++) {
            const change = (Math.random() - 0.5) * 20;
            value += change;
            value = Math.max(min, Math.min(max, value));
            
            const date = new Date();
            date.setDate(date.getDate() - (points - i));
            
            data.push({
                x: date.toISOString().split('T')[0],
                y: parseFloat(value.toFixed(2))
            });
        }
        
        return data;
    }

    generateOscillatorData(points) {
        const data = [];
        let value = 0;
        
        for (let i = 0; i < points; i++) {
            const change = (Math.random() - 0.5) * 10;
            value += change;
            value = Math.max(-50, Math.min(50, value));
            
            const date = new Date();
            date.setDate(date.getDate() - (points - i));
            
            data.push({
                x: date.toISOString().split('T')[0],
                y: parseFloat(value.toFixed(2))
            });
        }
        
        return data;
    }

    generateMAData(points) {
        const sma5Data = [];
        const ema10Data = [];
        const ema21Data = [];
        const sma35Data = [];
        const sma50Data = [];
        const sma200Data = [];
        
        let sma5 = 75;
        let ema10 = 70;
        let ema21 = 65;
        let sma35 = 60;
        let sma50 = 55;
        let sma200 = 45;
        
        for (let i = 0; i < points; i++) {
            sma5 += (Math.random() - 0.5) * 8;
            ema10 += (Math.random() - 0.5) * 6;
            ema21 += (Math.random() - 0.5) * 5;
            sma35 += (Math.random() - 0.5) * 4;
            sma50 += (Math.random() - 0.5) * 3;
            sma200 += (Math.random() - 0.5) * 2;
            
            sma5 = Math.max(0, Math.min(100, sma5));
            ema10 = Math.max(0, Math.min(100, ema10));
            ema21 = Math.max(0, Math.min(100, ema21));
            sma35 = Math.max(0, Math.min(100, sma35));
            sma50 = Math.max(0, Math.min(100, sma50));
            sma200 = Math.max(0, Math.min(100, sma200));
            
            const date = new Date();
            date.setDate(date.getDate() - (points - i));
            const dateStr = date.toISOString().split('T')[0];
            
            sma5Data.push({ x: dateStr, y: parseFloat(sma5.toFixed(1)) });
            ema10Data.push({ x: dateStr, y: parseFloat(ema10.toFixed(1)) });
            ema21Data.push({ x: dateStr, y: parseFloat(ema21.toFixed(1)) });
            sma35Data.push({ x: dateStr, y: parseFloat(sma35.toFixed(1)) });
            sma50Data.push({ x: dateStr, y: parseFloat(sma50.toFixed(1)) });
            sma200Data.push({ x: dateStr, y: parseFloat(sma200.toFixed(1)) });
        }
        
        return { 
            sma5: sma5Data, 
            ema10: ema10Data, 
            ema21: ema21Data, 
            sma35: sma35Data, 
            sma50: sma50Data, 
            sma200: sma200Data 
        };
    }

    // Generate 10-period moving average for summation index
    calculateMovingAverage(data, period = 10) {
        const maData = [];
        for (let i = period - 1; i < data.length; i++) {
            const slice = data.slice(i - period + 1, i + 1);
            const average = slice.reduce((sum, point) => sum + point.y, 0) / period;
            maData.push({
                x: data[i].x,
                y: parseFloat(average.toFixed(2))
            });
        }
        return maData;
    }

    createCharts() {
        console.log('Creating charts...');
        
        // McClellan Summation Index Chart
        const summationCtx = document.getElementById('summationChart').getContext('2d');
        
        this.charts.summation = new Chart(summationCtx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'McClellan Summation Index',
                        data: [],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: '10-Period MA',
                        data: [],
                        borderColor: '#ff9500',
                        backgroundColor: 'rgba(255, 149, 0, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1
                    }
                ]
            },
            options: this.getSummationChartOptions()
        });

        // McClellan Oscillator Chart
        const oscillatorCtx = document.getElementById('oscillatorChart').getContext('2d');
        
        this.charts.oscillator = new Chart(oscillatorCtx, {
            type: 'bar',
            data: {
                datasets: [{
                    label: 'McClellan Oscillator',
                    data: [],
                    backgroundColor: [],
                    borderColor: [],
                    borderWidth: 1
                }]
            },
            options: this.getOscillatorChartOptions()
        });

        // Moving Averages Chart
        const maCtx = document.getElementById('movingAveragesChart').getContext('2d');
        
        this.charts.movingAverages = new Chart(maCtx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: '5-day SMA',
                        data: [],
                        borderColor: '#ff1744',
                        backgroundColor: 'rgba(255, 23, 68, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: '10-day EMA',
                        data: [],
                        borderColor: '#9c27b0',
                        backgroundColor: 'rgba(156, 39, 176, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: '21-day EMA',
                        data: [],
                        borderColor: '#2196f3',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: '35-day SMA',
                        data: [],
                        borderColor: '#4caf50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: '50-day SMA',
                        data: [],
                        borderColor: '#000000',
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: '200-day SMA',
                        data: [],
                        borderColor: '#ffc107',
                        backgroundColor: 'rgba(255, 193, 7, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1
                    }
                ]
            },
            options: this.getMAChartOptions()
        });
        
        console.log('All charts created successfully');
    }

    getSummationChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        displayFormats: {
                            day: 'MMM dd'
                        }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                }
            },
            elements: {
                point: {
                    radius: 0,
                    hoverRadius: 4
                }
            }
        };
    }

    getOscillatorChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        displayFormats: {
                            day: 'MMM dd'
                        }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                }
            }
        };
    }

    getMAChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        displayFormats: {
                            day: 'MMM dd'
                        }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                y: {
                    min: 0,
                    max: 100,
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                }
            },
            elements: {
                point: {
                    radius: 0,
                    hoverRadius: 4
                }
            }
        };
    }

    updateDisplay() {
        const exchangeData = this.data[this.currentExchange];
        
        // Update current values
        document.getElementById('summation-value').textContent = exchangeData.summationIndex.current.toFixed(2);
        document.getElementById('oscillator-value').textContent = exchangeData.oscillator.current.toFixed(2);
        
        // Update change indicators
        this.updateChangeIndicator('summation-change', exchangeData.summationIndex.change);
        this.updateChangeIndicator('oscillator-change', exchangeData.oscillator.change);
        
        // Update all moving averages
        document.getElementById('sma5-value').textContent = exchangeData.movingAverages.sma5.toFixed(1);
        document.getElementById('ema10-value').textContent = exchangeData.movingAverages.ema10.toFixed(1);
        document.getElementById('ma20-value').textContent = exchangeData.movingAverages.ema21.toFixed(1);
        document.getElementById('sma35-value').textContent = exchangeData.movingAverages.sma35.toFixed(1);
        document.getElementById('ma50-value').textContent = exchangeData.movingAverages.sma50.toFixed(1);
        document.getElementById('ma200-value').textContent = exchangeData.movingAverages.sma200.toFixed(1);
        
        // Update statistics
        document.getElementById('advancing-stocks').textContent = exchangeData.stats.advancing;
        document.getElementById('declining-stocks').textContent = exchangeData.stats.declining;
        document.getElementById('net-advances').textContent = exchangeData.stats.netAdvances > 0 ? `+${exchangeData.stats.netAdvances}` : exchangeData.stats.netAdvances;
        document.getElementById('total-stocks').textContent = exchangeData.stats.total;
        
        // Update charts
        this.updateCharts(exchangeData);
    }

    updateChangeIndicator(elementId, change) {
        const element = document.getElementById(elementId);
        const isPositive = change > 0;
        
        element.textContent = `${isPositive ? '+' : ''}${change.toFixed(2)}`;
        element.className = `change-indicator ${isPositive ? 'positive' : 'negative'}`;
    }

    updateCharts(exchangeData) {
        console.log('Updating charts with data:', exchangeData);
        
        // Update Summation Index chart with 10-period MA
        const summationHistory = exchangeData.summationIndex.history;
        const summationMA = this.calculateMovingAverage(summationHistory, 10);
        
        this.charts.summation.data.datasets[0].data = summationHistory;
        this.charts.summation.data.datasets[1].data = summationMA;
        this.charts.summation.update('none');
        
        // Update Oscillator chart with colored bars
        const oscillatorHistory = exchangeData.oscillator.history;
        const colors = oscillatorHistory.map(point => 
            point.y >= 0 ? '#4caf50' : '#f44336'  // Green for positive, red for negative
        );
        const borderColors = oscillatorHistory.map(point => 
            point.y >= 0 ? '#388e3c' : '#d32f2f'  // Darker borders
        );
        
        this.charts.oscillator.data.datasets[0].data = oscillatorHistory;
        this.charts.oscillator.data.datasets[0].backgroundColor = colors;
        this.charts.oscillator.data.datasets[0].borderColor = borderColors;
        this.charts.oscillator.update('none');
        
        // Update Moving Averages chart with all 6 lines
        const maHistory = exchangeData.movingAverages.history;
        this.charts.movingAverages.data.datasets[0].data = maHistory.sma5;
        this.charts.movingAverages.data.datasets[1].data = maHistory.ema10;
        this.charts.movingAverages.data.datasets[2].data = maHistory.ema21;
        this.charts.movingAverages.data.datasets[3].data = maHistory.sma35;
        this.charts.movingAverages.data.datasets[4].data = maHistory.sma50;
        this.charts.movingAverages.data.datasets[5].data = maHistory.sma200;
        this.charts.movingAverages.update('none');
        
        console.log('Charts updated successfully');
    }

    updateLastUpdateTime() {
        const now = new Date();
        const timeString = now.toLocaleString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        });
        document.getElementById('lastUpdate').textContent = timeString;
    }

    async refreshData() {
        try {
            console.log('Refreshing data for exchange:', this.currentExchange);
            
            // Try to fetch real data from API
            const response = await fetch(`api/get-data.php?exchange=${this.currentExchange}`);
            
            if (response.ok) {
                const newData = await response.json();
                console.log('Received data:', newData);
                
                // Update data structure to match API response
                if (newData && !newData.error) {
                    this.data[this.currentExchange] = newData;
                    this.updateDisplay();
                }
            } else {
                console.log('API not available, using sample data');
            }
        } catch (error) {
            console.log('Error fetching data, using sample data:', error.message);
        }
        
        // Always update timestamp
        this.updateLastUpdateTime();
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new FinancialDashboard();
});

// Chart.js is now properly configured with the date-fns adapter