// Financial Dashboard - Chart.js v2 Compatible
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
            summationIndex: { current: 395.42, change: 12.8, history: [300, 320, 350, 380, 395, 390, 395], ma10: [310, 325, 345, 370, 385, 388, 390] },
            oscillator: { current: -15.23, change: -3.2, history: [10, -5, 15, -8, -15, -12, -15] },
            movingAverages: { 
                sma5: 78.5, ema10: 72.3, ema21: 68.1, sma35: 65.2, sma50: 60.8, sma200: 52.8,
                history: {
                    sma5: [75, 76, 78, 79, 78, 77, 78],
                    ema10: [70, 71, 72, 73, 72, 71, 72],
                    ema21: [65, 66, 67, 68, 68, 67, 68],
                    sma35: [60, 61, 63, 64, 65, 64, 65],
                    sma50: [55, 57, 59, 60, 61, 60, 61],
                    sma200: [45, 47, 49, 51, 53, 52, 53]
                }
            },
            stats: { advancing: 68, declining: 32, total: 100, netAdvances: 36 }
        },
        TSX: {
            summationIndex: { current: 287.15, change: -8.4, history: [200, 220, 250, 280, 287, 285, 287], ma10: [210, 225, 245, 275, 285, 286, 285] },
            oscillator: { current: 8.67, change: 2.1, history: [5, -3, 8, -6, 10, 8, 9] },
            movingAverages: { 
                sma5: 72.3, ema10: 68.1, ema21: 63.4, sma35: 58.9, sma50: 54.2, sma200: 45.6,
                history: {
                    sma5: [70, 71, 72, 73, 72, 71, 72],
                    ema10: [65, 66, 67, 68, 68, 67, 68],
                    ema21: [60, 61, 62, 63, 63, 62, 63],
                    sma35: [55, 56, 58, 59, 59, 58, 59],
                    sma50: [50, 52, 54, 55, 54, 53, 54],
                    sma200: [40, 42, 44, 46, 45, 44, 46]
                }
            },
            stats: { advancing: 145, declining: 95, total: 240, netAdvances: 50 }
        },
        HSI: {
            summationIndex: { current: 156.89, change: 5.2, history: [100, 120, 140, 160, 157, 155, 157], ma10: [110, 125, 135, 155, 155, 156, 155] },
            oscillator: { current: 12.45, change: 1.8, history: [8, -2, 12, -4, 15, 12, 12] },
            movingAverages: { 
                sma5: 68.9, ema10: 64.5, ema21: 59.8, sma35: 54.2, sma50: 48.7, sma200: 41.7,
                history: {
                    sma5: [66, 67, 68, 69, 69, 68, 69],
                    ema10: [61, 62, 63, 64, 64, 63, 64],
                    ema21: [56, 57, 58, 59, 60, 59, 60],
                    sma35: [51, 52, 53, 54, 54, 53, 54],
                    sma50: [46, 47, 48, 49, 49, 48, 49],
                    sma200: [38, 39, 40, 41, 42, 41, 42]
                }
            },
            stats: { advancing: 56, declining: 26, total: 82, netAdvances: 30 }
        },
        KLCI: {
            summationIndex: { current: 89.34, change: -2.1, history: [50, 70, 80, 90, 89, 88, 89], ma10: [60, 75, 85, 88, 88, 88, 88] },
            oscillator: { current: -5.67, change: -1.2, history: [3, -1, 6, -3, -6, -5, -6] },
            movingAverages: { 
                sma5: 63.3, ema10: 58.9, ema21: 54.2, sma35: 50.0, sma50: 45.1, sma200: 36.7,
                history: {
                    sma5: [61, 62, 63, 64, 63, 62, 63],
                    ema10: [56, 57, 58, 59, 59, 58, 59],
                    ema21: [51, 52, 53, 54, 54, 53, 54],
                    sma35: [46, 47, 48, 49, 50, 49, 50],
                    sma50: [41, 42, 43, 44, 45, 44, 45],
                    sma200: [33, 34, 35, 36, 37, 36, 37]
                }
            },
            stats: { advancing: 19, declining: 11, total: 30, netAdvances: 8 }
        },
        N225: {
            summationIndex: { current: 234.67, change: 15.3, history: [150, 180, 200, 230, 235, 233, 235], ma10: [165, 185, 205, 225, 233, 234, 233] },
            oscillator: { current: 18.92, change: 4.5, history: [12, -3, 18, -6, 22, 19, 19] },
            movingAverages: { 
                sma5: 81.2, ema10: 76.8, ema21: 72.4, sma35: 69.8, sma50: 64.3, sma200: 58.4,
                history: {
                    sma5: [79, 80, 81, 82, 81, 80, 81],
                    ema10: [74, 75, 76, 77, 77, 76, 77],
                    ema21: [69, 70, 71, 72, 72, 71, 72],
                    sma35: [66, 67, 68, 69, 70, 69, 70],
                    sma50: [61, 62, 63, 64, 64, 63, 64],
                    sma200: [55, 56, 57, 58, 58, 57, 58]
                }
            },
            stats: { advancing: 182, declining: 43, total: 225, netAdvances: 139 }
        }
    };
};

