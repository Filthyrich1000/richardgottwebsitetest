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
                    ma20: 78.5,
                    ma50: 65.2,
                    ma200: 52.8,
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
                    ma20: 72.3,
                    ma50: 58.9,
                    ma200: 45.6,
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
                    ma20: 68.9,
                    ma50: 54.2,
                    ma200: 41.7,
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
                    ma20: 63.3,
                    ma50: 50.0,
                    ma200: 36.7,
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
                    ma20: 81.2,
                    ma50: 69.8,
                    ma200: 58.4,
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
        const ma20Data = [];
        const ma50Data = [];
        const ma200Data = [];
        
        let ma20 = 70;
        let ma50 = 60;
        let ma200 = 50;
        
        for (let i = 0; i < points; i++) {
            ma20 += (Math.random() - 0.5) * 5;
            ma50 += (Math.random() - 0.5) * 3;
            ma200 += (Math.random() - 0.5) * 2;
            
            ma20 = Math.max(0, Math.min(100, ma20));
            ma50 = Math.max(0, Math.min(100, ma50));
            ma200 = Math.max(0, Math.min(100, ma200));
            
            const date = new Date();
            date.setDate(date.getDate() - (points - i));
            const dateStr = date.toISOString().split('T')[0];
            
            ma20Data.push({ x: dateStr, y: parseFloat(ma20.toFixed(1)) });
            ma50Data.push({ x: dateStr, y: parseFloat(ma50.toFixed(1)) });
            ma200Data.push({ x: dateStr, y: parseFloat(ma200.toFixed(1)) });
        }
        
        return { ma20: ma20Data, ma50: ma50Data, ma200: ma200Data };
    }

    createCharts() {
        console.log('Creating charts...');
        
        // McClellan Summation Index Chart
        const summationCtx = document.getElementById('summationChart').getContext('2d');
        console.log('Summation chart context:', summationCtx);
        
        this.charts.summation = new Chart(summationCtx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'McClellan Summation Index',
                    data: [],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: this.getChartOptions('McClellan Summation Index')
        });
        
        console.log('Summation chart created:', this.charts.summation);

        // McClellan Oscillator Chart
        const oscillatorCtx = document.getElementById('oscillatorChart').getContext('2d');
        this.charts.oscillator = new Chart(oscillatorCtx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'McClellan Oscillator',
                    data: [],
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: this.getChartOptions('McClellan Oscillator', true)
        });
        
        console.log('Oscillator chart created:', this.charts.oscillator);

        // Moving Averages Chart
        const maCtx = document.getElementById('movingAveragesChart').getContext('2d');
        this.charts.movingAverages = new Chart(maCtx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: '20-day SMA',
                        data: [],
                        borderColor: '#ff6b6b',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: '50-day SMA',
                        data: [],
                        borderColor: '#4ecdc4',
                        backgroundColor: 'rgba(78, 205, 196, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: '200-day SMA',
                        data: [],
                        borderColor: '#45b7d1',
                        backgroundColor: 'rgba(69, 183, 209, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: this.getChartOptions('Percent of Stocks Above Moving Averages (%)')
        });
        
        console.log('Moving averages chart created:', this.charts.movingAverages);
        console.log('All charts created successfully');
    }

    getChartOptions(title, showZeroLine = false) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: false
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        displayFormats: {
                            day: 'MMM dd',
                            month: 'MMM yyyy'
                        },
                        tooltipFormat: 'MMM dd, yyyy'
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

    updateDisplay() {
        const exchangeData = this.data[this.currentExchange];
        
        // Update current values
        document.getElementById('summation-value').textContent = exchangeData.summationIndex.current.toFixed(2);
        document.getElementById('oscillator-value').textContent = exchangeData.oscillator.current.toFixed(2);
        
        // Update change indicators
        this.updateChangeIndicator('summation-change', exchangeData.summationIndex.change);
        this.updateChangeIndicator('oscillator-change', exchangeData.oscillator.change);
        
        // Update moving averages
        document.getElementById('ma20-value').textContent = exchangeData.movingAverages.ma20.toFixed(1);
        document.getElementById('ma50-value').textContent = exchangeData.movingAverages.ma50.toFixed(1);
        document.getElementById('ma200-value').textContent = exchangeData.movingAverages.ma200.toFixed(1);
        
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
        
        // Update Summation Index chart
        console.log('Summation history data:', exchangeData.summationIndex.history);
        this.charts.summation.data.datasets[0].data = exchangeData.summationIndex.history;
        this.charts.summation.update('none');
        
        // Update Oscillator chart
        console.log('Oscillator history data:', exchangeData.oscillator.history);
        this.charts.oscillator.data.datasets[0].data = exchangeData.oscillator.history;
        this.charts.oscillator.update('none');
        
        // Update Moving Averages chart
        console.log('MA history data:', exchangeData.movingAverages.history);
        this.charts.movingAverages.data.datasets[0].data = exchangeData.movingAverages.history.ma20;
        this.charts.movingAverages.data.datasets[1].data = exchangeData.movingAverages.history.ma50;
        this.charts.movingAverages.data.datasets[2].data = exchangeData.movingAverages.history.ma200;
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