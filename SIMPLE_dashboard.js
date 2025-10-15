// Simple Financial Dashboard - No Time Scales
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
    // Simple day labels
    var labels = [];
    for (var i = 1; i <= 30; i++) {
        labels.push('Day ' + i);
    }
    
    this.data = {
        FTSE: {
            labels: labels,
            summationIndex: {
                current: 395.42,
                change: 12.8,
                history: [300, 305, 310, 315, 320, 325, 330, 335, 340, 345, 350, 355, 360, 365, 370, 375, 380, 385, 390, 395, 400, 398, 396, 394, 392, 390, 388, 386, 384, 395],
                ma10: [302, 307, 312, 317, 322, 327, 332, 337, 342, 347, 352, 357, 362, 367, 372, 377, 382, 387, 392, 397, 398, 396, 394, 392, 390, 388, 386, 384, 382, 385]
            },
            oscillator: {
                current: -15.23,
                change: -3.2,
                history: [10, -5, 15, -8, 12, -3, 8, -12, 5, -7, 18, -15, 22, -10, 6, -18, 14, -4, 9, -16, 11, -6, 13, -9, 7, -11, 4, -14, 2, -15]
            },
            movingAverages: {
                sma5: 78.5,
                ema10: 72.3,
                ema21: 68.1,
                sma35: 65.2,
                sma50: 60.8,
                sma200: 52.8,
                history: {
                    sma5: [75, 76, 77, 78, 79, 78, 77, 76, 75, 74, 75, 76, 77, 78, 79, 80, 81, 80, 79, 78, 77, 76, 75, 74, 73, 74, 75, 76, 77, 78],
                    ema10: [70, 71, 72, 73, 74, 73, 72, 71, 70, 69, 70, 71, 72, 73, 74, 75, 76, 75, 74, 73, 72, 71, 70, 69, 68, 69, 70, 71, 72, 72],
                    ema21: [65, 66, 67, 68, 69, 68, 67, 66, 65, 64, 65, 66, 67, 68, 69, 70, 71, 70, 69, 68, 67, 66, 65, 64, 63, 64, 65, 66, 67, 68],
                    sma35: [60, 61, 62, 63, 64, 63, 62, 61, 60, 59, 60, 61, 62, 63, 64, 65, 66, 65, 64, 63, 62, 61, 60, 59, 58, 59, 60, 61, 62, 65],
                    sma50: [55, 56, 57, 58, 59, 58, 57, 56, 55, 54, 55, 56, 57, 58, 59, 60, 61, 60, 59, 58, 57, 56, 55, 54, 53, 54, 55, 56, 57, 61],
                    sma200: [45, 46, 47, 48, 49, 48, 47, 46, 45, 44, 45, 46, 47, 48, 49, 50, 51, 50, 49, 48, 47, 46, 45, 44, 43, 44, 45, 46, 47, 53]
                }
            },
            stats: {
                advancing: 68,
                declining: 32,
                total: 100,
                netAdvances: 36
            }
        },
        TSX: {
            labels: labels,
            summationIndex: {
                current: 287.15,
                change: -8.4,
                history: [200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 298, 296, 294, 292, 290, 288, 286, 284, 282, 287],
                ma10: [202, 207, 212, 217, 222, 227, 232, 237, 242, 247, 252, 257, 262, 267, 272, 277, 282, 287, 292, 297, 296, 294, 292, 290, 288, 286, 284, 282, 280, 285]
            },
            oscillator: {
                current: 8.67,
                change: 2.1,
                history: [5, -3, 8, -6, 10, -2, 7, -9, 4, -5, 12, -8, 15, -7, 3, -11, 9, -1, 6, -13, 8, -4, 11, -6, 5, -8, 2, -10, 1, 9]
            },
            movingAverages: {
                sma5: 72.3,
                ema10: 68.1,
                ema21: 63.4,
                sma35: 58.9,
                sma50: 54.2,
                sma200: 45.6,
                history: {
                    sma5: [70, 71, 72, 73, 74, 73, 72, 71, 70, 69, 70, 71, 72, 73, 74, 75, 76, 75, 74, 73, 72, 71, 70, 69, 68, 69, 70, 71, 72, 72],
                    ema10: [65, 66, 67, 68, 69, 68, 67, 66, 65, 64, 65, 66, 67, 68, 69, 70, 71, 70, 69, 68, 67, 66, 65, 64, 63, 64, 65, 66, 67, 68],
                    ema21: [60, 61, 62, 63, 64, 63, 62, 61, 60, 59, 60, 61, 62, 63, 64, 65, 66, 65, 64, 63, 62, 61, 60, 59, 58, 59, 60, 61, 62, 63],
                    sma35: [55, 56, 57, 58, 59, 58, 57, 56, 55, 54, 55, 56, 57, 58, 59, 60, 61, 60, 59, 58, 57, 56, 55, 54, 53, 54, 55, 56, 57, 59],
                    sma50: [50, 51, 52, 53, 54, 53, 52, 51, 50, 49, 50, 51, 52, 53, 54, 55, 56, 55, 54, 53, 52, 51, 50, 49, 48, 49, 50, 51, 52, 54],
                    sma200: [40, 41, 42, 43, 44, 43, 42, 41, 40, 39, 40, 41, 42, 43, 44, 45, 46, 45, 44, 43, 42, 41, 40, 39, 38, 39, 40, 41, 42, 46]
                }
            },
            stats: {
                advancing: 145,
                declining: 95,
                total: 240,
                netAdvances: 50
            }
        },
        HSI: {
            labels: labels,
            summationIndex: {
                current: 156.89,
                change: 5.2,
                history: [100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 175, 170, 165, 160, 158, 156, 154, 152, 150, 148, 150, 152, 157],
                ma10: [102, 107, 112, 117, 122, 127, 132, 137, 142, 147, 152, 157, 162, 167, 172, 177, 178, 173, 168, 163, 158, 156, 154, 152, 150, 148, 146, 148, 150, 155]
            },
            oscillator: {
                current: 12.45,
                change: 1.8,
                history: [8, -2, 12, -4, 15, -1, 10, -7, 6, -3, 18, -5, 20, -8, 4, -12, 14, -2, 9, -10, 13, -3, 16, -6, 7, -9, 3, -11, 1, 12]
            },
            movingAverages: {
                sma5: 68.9,
                ema10: 64.5,
                ema21: 59.8,
                sma35: 54.2,
                sma50: 48.7,
                sma200: 41.7,
                history: {
                    sma5: [66, 67, 68, 69, 70, 69, 68, 67, 66, 65, 66, 67, 68, 69, 70, 71, 72, 71, 70, 69, 68, 67, 66, 65, 64, 65, 66, 67, 68, 69],
                    ema10: [61, 62, 63, 64, 65, 64, 63, 62, 61, 60, 61, 62, 63, 64, 65, 66, 67, 66, 65, 64, 63, 62, 61, 60, 59, 60, 61, 62, 63, 64],
                    ema21: [56, 57, 58, 59, 60, 59, 58, 57, 56, 55, 56, 57, 58, 59, 60, 61, 62, 61, 60, 59, 58, 57, 56, 55, 54, 55, 56, 57, 58, 60],
                    sma35: [51, 52, 53, 54, 55, 54, 53, 52, 51, 50, 51, 52, 53, 54, 55, 56, 57, 56, 55, 54, 53, 52, 51, 50, 49, 50, 51, 52, 53, 54],
                    sma50: [46, 47, 48, 49, 50, 49, 48, 47, 46, 45, 46, 47, 48, 49, 50, 51, 52, 51, 50, 49, 48, 47, 46, 45, 44, 45, 46, 47, 48, 49],
                    sma200: [38, 39, 40, 41, 42, 41, 40, 39, 38, 37, 38, 39, 40, 41, 42, 43, 44, 43, 42, 41, 40, 39, 38, 37, 36, 37, 38, 39, 40, 42]
                }
            },
            stats: {
                advancing: 56,
                declining: 26,
                total: 82,
                netAdvances: 30
            }
        },
        KLCI: {
            labels: labels,
            summationIndex: {
                current: 89.34,
                change: -2.1,
                history: [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 98, 96, 94, 92, 90, 88, 86, 84, 82, 80, 82, 84, 86, 88, 90, 92, 91, 90, 89],
                ma10: [52, 57, 62, 67, 72, 77, 82, 87, 92, 97, 98, 96, 94, 92, 90, 88, 86, 84, 82, 80, 78, 80, 82, 84, 86, 88, 90, 89, 88, 87]
            },
            oscillator: {
                current: -5.67,
                change: -1.2,
                history: [3, -1, 6, -3, 8, -2, 5, -6, 2, -4, 9, -7, 11, -5, 1, -8, 7, -1, 4, -9, 6, -2, 8, -4, 3, -7, 1, -6, 0, -6]
            },
            movingAverages: {
                sma5: 63.3,
                ema10: 58.9,
                ema21: 54.2,
                sma35: 50.0,
                sma50: 45.1,
                sma200: 36.7,
                history: {
                    sma5: [61, 62, 63, 64, 65, 64, 63, 62, 61, 60, 61, 62, 63, 64, 65, 66, 67, 66, 65, 64, 63, 62, 61, 60, 59, 60, 61, 62, 63, 63],
                    ema10: [56, 57, 58, 59, 60, 59, 58, 57, 56, 55, 56, 57, 58, 59, 60, 61, 62, 61, 60, 59, 58, 57, 56, 55, 54, 55, 56, 57, 58, 59],
                    ema21: [51, 52, 53, 54, 55, 54, 53, 52, 51, 50, 51, 52, 53, 54, 55, 56, 57, 56, 55, 54, 53, 52, 51, 50, 49, 50, 51, 52, 53, 54],
                    sma35: [46, 47, 48, 49, 50, 49, 48, 47, 46, 45, 46, 47, 48, 49, 50, 51, 52, 51, 50, 49, 48, 47, 46, 45, 44, 45, 46, 47, 48, 50],
                    sma50: [41, 42, 43, 44, 45, 44, 43, 42, 41, 40, 41, 42, 43, 44, 45, 46, 47, 46, 45, 44, 43, 42, 41, 40, 39, 40, 41, 42, 43, 45],
                    sma200: [33, 34, 35, 36, 37, 36, 35, 34, 33, 32, 33, 34, 35, 36, 37, 38, 39, 38, 37, 36, 35, 34, 33, 32, 31, 32, 33, 34, 35, 37]
                }
            },
            stats: {
                advancing: 19,
                declining: 11,
                total: 30,
                netAdvances: 8
            }
        },
        N225: {
            labels: labels,
            summationIndex: {
                current: 234.67,
                change: 15.3,
                history: [150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 248, 246, 244, 242, 240, 238, 236, 234, 232, 235],
                ma10: [152, 157, 162, 167, 172, 177, 182, 187, 192, 197, 202, 207, 212, 217, 222, 227, 232, 237, 242, 247, 246, 244, 242, 240, 238, 236, 234, 232, 230, 233]
            },
            oscillator: {
                current: 18.92,
                change: 4.5,
                history: [12, -3, 18, -6, 22, -2, 15, -9, 8, -5, 25, -8, 28, -12, 6, -15, 20, -4, 14, -18, 16, -7, 19, -10, 11, -13, 5, -16, 3, 19]
            },
            movingAverages: {
                sma5: 81.2,
                ema10: 76.8,
                ema21: 72.4,
                sma35: 69.8,
                sma50: 64.3,
                sma200: 58.4,
                history: {
                    sma5: [79, 80, 81, 82, 83, 82, 81, 80, 79, 78, 79, 80, 81, 82, 83, 84, 85, 84, 83, 82, 81, 80, 79, 78, 77, 78, 79, 80, 81, 81],
                    ema10: [74, 75, 76, 77, 78, 77, 76, 75, 74, 73, 74, 75, 76, 77, 78, 79, 80, 79, 78, 77, 76, 75, 74, 73, 72, 73, 74, 75, 76, 77],
                    ema21: [69, 70, 71, 72, 73, 72, 71, 70, 69, 68, 69, 70, 71, 72, 73, 74, 75, 74, 73, 72, 71, 70, 69, 68, 67, 68, 69, 70, 71, 72],
                    sma35: [66, 67, 68, 69, 70, 69, 68, 67, 66, 65, 66, 67, 68, 69, 70, 71, 72, 71, 70, 69, 68, 67, 66, 65, 64, 65, 66, 67, 68, 70],
                    sma50: [61, 62, 63, 64, 65, 64, 63, 62, 61, 60, 61, 62, 63, 64, 65, 66, 67, 66, 65, 64, 63, 62, 61, 60, 59, 60, 61, 62, 63, 64],
                    sma200: [55, 56, 57, 58, 59, 58, 57, 56, 55, 54, 55, 56, 57, 58, 59, 60, 61, 60, 59, 58, 57, 56, 55, 54, 53, 54, 55, 56, 57, 58]
                }
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

FinancialDashboard.prototype.createCharts = function() {
    console.log('Creating charts...');
    
    // McClellan Summation Index Chart - Simple linear scale
    var summationCtx = document.getElementById('summationChart').getContext('2d');
    this.charts.summation = new Chart(summationCtx, {
        type: 'line',
        data: {
            labels: [],
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
            plugins: { 
                legend: { display: false } 
            },
            scales: {
                x: {
                    display: true,
                    grid: { color: 'rgba(0,0,0,0.1)' }
                },
                y: { 
                    display: true,
                    grid: { color: 'rgba(0,0,0,0.1)' } 
                }
            }
        }
    });

    // McClellan Oscillator Chart - Simple bar chart
    var oscillatorCtx = document.getElementById('oscillatorChart').getContext('2d');
    this.charts.oscillator = new Chart(oscillatorCtx, {
        type: 'bar',
        data: {
            labels: [],
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
            plugins: { 
                legend: { display: false } 
            },
            scales: {
                x: {
                    display: true,
                    grid: { color: 'rgba(0,0,0,0.1)' }
                },
                y: { 
                    display: true,
                    grid: { color: 'rgba(0,0,0,0.1)' } 
                }
            }
        }
    });

    // Moving Averages Chart - Simple line chart
    var maCtx = document.getElementById('movingAveragesChart').getContext('2d');
    this.charts.movingAverages = new Chart(maCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                { label: '5-day SMA', data: [], borderColor: '#ff1744', borderWidth: 2, fill: false, pointRadius: 0, pointHoverRadius: 4 },
                { label: '10-day EMA', data: [], borderColor: '#9c27b0', borderWidth: 2, fill: false, pointRadius: 0, pointHoverRadius: 4 },
                { label: '21-day EMA', data: [], borderColor: '#2196f3', borderWidth: 2, fill: false, pointRadius: 0, pointHoverRadius: 4 },
                { label: '35-day SMA', data: [], borderColor: '#4caf50', borderWidth: 2, fill: false, pointRadius: 0, pointHoverRadius: 4 },
                { label: '50-day SMA', data: [], borderColor: '#000000', borderWidth: 2, fill: false, pointRadius: 0, pointHoverRadius: 4 },
                { label: '200-day SMA', data: [], borderColor: '#ffc107', borderWidth: 2, fill: false, pointRadius: 0, pointHoverRadius: 4 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                legend: { display: false } 
            },
            scales: {
                x: {
                    display: true,
                    grid: { color: 'rgba(0,0,0,0.1)' }
                },
                y: { 
                    display: true,
                    min: 0, 
                    max: 100, 
                    grid: { color: 'rgba(0,0,0,0.1)' } 
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
    // Update Summation Index chart
    this.charts.summation.data.labels = exchangeData.labels;
    this.charts.summation.data.datasets[0].data = exchangeData.summationIndex.history;
    this.charts.summation.data.datasets[1].data = exchangeData.summationIndex.ma10;
    this.charts.summation.update('none');
    
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
    
    this.charts.oscillator.data.labels = exchangeData.labels;
    this.charts.oscillator.data.datasets[0].data = exchangeData.oscillator.history;
    this.charts.oscillator.data.datasets[0].backgroundColor = colors;
    this.charts.oscillator.data.datasets[0].borderColor = borderColors;
    this.charts.oscillator.update('none');
    
    // Update Moving Averages chart
    this.charts.movingAverages.data.labels = exchangeData.labels;
    this.charts.movingAverages.data.datasets[0].data = exchangeData.movingAverages.history.sma5;
    this.charts.movingAverages.data.datasets[1].data = exchangeData.movingAverages.history.ema10;
    this.charts.movingAverages.data.datasets[2].data = exchangeData.movingAverages.history.ema21;
    this.charts.movingAverages.data.datasets[3].data = exchangeData.movingAverages.history.sma35;
    this.charts.movingAverages.data.datasets[4].data = exchangeData.movingAverages.history.sma50;
    this.charts.movingAverages.data.datasets[5].data = exchangeData.movingAverages.history.sma200;
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
    console.log('Refreshing data for exchange:', this.currentExchange);
    this.updateLastUpdateTime();
};

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing dashboard...');
    window.dashboard = new FinancialDashboard();
    console.log('Dashboard object:', window.dashboard);
});