FinancialDashboard.prototype.createCharts = function() {
    console.log('Creating charts with Chart.js version:', Chart.version);
    
    try {
        var labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
        
        // McClellan Summation Index Chart - Chart.js v2 syntax
        var summationCtx = document.getElementById('summationChart').getContext('2d');
        console.log('Creating summation chart...');
        
        this.charts.summation = new Chart(summationCtx, {
            type: 'line',
            data: {
                labels: labels,
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
                legend: { display: false },
                scales: {
                    yAxes: [{
                        ticks: { beginAtZero: false }
                    }]
                }
            }
        });
        console.log('Summation chart created successfully');

        // McClellan Oscillator Chart - Chart.js v2 syntax
        var oscillatorCtx = document.getElementById('oscillatorChart').getContext('2d');
        console.log('Creating oscillator chart...');
        
        this.charts.oscillator = new Chart(oscillatorCtx, {
            type: 'bar',
            data: {
                labels: labels,
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
                legend: { display: false },
                scales: {
                    yAxes: [{
                        ticks: { beginAtZero: true }
                    }]
                }
            }
        });
        console.log('Oscillator chart created successfully');

        // Moving Averages Chart - Chart.js v2 syntax with OB/OS lines
        var maCtx = document.getElementById('movingAveragesChart').getContext('2d');
        console.log('Creating MA chart...');
        
        this.charts.movingAverages = new Chart(maCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    { label: '5-day SMA', data: [75, 76, 78, 79, 78, 77, 78], borderColor: '#ff1744', borderWidth: 2, fill: false, pointRadius: 1 },
                    { label: '10-day EMA', data: [70, 71, 72, 73, 72, 71, 72], borderColor: '#9c27b0', borderWidth: 2, fill: false, pointRadius: 1 },
                    { label: '21-day EMA', data: [65, 66, 67, 68, 68, 67, 68], borderColor: '#2196f3', borderWidth: 2, fill: false, pointRadius: 1 },
                    { label: '35-day SMA', data: [60, 61, 63, 64, 65, 64, 65], borderColor: '#4caf50', borderWidth: 2, fill: false, pointRadius: 1 },
                    { label: '50-day SMA', data: [55, 57, 59, 60, 61, 60, 61], borderColor: '#000000', borderWidth: 2, fill: false, pointRadius: 1 },
                    { label: '200-day SMA', data: [45, 47, 49, 51, 53, 52, 53], borderColor: '#ffc107', borderWidth: 2, fill: false, pointRadius: 1 },
                    { label: 'Overbought (75%)', data: [75, 75, 75, 75, 75, 75, 75], borderColor: '#ff0000', borderWidth: 2, fill: false, pointRadius: 0, borderDash: [5, 5] },
                    { label: 'Oversold (25%)', data: [25, 25, 25, 25, 25, 25, 25], borderColor: '#00ff00', borderWidth: 2, fill: false, pointRadius: 0, borderDash: [5, 5] }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: { display: false },
                scales: {
                    yAxes: [{
                        ticks: { min: 0, max: 100 }
                    }]
                }
            }
        });
        console.log('MA chart created successfully');
        
        console.log('All charts created successfully');
        
    } catch (error) {
        console.error('Error creating charts:', error);
        console.error('Error message:', error.message);
    }
};

