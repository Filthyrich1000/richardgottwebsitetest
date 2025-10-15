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
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchExchange(e.target.dataset.exchange);
            });
        });

        setInterval(() => {
            this.refreshData();
        }, 300000);
    }

    switchExchange(exchange) {
        this.currentExchange = exchange;
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-exchange="${exchange}"]`).classList.add('active');
        
        this.updateDisplay();
    }

    loadSampleData() {
        this.data = {
            FTSE: {
                summationIndex: {
                    current: 395.42,
                    change: 12.8,
                    history: this.generateSampleData(30, 300, 500)
                },
                oscillator: {
                    current: -15.23,
                    change: -3.2,
                    history: this.generateOscillatorData(30)
                },
                movingAverages: {
                    sma5: 78.5,
                    ema10: 72.3,
                    ema21: 68.1,
                    sma35: 65.2,
                    sma50: 60.8,
                    sma200: 52.8,
                    history: this.generateMAData(30)
                },
                stats: {
                    advancing: 68,
                    declining: 32,
                    total: 100,
                    netAdvances: 36
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

    calculateMovingAverage(data, period) {
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
        
        const summationCtx = document.getElementById('summationChart').getContext('2d');
        this.charts.summation = new Chart(summationCtx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'McClellan Summation Index',
                        data: [],
                        borderColor: '#667eea',
                        borderWidth: 2,
                        fill: false
                    },
                    {
                        label: '10-Period MA',
                        data: [],
                        borderColor: '#ff9500',
                        borderWidth: 2,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        type: 'time',
                        time: { unit: 'day', displayFormats: { day: 'MMM dd' } }
                    },
                    y: { grid: { color: 'rgba(0,0,0,0.1)' } }
                }
            }
        });

        const oscillatorCtx = document.getElementById('oscillatorChart').getContext('2d');
        this.charts.oscillator = new Chart(oscillatorCtx, {
            type: 'bar',
            data: {
                datasets: [{
                    label: 'McClellan Oscillator',
                    data: [],
                    backgroundColor: [],
                    borderColor: []
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        type: 'time',
                        time: { unit: 'day', displayFormats: { day: 'MMM dd' } }
                    },
                    y: { grid: { color: 'rgba(0,0,0,0.1)' } }
                }
            }
        });

        const maCtx = document.getElementById('movingAveragesChart').getContext('2d');
        this.charts.movingAverages = new Chart(maCtx, {
            type: 'line',
            data: {
                datasets: [
                    { label: '5-day SMA', data: [], borderColor: '#ff1744', borderWidth: 2, fill: false },
                    { label: '10-day EMA', data: [], borderColor: '#9c27b0', borderWidth: 2, fill: false },
                    { label: '21-day EMA', data: [], borderColor: '#2196f3', borderWidth: 2, fill: false },
                    { label: '35-day SMA', data: [], borderColor: '#4caf50', borderWidth: 2, fill: false },
                    { label: '50-day SMA', data: [], borderColor: '#000000', borderWidth: 2, fill: false },
                    { label: '200-day SMA', data: [], borderColor: '#ffc107', borderWidth: 2, fill: false }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        type: 'time',
                        time: { unit: 'day', displayFormats: { day: 'MMM dd' } }
                    },
                    y: { min: 0, max: 100, grid: { color: 'rgba(0,0,0,0.1)' } }
                }
            }
        });
        
        console.log('Charts created');
    }

    updateDisplay() {
        const exchangeData = this.data[this.currentExchange];
        if (!exchangeData) return;
        
        document.getElementById('summation-value').textContent = exchangeData.summationIndex.current.toFixed(2);
        document.getElementById('oscillator-value').textContent = exchangeData.oscillator.current.toFixed(2);
        
        this.updateChangeIndicator('summation-change', exchangeData.summationIndex.change);
        this.updateChangeIndicator('oscillator-change', exchangeData.oscillator.change);
        
        document.getElementById('sma5-value').textContent = exchangeData.movingAverages.sma5.toFixed(1);
        document.getElementById('ema10-value').textContent = exchangeData.movingAverages.ema10.toFixed(1);
        document.getElementById('ma20-value').textContent = exchangeData.movingAverages.ema21.toFixed(1);
        document.getElementById('sma35-value').textContent = exchangeData.movingAverages.sma35.toFixed(1);
        document.getElementById('ma50-value').textContent = exchangeData.movingAverages.sma50.toFixed(1);
        document.getElementById('ma200-value').textContent = exchangeData.movingAverages.sma200.toFixed(1);
        
        document.getElementById('advancing-stocks').textContent = exchangeData.stats.advancing;
        document.getElementById('declining-stocks').textContent = exchangeData.stats.declining;
        document.getElementById('net-advances').textContent = exchangeData.stats.netAdvances > 0 ? `+${exchangeData.stats.netAdvances}` : exchangeData.stats.netAdvances;
        document.getElementById('total-stocks').textContent = exchangeData.stats.total;
        
        this.updateCharts(exchangeData);
    }

    updateChangeIndicator(elementId, change) {
        const element = document.getElementById(elementId);
        const isPositive = change > 0;
        element.textContent = `${isPositive ? '+' : ''}${change.toFixed(2)}`;
        element.className = `change-indicator ${isPositive ? 'positive' : 'negative'}`;
    }

    updateCharts(exchangeData) {
        const summationHistory = exchangeData.summationIndex.history;
        const summationMA = this.calculateMovingAverage(summationHistory, 10);
        
        this.charts.summation.data.datasets[0].data = summationHistory;
        this.charts.summation.data.datasets[1].data = summationMA;
        this.charts.summation.update('none');
        
        const oscillatorHistory = exchangeData.oscillator.history;
        const colors = oscillatorHistory.map(point => point.y >= 0 ? '#4caf50' : '#f44336');
        const borderColors = oscillatorHistory.map(point => point.y >= 0 ? '#388e3c' : '#d32f2f');
        
        this.charts.oscillator.data.datasets[0].data = oscillatorHistory;
        this.charts.oscillator.data.datasets[0].backgroundColor = colors;
        this.charts.oscillator.data.datasets[0].borderColor = borderColors;
        this.charts.oscillator.update('none');
        
        const maHistory = exchangeData.movingAverages.history;
        this.charts.movingAverages.data.datasets[0].data = maHistory.sma5;
        this.charts.movingAverages.data.datasets[1].data = maHistory.ema10;
        this.charts.movingAverages.data.datasets[2].data = maHistory.ema21;
        this.charts.movingAverages.data.datasets[3].data = maHistory.sma35;
        this.charts.movingAverages.data.datasets[4].data = maHistory.sma50;
        this.charts.movingAverages.data.datasets[5].data = maHistory.sma200;
        this.charts.movingAverages.update('none');
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
            const response = await fetch(`api/get-data.php?exchange=${this.currentExchange}`);
            if (response.ok) {
                const newData = await response.json();
                if (newData && !newData.error) {
                    this.data[this.currentExchange] = newData;
                    this.updateDisplay();
                }
            }
        } catch (error) {
            console.log('Error fetching data:', error.message);
        }
        this.updateLastUpdateTime();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new FinancialDashboard();
});