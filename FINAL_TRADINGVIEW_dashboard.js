// Financial Dashboard - TradingView Lightweight Charts
function FinancialDashboard() {
    this.currentExchange = 'FTSE';
    this.charts = {};
    this.data = {};
    this.init();
}

FinancialDashboard.prototype.init = function() {
    console.log('Initializing TradingView dashboard...');
    
    // Check if TradingView library is loaded
    if (typeof LightweightCharts === 'undefined') {
        console.error('TradingView Lightweight Charts library not loaded!');
        return;
    }
    
    console.log('TradingView library loaded successfully');
    
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
    // Generate realistic time series data starting from 100 days ago
    var now = new Date();
    var baseTime = Math.floor(now.getTime() / 1000) - (100 * 24 * 60 * 60); // 100 days ago in Unix timestamp
    var dayInSeconds = 24 * 60 * 60;
    
    this.data = {
        FTSE: {
            summationIndex: { 
                current: 395.42, 
                change: 12.8,
                history: this.generateTimeSeriesData(baseTime, dayInSeconds, 100, 300, 500),
                ma10: this.generateTimeSeriesData(baseTime, dayInSeconds, 100, 320, 480)
            },
            oscillator: { 
                current: -15.23, 
                change: -3.2,
                history: this.generateOscillatorTimeSeriesData(baseTime, dayInSeconds, 100)
            },
            movingAverages: { 
                sma5: 78.5, ema10: 72.3, ema21: 68.1, sma35: 65.2, sma50: 60.8, sma200: 52.8,
                history: this.generateMATimeSeriesData(baseTime, dayInSeconds, 100)
            },
            stats: { advancing: 68, declining: 32, total: 100, netAdvances: 36 }
        },
        TSX: {
            summationIndex: { 
                current: 287.15, 
                change: -8.4,
                history: this.generateTimeSeriesData(baseTime, dayInSeconds, 100, 200, 400),
                ma10: this.generateTimeSeriesData(baseTime, dayInSeconds, 100, 220, 380)
            },
            oscillator: { 
                current: 8.67, 
                change: 2.1,
                history: this.generateOscillatorTimeSeriesData(baseTime, dayInSeconds, 100)
            },
            movingAverages: { 
                sma5: 72.3, ema10: 68.1, ema21: 63.4, sma35: 58.9, sma50: 54.2, sma200: 45.6,
                history: this.generateMATimeSeriesData(baseTime, dayInSeconds, 100)
            },
            stats: { advancing: 145, declining: 95, total: 240, netAdvances: 50 }
        },
        HSI: {
            summationIndex: { 
                current: 156.89, 
                change: 5.2,
                history: this.generateTimeSeriesData(baseTime, dayInSeconds, 100, 100, 300),
                ma10: this.generateTimeSeriesData(baseTime, dayInSeconds, 100, 120, 280)
            },
            oscillator: { 
                current: 12.45, 
                change: 1.8,
                history: this.generateOscillatorTimeSeriesData(baseTime, dayInSeconds, 100)
            },
            movingAverages: { 
                sma5: 68.9, ema10: 64.5, ema21: 59.8, sma35: 54.2, sma50: 48.7, sma200: 41.7,
                history: this.generateMATimeSeriesData(baseTime, dayInSeconds, 100)
            },
            stats: { advancing: 56, declining: 26, total: 82, netAdvances: 30 }
        },
        KLCI: {
            summationIndex: { 
                current: 89.34, 
                change: -2.1,
                history: this.generateTimeSeriesData(baseTime, dayInSeconds, 100, 50, 150),
                ma10: this.generateTimeSeriesData(baseTime, dayInSeconds, 100, 60, 140)
            },
            oscillator: { 
                current: -5.67, 
                change: -1.2,
                history: this.generateOscillatorTimeSeriesData(baseTime, dayInSeconds, 100)
            },
            movingAverages: { 
                sma5: 63.3, ema10: 58.9, ema21: 54.2, sma35: 50.0, sma50: 45.1, sma200: 36.7,
                history: this.generateMATimeSeriesData(baseTime, dayInSeconds, 100)
            },
            stats: { advancing: 19, declining: 11, total: 30, netAdvances: 8 }
        },
        N225: {
            summationIndex: { 
                current: 234.67, 
                change: 15.3,
                history: this.generateTimeSeriesData(baseTime, dayInSeconds, 100, 150, 350),
                ma10: this.generateTimeSeriesData(baseTime, dayInSeconds, 100, 170, 330)
            },
            oscillator: { 
                current: 18.92, 
                change: 4.5,
                history: this.generateOscillatorTimeSeriesData(baseTime, dayInSeconds, 100)
            },
            movingAverages: { 
                sma5: 81.2, ema10: 76.8, ema21: 72.4, sma35: 69.8, sma50: 64.3, sma200: 58.4,
                history: this.generateMATimeSeriesData(baseTime, dayInSeconds, 100)
            },
            stats: { advancing: 182, declining: 43, total: 225, netAdvances: 139 }
        }
    };
};

