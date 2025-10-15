// Clean Financial Dashboard - Fixed Linting and Chart Issues
function FinancialDashboard() {
    this.currentExchange = 'FTSE';
    this.charts = {};
    this.data = {};
    this.init();
}

FinancialDashboard.prototype.init = function() {
    console.log('Initializing dashboard...');
    this.setupEventListeners();
    this.loadSampleData();
    this.createCharts();
    this.updateDisplay();
    this.updateLastUpdateTime();
    console.log('Dashboard initialized successfully');
};

FinancialDashboard.prototype.setupEventListeners = function() {
    var self = this;
    
    // Fixed: Don't create functions in loop
    function handleTabClick(e) {
        self.switchExchange(e.target.dataset.exchange);
    }
    
    var tabButtons = document.querySelectorAll('.tab-btn');
    for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].addEventListener('click', handleTabClick);
    }

    setInterval(function() {
        self.refreshData();
    }, 300000);
};

FinancialDashboard.prototype.switchExchange = function(exchange) {
    this.currentExchange = exchange;
    
    var tabButtons = document.querySelectorAll('.tab-btn');
    for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    document.querySelector('[data-exchange="' + exchange + '"]').classList.add('active');
    
    this.updateDisplay();
};

FinancialDashboard.prototype.loadSampleData = function() {
    this.data = {
        FTSE: {
            summationIndex: { current: 395.42, change: 12.8 },
            oscillator: { current: -15.23, change: -3.2 },
            movingAverages: { sma5: 78.5, ema10: 72.3, ema21: 68.1, sma35: 65.2, sma50: 60.8, sma200: 52.8 },
            stats: { advancing: 68, declining: 32, total: 100, netAdvances: 36 }
        },
        TSX: {
            summationIndex: { current: 287.15, change: -8.4 },
            oscillator: { current: 8.67, change: 2.1 },
            movingAverages: { sma5: 72.3, ema10: 68.1, ema21: 63.4, sma35: 58.9, sma50: 54.2, sma200: 45.6 },
            stats: { advancing: 145, declining: 95, total: 240, netAdvances: 50 }
        },
        HSI: {
            summationIndex: { current: 156.89, change: 5.2 },
            oscillator: { current: 12.45, change: 1.8 },
            movingAverages: { sma5: 68.9, ema10: 64.5, ema21: 59.8, sma35: 54.2, sma50: 48.7, sma200: 41.7 },
            stats: { advancing: 56, declining: 26, total: 82, netAdvances: 30 }
        },
        KLCI: {
            summationIndex: { current: 89.34, change: -2.1 },
            oscillator: { current: -5.67, change: -1.2 },
            movingAverages: { sma5: 63.3, ema10: 58.9, ema21: 54.2, sma35: 50.0, sma50: 45.1, sma200: 36.7 },
            stats: { advancing: 19, declining: 11, total: 30, netAdvances: 8 }
        },
        N225: {
            summationIndex: { current: 234.67, change: 15.3 },
            oscillator: { current: 18.92, change: 4.5 },
            movingAverages: { sma5: 81.2, ema10: 76.8, ema21: 72.4, sma35: 69.8, sma50: 64.3, sma200: 58.4 },
            stats: { advancing: 182, declining: 43, total: 225, netAdvances: 139 }
        }
    };
};

