// Debug Financial Dashboard JavaScript
console.log('Dashboard script loading...');

function FinancialDashboard() {
    console.log('FinancialDashboard constructor called');
    try {
        this.currentExchange = 'FTSE';
        this.charts = {};
        this.data = {};
        console.log('Dashboard properties initialized');
        this.init();
    } catch (error) {
        console.error('Error in constructor:', error);
    }
}

FinancialDashboard.prototype.init = function() {
    console.log('Dashboard init() called');
    try {
        this.setupEventListeners();
        console.log('Event listeners set up');
        
        this.loadSampleData();
        console.log('Sample data loaded');
        
        this.createCharts();
        console.log('Charts created');
        
        this.updateDisplay();
        console.log('Display updated');
        
        this.updateLastUpdateTime();
        console.log('Last update time set');
    } catch (error) {
        console.error('Error in init():', error);
    }
};

FinancialDashboard.prototype.setupEventListeners = function() {
    console.log('Setting up event listeners...');
    var self = this;
    
    try {
        var tabButtons = document.querySelectorAll('.tab-btn');
        console.log('Found', tabButtons.length, 'tab buttons');
        
        for (var i = 0; i < tabButtons.length; i++) {
            tabButtons[i].addEventListener('click', function(e) {
                self.switchExchange(e.target.dataset.exchange);
            });
        }

        setInterval(function() {
            self.refreshData();
        }, 300000);
        
        console.log('Event listeners set up successfully');
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
};

FinancialDashboard.prototype.switchExchange = function(exchange) {
    console.log('Switching to exchange:', exchange);
    this.currentExchange = exchange;
    
    var tabButtons = document.querySelectorAll('.tab-btn');
    for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    document.querySelector('[data-exchange="' + exchange + '"]').classList.add('active');
    
    this.updateDisplay();
};

FinancialDashboard.prototype.loadSampleData = function() {
    console.log('Loading sample data...');
    try {
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
        console.log('Sample data loaded successfully');
    } catch (error) {
        console.error('Error loading sample data:', error);
    }
};

FinancialDashboard.prototype.generateSampleData = function(points, min, max) {
    var data = [];
    var value = (min + max) / 2;
    
    for (var i = 0; i < points; i++) {
        var change = (Math.random() - 0.5) * 20;
        value += change;
        value = Math.max(min, Math.min(max, value));
        
        var date = new Date();
        date.setDate(date.getDate() - (points - i));
        
        data.push({
            x: date.getTime(),
            y: parseFloat(value.toFixed(2))
        });
    }
    
    return data;
};

FinancialDashboard.prototype.generateOscillatorData = function(points) {
    var data = [];
    var value = 0;
    
    for (var i = 0; i < points; i++) {
        var change = (Math.random() - 0.5) * 10;
        value += change;
        value = Math.max(-50, Math.min(50, value));
        
        var date = new Date();
        date.setDate(date.getDate() - (points - i));
        
        data.push({
            x: date.getTime(),
            y: parseFloat(value.toFixed(2))
        });
    }
    
    return data;
};

FinancialDashboard.prototype.generateMAData = function(points) {
    var sma5Data = [];
    var ema10Data = [];
    var ema21Data = [];
    var sma35Data = [];
    var sma50Data = [];
    var sma200Data = [];
    
    var sma5 = 75;
    var ema10 = 70;
    var ema21 = 65;
    var sma35 = 60;
    var sma50 = 55;
    var sma200 = 45;
    
    for (var i = 0; i < points; i++) {
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
        
        var date = new Date();
        date.setDate(date.getDate() - (points - i));
        var timestamp = date.getTime();
        
        sma5Data.push({ x: timestamp, y: parseFloat(sma5.toFixed(1)) });
        ema10Data.push({ x: timestamp, y: parseFloat(ema10.toFixed(1)) });
        ema21Data.push({ x: timestamp, y: parseFloat(ema21.toFixed(1)) });
        sma35Data.push({ x: timestamp, y: parseFloat(sma35.toFixed(1)) });
        sma50Data.push({ x: timestamp, y: parseFloat(sma50.toFixed(1)) });
        sma200Data.push({ x: timestamp, y: parseFloat(sma200.toFixed(1)) });
    }
    
    return { 
        sma5: sma5Data, 
        ema10: ema10Data, 
        ema21: ema21Data, 
        sma35: sma35Data, 
        sma50: sma50Data, 
        sma200: sma200Data 
    };
};

FinancialDashboard.prototype.createCharts = function() {
    console.log('Creating charts...');
    
    try {
        // Check if Chart.js is available
        if (typeof Chart === 'undefined') {
            console.error('Chart.js is not available!');
            return;
        }
        
        // Check if canvas elements exist
        var summationCanvas = document.getElementById('summationChart');
        var oscillatorCanvas = document.getElementById('oscillatorChart');
        var maCanvas = document.getElementById('movingAveragesChart');
        
        if (!summationCanvas) {
            console.error('summationChart canvas not found!');
            return;
        }
        if (!oscillatorCanvas) {
            console.error('oscillatorChart canvas not found!');
            return;
        }
        if (!maCanvas) {
            console.error('movingAveragesChart canvas not found!');
            return;
        }
        
        console.log('All canvas elements found');
        
        // Create simple charts without time axis to avoid errors
        var summationCtx = summationCanvas.getContext('2d');
        this.charts.summation = new Chart(summationCtx, {
            type: 'line',
            data: {
                labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
                datasets: [
                    {
                        label: 'McClellan Summation Index',
                        data: [300, 320, 350, 380, 395],
                        borderColor: '#667eea',
                        borderWidth: 2,
                        fill: false
                    },
                    {
                        label: '10-Period MA',
                        data: [310, 325, 345, 370, 385],
                        borderColor: '#ff9500',
                        borderWidth: 2,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
        console.log('Summation chart created');

        var oscillatorCtx = oscillatorCanvas.getContext('2d');
        this.charts.oscillator = new Chart(oscillatorCtx, {
            type: 'bar',
            data: {
                labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
                datasets: [{
                    label: 'McClellan Oscillator',
                    data: [10, -5, 15, -8, -15],
                    backgroundColor: ['#4caf50', '#f44336', '#4caf50', '#f44336', '#f44336']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
        console.log('Oscillator chart created');

        var maCtx = maCanvas.getContext('2d');
        this.charts.movingAverages = new Chart(maCtx, {
            type: 'line',
            data: {
                labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
                datasets: [
                    { label: '5-day SMA', data: [75, 76, 78, 79, 78], borderColor: '#ff1744', borderWidth: 2, fill: false },
                    { label: '10-day EMA', data: [70, 71, 72, 73, 72], borderColor: '#9c27b0', borderWidth: 2, fill: false },
                    { label: '21-day EMA', data: [65, 66, 67, 68, 68], borderColor: '#2196f3', borderWidth: 2, fill: false },
                    { label: '35-day SMA', data: [60, 61, 63, 64, 65], borderColor: '#4caf50', borderWidth: 2, fill: false },
                    { label: '50-day SMA', data: [55, 57, 59, 60, 61], borderColor: '#000000', borderWidth: 2, fill: false },
                    { label: '200-day SMA', data: [45, 47, 49, 51, 53], borderColor: '#ffc107', borderWidth: 2, fill: false }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { min: 0, max: 100 }
                }
            }
        });
        console.log('Moving averages chart created');
        
        console.log('All charts created successfully');
        
    } catch (error) {
        console.error('Error creating charts:', error);
    }
};

FinancialDashboard.prototype.updateDisplay = function() {
    console.log('Updating display...');
    try {
        var exchangeData = this.data[this.currentExchange];
        if (!exchangeData) {
            console.error('No data for exchange:', this.currentExchange);
            return;
        }
        
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
        
        console.log('Display updated successfully');
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

FinancialDashboard.prototype.updateLastUpdateTime = function() {
    try {
        var now = new Date();
        var timeString = now.toLocaleString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        });
        document.getElementById('lastUpdate').textContent = timeString;
        console.log('Last update time set to:', timeString);
    } catch (error) {
        console.error('Error updating last update time:', error);
    }
};

FinancialDashboard.prototype.refreshData = function() {
    console.log('Refreshing data for exchange:', this.currentExchange);
    this.updateLastUpdateTime();
};

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, creating dashboard...');
    try {
        window.dashboard = new FinancialDashboard();
        console.log('Dashboard created successfully:', window.dashboard);
    } catch (error) {
        console.error('Error creating dashboard:', error);
    }
});