// Fixed Financial Dashboard JavaScript
function FinancialDashboard() {
    this.currentExchange = 'FTSE';
    this.charts = {};
    this.data = {};
    this.init();
}

FinancialDashboard.prototype.init = function() {
    this.setupEventListeners();
    this.loadSampleData();
    this.createCharts();
    this.updateDisplay();
    this.updateLastUpdateTime();
};

FinancialDashboard.prototype.setupEventListeners = function() {
    var self = this;
    
    var tabButtons = document.querySelectorAll('.tab-btn');
    for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].addEventListener('click', function(e) {
            self.switchExchange(e.target.dataset.exchange);
        });
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
        },
        TSX: {
            summationIndex: {
                current: 287.15,
                change: -8.4,
                history: this.generateSampleData(30, 200, 400)
            },
            oscillator: {
                current: 8.67,
                change: 2.1,
                history: this.generateOscillatorData(30)
            },
            movingAverages: {
                sma5: 72.3,
                ema10: 68.1,
                ema21: 63.4,
                sma35: 58.9,
                sma50: 54.2,
                sma200: 45.6,
                history: this.generateMAData(30)
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
                history: this.generateSampleData(30, 100, 300)
            },
            oscillator: {
                current: 12.45,
                change: 1.8,
                history: this.generateOscillatorData(30)
            },
            movingAverages: {
                sma5: 68.9,
                ema10: 64.5,
                ema21: 59.8,
                sma35: 54.2,
                sma50: 48.7,
                sma200: 41.7,
                history: this.generateMAData(30)
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
                history: this.generateSampleData(30, 50, 150)
            },
            oscillator: {
                current: -5.67,
                change: -1.2,
                history: this.generateOscillatorData(30)
            },
            movingAverages: {
                sma5: 63.3,
                ema10: 58.9,
                ema21: 54.2,
                sma35: 50.0,
                sma50: 45.1,
                sma200: 36.7,
                history: this.generateMAData(30)
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
                history: this.generateSampleData(30, 150, 350)
            },
            oscillator: {
                current: 18.92,
                change: 4.5,
                history: this.generateOscillatorData(30)
            },
            movingAverages: {
                sma5: 81.2,
                ema10: 76.8,
                ema21: 72.4,
                sma35: 69.8,
                sma50: 64.3,
                sma200: 58.4,
                history: this.generateMAData(30)
            },
            stats: {
                advancing: 182,
                declining: 43,
                total: 225,
                netAdvances: 139
            }
        }
    };
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
            x: date.getTime(), // Use timestamp instead of string
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
            x: date.getTime(), // Use timestamp instead of string
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

FinancialDashboard.prototype.calculateMovingAverage = function(data, period) {
    var maData = [];
    for (var i = period - 1; i < data.length; i++) {
        var slice = data.slice(i - period + 1, i + 1);
        var sum = 0;
        for (var j = 0; j < slice.length; j++) {
            sum += slice[j].y;
        }
        var average = sum / period;
        maData.push({
            x: data[i].x,
            y: parseFloat(average.toFixed(2))
        });
    }
    return maData;
};