FinancialDashboard.prototype.generateTimeSeriesData = function(baseTime, dayInSeconds, points, min, max) {
    var data = [];
    var value = (min + max) / 2;
    
    for (var i = 0; i < points; i++) {
        var change = (Math.random() - 0.5) * 20;
        value += change;
        value = Math.max(min, Math.min(max, value));
        
        data.push({
            time: baseTime + (i * dayInSeconds),
            value: parseFloat(value.toFixed(2))
        });
    }
    
    return data;
};

FinancialDashboard.prototype.generateOscillatorTimeSeriesData = function(baseTime, dayInSeconds, points) {
    var data = [];
    var value = 0;
    
    for (var i = 0; i < points; i++) {
        var change = (Math.random() - 0.5) * 10;
        value += change;
        value = Math.max(-50, Math.min(50, value));
        
        data.push({
            time: baseTime + (i * dayInSeconds),
            value: parseFloat(value.toFixed(2))
        });
    }
    
    return data;
};

FinancialDashboard.prototype.generateMATimeSeriesData = function(baseTime, dayInSeconds, points) {
    var sma5 = 75, ema10 = 70, ema21 = 65, sma35 = 60, sma50 = 55, sma200 = 45;
    
    var result = {
        sma5: [], ema10: [], ema21: [], sma35: [], sma50: [], sma200: []
    };
    
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
        
        var time = baseTime + (i * dayInSeconds);
        
        result.sma5.push({ time: time, value: parseFloat(sma5.toFixed(1)) });
        result.ema10.push({ time: time, value: parseFloat(ema10.toFixed(1)) });
        result.ema21.push({ time: time, value: parseFloat(ema21.toFixed(1)) });
        result.sma35.push({ time: time, value: parseFloat(sma35.toFixed(1)) });
        result.sma50.push({ time: time, value: parseFloat(sma50.toFixed(1)) });
        result.sma200.push({ time: time, value: parseFloat(sma200.toFixed(1)) });
    }
    
    return result;
};

FinancialDashboard.prototype.createCharts = function() {
    console.log('Creating TradingView charts...');
    
    try {
        // McClellan Summation Index Chart
        var summationContainer = document.getElementById('summationChart');
        if (!summationContainer) {
            console.error('Summation chart container not found!');
            return;
        }
        
        this.charts.summation = LightweightCharts.createChart(summationContainer, {
            width: summationContainer.clientWidth,
            height: 300,
            layout: {
                backgroundColor: '#ffffff',
                textColor: '#333'
            },
            grid: {
                vertLines: { color: '#f0f0f0' },
                horzLines: { color: '#f0f0f0' }
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false
            },
            rightPriceScale: {
                borderColor: '#cccccc'
            }
        });
        
        this.charts.summationLine = this.charts.summation.addLineSeries({
            color: '#667eea',
            lineWidth: 2
        });
        
        this.charts.summationMA = this.charts.summation.addLineSeries({
            color: '#ff9500',
            lineWidth: 2
        });
        
        console.log('Summation chart created');

        // McClellan Oscillator Chart (as histogram)
        var oscillatorContainer = document.getElementById('oscillatorChart');
        if (!oscillatorContainer) {
            console.error('Oscillator chart container not found!');
            return;
        }
        
        this.charts.oscillator = LightweightCharts.createChart(oscillatorContainer, {
            width: oscillatorContainer.clientWidth,
            height: 300,
            layout: {
                backgroundColor: '#ffffff',
                textColor: '#333'
            },
            grid: {
                vertLines: { color: '#f0f0f0' },
                horzLines: { color: '#f0f0f0' }
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false
            },
            rightPriceScale: {
                borderColor: '#cccccc'
            }
        });
        
        this.charts.oscillatorHist = this.charts.oscillator.addHistogramSeries({
            color: '#4caf50'
        });
        
        // Add zero line
        this.charts.oscillatorZero = this.charts.oscillator.addLineSeries({
            color: '#333333',
            lineWidth: 1,
            lineStyle: LightweightCharts.LineStyle.Dashed
        });
        
        console.log('Oscillator chart created');

        // Moving Averages Chart
        var maContainer = document.getElementById('movingAveragesChart');
        if (!maContainer) {
            console.error('MA chart container not found!');
            return;
        }
        
        this.charts.movingAverages = LightweightCharts.createChart(maContainer, {
            width: maContainer.clientWidth,
            height: 300,
            layout: {
                backgroundColor: '#ffffff',
                textColor: '#333'
            },
            grid: {
                vertLines: { color: '#f0f0f0' },
                horzLines: { color: '#f0f0f0' }
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false
            },
            rightPriceScale: {
                borderColor: '#cccccc'
            }
        });
        
        // Add moving average lines
        this.charts.sma5Line = this.charts.movingAverages.addLineSeries({ color: '#ff1744', lineWidth: 2 });
        this.charts.ema10Line = this.charts.movingAverages.addLineSeries({ color: '#9c27b0', lineWidth: 2 });
        this.charts.ema21Line = this.charts.movingAverages.addLineSeries({ color: '#2196f3', lineWidth: 2 });
        this.charts.sma35Line = this.charts.movingAverages.addLineSeries({ color: '#4caf50', lineWidth: 2 });
        this.charts.sma50Line = this.charts.movingAverages.addLineSeries({ color: '#000000', lineWidth: 2 });
        this.charts.sma200Line = this.charts.movingAverages.addLineSeries({ color: '#ffc107', lineWidth: 2 });
        
        // Add overbought/oversold lines
        this.charts.overboughtLine = this.charts.movingAverages.addLineSeries({
            color: '#ff0000',
            lineWidth: 2,
            lineStyle: LightweightCharts.LineStyle.Dashed
        });
        
        this.charts.oversoldLine = this.charts.movingAverages.addLineSeries({
            color: '#00ff00',
            lineWidth: 2,
            lineStyle: LightweightCharts.LineStyle.Dashed
        });
        
        console.log('MA chart created');
        
        // Handle window resize
        var self = this;
        window.addEventListener('resize', function() {
            if (self.charts.summation) {
                self.charts.summation.applyOptions({ width: summationContainer.clientWidth });
            }
            if (self.charts.oscillator) {
                self.charts.oscillator.applyOptions({ width: oscillatorContainer.clientWidth });
            }
            if (self.charts.movingAverages) {
                self.charts.movingAverages.applyOptions({ width: maContainer.clientWidth });
            }
        });
        
        console.log('All TradingView charts created successfully');
        
    } catch (error) {
        console.error('Error creating charts:', error);
    }
};