FinancialDashboard.prototype.updateDisplay = function() {
    var exchangeData = this.data[this.currentExchange];
    if (!exchangeData) {
        console.error('No data for exchange:', this.currentExchange);
        return;
    }
    
    // Safely update values with error checking
    try {
        document.getElementById('summation-value').textContent = (exchangeData.summationIndex && exchangeData.summationIndex.current !== undefined) ? exchangeData.summationIndex.current.toFixed(2) : '--';
        document.getElementById('oscillator-value').textContent = (exchangeData.oscillator && exchangeData.oscillator.current !== undefined) ? exchangeData.oscillator.current.toFixed(2) : '--';
        
        this.updateChangeIndicator('summation-change', exchangeData.summationIndex ? exchangeData.summationIndex.change : 0);
        this.updateChangeIndicator('oscillator-change', exchangeData.oscillator ? exchangeData.oscillator.change : 0);
        
        document.getElementById('sma5-value').textContent = (exchangeData.movingAverages && exchangeData.movingAverages.sma5 !== undefined) ? exchangeData.movingAverages.sma5.toFixed(1) : '--';
        document.getElementById('ema10-value').textContent = (exchangeData.movingAverages && exchangeData.movingAverages.ema10 !== undefined) ? exchangeData.movingAverages.ema10.toFixed(1) : '--';
        document.getElementById('ma20-value').textContent = (exchangeData.movingAverages && exchangeData.movingAverages.ema21 !== undefined) ? exchangeData.movingAverages.ema21.toFixed(1) : '--';
        document.getElementById('sma35-value').textContent = (exchangeData.movingAverages && exchangeData.movingAverages.sma35 !== undefined) ? exchangeData.movingAverages.sma35.toFixed(1) : '--';
        document.getElementById('ma50-value').textContent = (exchangeData.movingAverages && exchangeData.movingAverages.sma50 !== undefined) ? exchangeData.movingAverages.sma50.toFixed(1) : '--';
        document.getElementById('ma200-value').textContent = (exchangeData.movingAverages && exchangeData.movingAverages.sma200 !== undefined) ? exchangeData.movingAverages.sma200.toFixed(1) : '--';
        
        document.getElementById('advancing-stocks').textContent = (exchangeData.stats && exchangeData.stats.advancing !== undefined) ? exchangeData.stats.advancing : '--';
        document.getElementById('declining-stocks').textContent = (exchangeData.stats && exchangeData.stats.declining !== undefined) ? exchangeData.stats.declining : '--';
        document.getElementById('net-advances').textContent = (exchangeData.stats && exchangeData.stats.netAdvances !== undefined) ? (exchangeData.stats.netAdvances > 0 ? '+' + exchangeData.stats.netAdvances : exchangeData.stats.netAdvances) : '--';
        document.getElementById('total-stocks').textContent = (exchangeData.stats && exchangeData.stats.total !== undefined) ? exchangeData.stats.total : '--';
        
        this.updateCharts(exchangeData);
    } catch (error) {
        console.error('Error updating display:', error);
    }
};

FinancialDashboard.prototype.updateChangeIndicator = function(elementId, change) {
    var element = document.getElementById(elementId);
    var isPositive = change > 0;
    element.textContent = (isPositive ? '+' : '') + change.toFixed(2);
    element.className = 'change-indicator ' + (isPositive ? 'positive' : 'negative');
};

FinancialDashboard.prototype.updateCharts = function(exchangeData) {
    // Update Summation Index chart
    this.charts.summation.data.datasets[0].data = exchangeData.summationIndex.history;
    this.charts.summation.data.datasets[1].data = exchangeData.summationIndex.ma10;
    this.charts.summation.update();
    
    // Update Oscillator chart with colored bars
    var colors = [];
    var borderColors = [];
    for (var i = 0; i < exchangeData.oscillator.history.length; i++) {
        if (exchangeData.oscillator.history[i] >= 0) {
            colors.push('#4caf50');
            borderColors.push('#388e3c');
        } else {
            colors.push('#f44336');
            borderColors.push('#d32f2f');
        }
    }
    
    this.charts.oscillator.data.datasets[0].data = exchangeData.oscillator.history;
    this.charts.oscillator.data.datasets[0].backgroundColor = colors;
    this.charts.oscillator.data.datasets[0].borderColor = borderColors;
    this.charts.oscillator.update();
    
    // Update Moving Averages chart
    if (exchangeData.movingAverages && exchangeData.movingAverages.history) {
        this.charts.movingAverages.data.datasets[0].data = exchangeData.movingAverages.history.sma5;
        this.charts.movingAverages.data.datasets[1].data = exchangeData.movingAverages.history.ema10;
        this.charts.movingAverages.data.datasets[2].data = exchangeData.movingAverages.history.ema21;
        this.charts.movingAverages.data.datasets[3].data = exchangeData.movingAverages.history.sma35;
        this.charts.movingAverages.data.datasets[4].data = exchangeData.movingAverages.history.sma50;
        this.charts.movingAverages.data.datasets[5].data = exchangeData.movingAverages.history.sma200;
        
        // Keep the overbought/oversold lines constant
        var labels = this.charts.movingAverages.data.labels;
        var obData = [];
        var osData = [];
        for (var i = 0; i < labels.length; i++) {
            obData.push(75);
            osData.push(25);
        }
        this.charts.movingAverages.data.datasets[6].data = obData; // Overbought line
        this.charts.movingAverages.data.datasets[7].data = osData; // Oversold line
    }
    this.charts.movingAverages.update();
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