FinancialDashboard.prototype.createCharts = function() {
    console.log('Creating charts...');
    
    // McClellan Summation Index Chart
    var summationCtx = document.getElementById('summationChart').getContext('2d');
    this.charts.summation = new Chart(summationCtx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'McClellan Summation Index',
                    data: [],
                    borderColor: '#667eea',
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 4
                },
                {
                    label: '10-Period MA',
                    data: [],
                    borderColor: '#ff9500',
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: { 
                legend: { display: false } 
            },
            scales: {
                x: {
                    type: 'time',
                    time: { 
                        unit: 'day', 
                        displayFormats: { 
                            day: 'MMM dd' 
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
                    hoverRadius: 4,
                    hitRadius: 4
                }
            }
        }
    });

    // McClellan Oscillator Chart
    var oscillatorCtx = document.getElementById('oscillatorChart').getContext('2d');
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
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: { 
                legend: { display: false } 
            },
            scales: {
                x: {
                    type: 'time',
                    time: { 
                        unit: 'day', 
                        displayFormats: { 
                            day: 'MMM dd' 
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
            }
        }
    });

    // Moving Averages Chart
    var maCtx = document.getElementById('movingAveragesChart').getContext('2d');
    this.charts.movingAverages = new Chart(maCtx, {
        type: 'line',
        data: {
            datasets: [
                { 
                    label: '5-day SMA', 
                    data: [], 
                    borderColor: '#ff1744', 
                    borderWidth: 2, 
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 4
                },
                { 
                    label: '10-day EMA', 
                    data: [], 
                    borderColor: '#9c27b0', 
                    borderWidth: 2, 
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 4
                },
                { 
                    label: '21-day EMA', 
                    data: [], 
                    borderColor: '#2196f3', 
                    borderWidth: 2, 
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 4
                },
                { 
                    label: '35-day SMA', 
                    data: [], 
                    borderColor: '#4caf50', 
                    borderWidth: 2, 
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 4
                },
                { 
                    label: '50-day SMA', 
                    data: [], 
                    borderColor: '#000000', 
                    borderWidth: 2, 
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 4
                },
                { 
                    label: '200-day SMA', 
                    data: [], 
                    borderColor: '#ffc107', 
                    borderWidth: 2, 
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: { 
                legend: { display: false } 
            },
            scales: {
                x: {
                    type: 'time',
                    time: { 
                        unit: 'day', 
                        displayFormats: { 
                            day: 'MMM dd' 
                        },
                        tooltipFormat: 'MMM dd, yyyy'
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
                    hoverRadius: 4,
                    hitRadius: 4
                }
            }
        }
    });
    
    console.log('Charts created successfully');
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
    
    this.updateCharts(exchangeData);
};

FinancialDashboard.prototype.updateChangeIndicator = function(elementId, change) {
    var element = document.getElementById(elementId);
    var isPositive = change > 0;
    element.textContent = (isPositive ? '+' : '') + change.toFixed(2);
    element.className = 'change-indicator ' + (isPositive ? 'positive' : 'negative');
};

FinancialDashboard.prototype.updateCharts = function(exchangeData) {
    var summationHistory = exchangeData.summationIndex.history;
    var summationMA = this.calculateMovingAverage(summationHistory, 10);
    
    this.charts.summation.data.datasets[0].data = summationHistory;
    this.charts.summation.data.datasets[1].data = summationMA;
    this.charts.summation.update('none');
    
    var oscillatorHistory = exchangeData.oscillator.history;
    var colors = [];
    var borderColors = [];
    
    for (var i = 0; i < oscillatorHistory.length; i++) {
        if (oscillatorHistory[i].y >= 0) {
            colors.push('#4caf50');
            borderColors.push('#388e3c');
        } else {
            colors.push('#f44336');
            borderColors.push('#d32f2f');
        }
    }
    
    this.charts.oscillator.data.datasets[0].data = oscillatorHistory;
    this.charts.oscillator.data.datasets[0].backgroundColor = colors;
    this.charts.oscillator.data.datasets[0].borderColor = borderColors;
    this.charts.oscillator.update('none');
    
    var maHistory = exchangeData.movingAverages.history;
    this.charts.movingAverages.data.datasets[0].data = maHistory.sma5;
    this.charts.movingAverages.data.datasets[1].data = maHistory.ema10;
    this.charts.movingAverages.data.datasets[2].data = maHistory.ema21;
    this.charts.movingAverages.data.datasets[3].data = maHistory.sma35;
    this.charts.movingAverages.data.datasets[4].data = maHistory.sma50;
    this.charts.movingAverages.data.datasets[5].data = maHistory.sma200;
    this.charts.movingAverages.update('none');
};

FinancialDashboard.prototype.updateLastUpdateTime = function() {
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
};

FinancialDashboard.prototype.refreshData = function() {
    var self = this;
    console.log('Refreshing data for exchange:', this.currentExchange);
    
    fetch('api/get-data.php?exchange=' + this.currentExchange)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error('API not available');
        })
        .then(function(newData) {
            if (newData && !newData.error) {
                self.data[self.currentExchange] = newData;
                self.updateDisplay();
            }
        })
        .catch(function(error) {
            console.log('Error fetching data:', error.message);
        });
    
    this.updateLastUpdateTime();
};

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.dashboard = new FinancialDashboard();
});