FinancialDashboard.prototype.updateDisplay = function() {
    var exchangeData = this.data[this.currentExchange];
    if (!exchangeData) {
        console.error('No data for exchange:', this.currentExchange);
        return;
    }
    
    try {
        // Update values
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
    try {
        // Update Summation Index chart
        if (this.charts.summationLine && this.charts.summationMA) {
            this.charts.summationLine.setData(exchangeData.summationIndex.history);
            this.charts.summationMA.setData(exchangeData.summationIndex.ma10);
        }
        
        // Update Oscillator chart with colored bars
        if (this.charts.oscillatorHist && this.charts.oscillatorZero) {
            var oscillatorData = exchangeData.oscillator.history.map(function(point) {
                return {
                    time: point.time,
                    value: point.value,
                    color: point.value >= 0 ? '#4caf50' : '#f44336'
                };
            });
            this.charts.oscillatorHist.setData(oscillatorData);
            
            // Add zero line data
            var zeroLineData = exchangeData.oscillator.history.map(function(point) {
                return { time: point.time, value: 0 };
            });
            this.charts.oscillatorZero.setData(zeroLineData);
        }
        
        // Update Moving Averages chart
        if (this.charts.sma5Line && exchangeData.movingAverages.history) {
            var maHistory = exchangeData.movingAverages.history;
            this.charts.sma5Line.setData(maHistory.sma5);
            this.charts.ema10Line.setData(maHistory.ema10);
            this.charts.ema21Line.setData(maHistory.ema21);
            this.charts.sma35Line.setData(maHistory.sma35);
            this.charts.sma50Line.setData(maHistory.sma50);
            this.charts.sma200Line.setData(maHistory.sma200);
            
            // Add overbought/oversold lines
            var obData = maHistory.sma5.map(function(point) {
                return { time: point.time, value: 75 };
            });
            var osData = maHistory.sma5.map(function(point) {
                return { time: point.time, value: 25 };
            });
            
            this.charts.overboughtLine.setData(obData);
            this.charts.oversoldLine.setData(osData);
        }
        
        console.log('Charts updated for', this.currentExchange);
    } catch (error) {
        console.error('Error updating charts:', error);
    }
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
    console.log('DOM loaded, waiting for TradingView library...');
    
    // Wait for TradingView library to load
    function initDashboard() {
        if (typeof LightweightCharts !== 'undefined') {
            console.log('TradingView library loaded, creating dashboard...');
            window.dashboard = new FinancialDashboard();
        } else {
            console.log('Waiting for TradingView library...');
            setTimeout(initDashboard, 100);
        }
    }
    
    initDashboard();
});