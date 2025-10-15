// Very simple test version
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting test...');
    
    // Test if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded!');
        return;
    }
    
    console.log('Chart.js is available');
    
    // Test basic chart creation
    try {
        var ctx = document.getElementById('summationChart');
        if (!ctx) {
            console.error('summationChart canvas not found!');
            return;
        }
        
        console.log('Canvas found, creating test chart...');
        
        var testChart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                datasets: [{
                    label: 'Test Data',
                    data: [10, 20, 30, 40, 50],
                    borderColor: '#ff0000',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        console.log('Test chart created successfully!');
        
        // Test oscillator chart
        var oscCtx = document.getElementById('oscillatorChart');
        if (oscCtx) {
            var oscChart = new Chart(oscCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
                    datasets: [{
                        label: 'Test Bars',
                        data: [10, -5, 15, -8, 12],
                        backgroundColor: ['#00ff00', '#ff0000', '#00ff00', '#ff0000', '#00ff00']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true
                        }
                    }
                }
            });
            console.log('Oscillator test chart created!');
        }
        
        // Test MA chart
        var maCtx = document.getElementById('movingAveragesChart');
        if (maCtx) {
            var maChart = new Chart(maCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
                    datasets: [
                        {
                            label: '5-day SMA',
                            data: [70, 75, 72, 78, 80],
                            borderColor: '#ff1744',
                            borderWidth: 2,
                            fill: false
                        },
                        {
                            label: '10-day EMA',
                            data: [65, 68, 70, 72, 75],
                            borderColor: '#9c27b0',
                            borderWidth: 2,
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true
                        }
                    },
                    scales: {
                        y: {
                            min: 0,
                            max: 100
                        }
                    }
                }
            });
            console.log('MA test chart created!');
        }
        
        // Update some values to test
        document.getElementById('summation-value').textContent = '395.42';
        document.getElementById('oscillator-value').textContent = '-15.23';
        document.getElementById('sma5-value').textContent = '78.5';
        document.getElementById('ema10-value').textContent = '72.3';
        document.getElementById('ma20-value').textContent = '68.1';
        document.getElementById('sma35-value').textContent = '65.2';
        document.getElementById('ma50-value').textContent = '60.8';
        document.getElementById('ma200-value').textContent = '52.8';
        
        console.log('All test charts and values updated!');
        
    } catch (error) {
        console.error('Error creating charts:', error);
    }
});