FinancialDashboard.prototype.createCharts = function() {
    console.log('Creating charts with Chart.js version:', Chart.version);
    
    try {
        // McClellan Summation Index Chart
        var summationCtx = document.getElementById('summationChart').getContext('2d');
        console.log('Creating summation chart...');
        
        this.charts.summation = new Chart(summationCtx, {
            type: 'line',
            data: {
                labels: ['Jan 15', 'Jan 16', 'Jan 17', 'Jan 18', 'Jan 19', 'Jan 20', 'Jan 21'],
                datasets: [{
                    label: 'McClellan Summation Index',
                    data: [300, 320, 350, 380, 395, 390, 395],
                    borderColor: '#667eea',
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 2
                }, {
                    label: '10-Period MA',
                    data: [310, 325, 345, 370, 385, 388, 390],
                    borderColor: '#ff9500',
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
        console.log('Summation chart created successfully');

        // McClellan Oscillator Chart
        var oscillatorCtx = document.getElementById('oscillatorChart').getContext('2d');
        console.log('Creating oscillator chart...');
        
        this.charts.oscillator = new Chart(oscillatorCtx, {
            type: 'bar',
            data: {
                labels: ['Jan 15', 'Jan 16', 'Jan 17', 'Jan 18', 'Jan 19', 'Jan 20', 'Jan 21'],
                datasets: [{
                    label: 'McClellan Oscillator',
                    data: [10, -5, 15, -8, -15, -12, -15],
                    backgroundColor: ['#4caf50', '#f44336', '#4caf50', '#f44336', '#f44336', '#f44336', '#f44336'],
                    borderColor: ['#388e3c', '#d32f2f', '#388e3c', '#d32f2f', '#d32f2f', '#d32f2f', '#d32f2f'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        console.log('Oscillator chart created successfully');

        // Moving Averages Chart
        var maCtx = document.getElementById('movingAveragesChart').getContext('2d');
        console.log('Creating MA chart...');
        
        this.charts.movingAverages = new Chart(maCtx, {
            type: 'line',
            data: {
                labels: ['Jan 15', 'Jan 16', 'Jan 17', 'Jan 18', 'Jan 19', 'Jan 20', 'Jan 21'],
                datasets: [
                    { label: '5-day SMA', data: [75, 76, 78, 79, 78, 77, 78], borderColor: '#ff1744', borderWidth: 2, fill: false, pointRadius: 1 },
                    { label: '10-day EMA', data: [70, 71, 72, 73, 72, 71, 72], borderColor: '#9c27b0', borderWidth: 2, fill: false, pointRadius: 1 },
                    { label: '21-day EMA', data: [65, 66, 67, 68, 68, 67, 68], borderColor: '#2196f3', borderWidth: 2, fill: false, pointRadius: 1 },
                    { label: '35-day SMA', data: [60, 61, 63, 64, 65, 64, 65], borderColor: '#4caf50', borderWidth: 2, fill: false, pointRadius: 1 },
                    { label: '50-day SMA', data: [55, 57, 59, 60, 61, 60, 61], borderColor: '#000000', borderWidth: 2, fill: false, pointRadius: 1 },
                    { label: '200-day SMA', data: [45, 47, 49, 51, 53, 52, 53], borderColor: '#ffc107', borderWidth: 2, fill: false, pointRadius: 1 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 100
                    }
                }
            }
        });
        console.log('MA chart created successfully');
        
        console.log('All charts created successfully');
        
    } catch (error) {
        console.error('Error creating charts:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
    }
};

FinancialDashboard.prototype.updateDisplay = function() {
    var exchangeData = this.data[this.currentExchange];
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
    document.getElementById('net-advances').textContent = exchangeData.stats.netAdvances > 0 ? '+' + exchangeData.stats.netAdvances : exchangeData.stats.netAdvances;
    document.getElementById('total-stocks').textContent = exchangeData.stats.total;
};

FinancialDashboard.prototype.updateChangeIndicator = function(elementId, change) {
    var element = document.getElementById(elementId);
    var isPositive = change > 0;
    element.textContent = (isPositive ? '+' : '') + change.toFixed(2);
    element.className = 'change-indicator ' + (isPositive ? 'positive' : 'negative');
};

FinancialDashboard.prototype.updateLastUpdateTime = function() {
    var now = new Date();
    var timeString = now.toLocaleString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('lastUpdate').textContent = timeString;
};

FinancialDashboard.prototype.refreshData = function() {
    console.log('Refreshing data for exchange:', this.currentExchange);
    this.updateLastUpdateTime();
};

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing dashboard...');
    window.dashboard = new FinancialDashboard();
    console.log('Dashboard object created:', typeof window.dashboard);
});