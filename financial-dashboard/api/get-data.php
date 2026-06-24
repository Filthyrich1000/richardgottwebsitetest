<?php
/**
 * API endpoint to get dashboard data
 * 
 * This endpoint returns the latest McClellan indicators and moving average
 * statistics for the requested exchange.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config.php';

try {
    $pdo = getDbConnection();
    
    // Get exchange parameter
    $exchange = $_GET['exchange'] ?? 'FTSE';
    
    // Validate exchange
    global $EXCHANGE_CONFIG;
    if (!isset($EXCHANGE_CONFIG[$exchange])) {
        throw new Exception("Invalid exchange: {$exchange}");
    }
    
    // Get latest McClellan data
    $stmt = $pdo->prepare("
        SELECT 
            date,
            advancing_stocks,
            declining_stocks,
            net_advances,
            total_stocks,
            oscillator,
            summation_index
        FROM mcclellan_data 
        WHERE exchange_code = ? 
        ORDER BY date DESC 
        LIMIT 1
    ");
    $stmt->execute([$exchange]);
    $latestMcclellan = $stmt->fetch();
    
    // Get McClellan history (last 100 days)
    $stmt = $pdo->prepare("
        SELECT 
            date,
            oscillator,
            summation_index
        FROM mcclellan_data 
        WHERE exchange_code = ? 
        AND date >= DATE_SUB(CURDATE(), INTERVAL 100 DAY)
        ORDER BY date ASC
    ");
    $stmt->execute([$exchange]);
    $mcclellanHistory = $stmt->fetchAll();
    
    // Get latest moving average stats
    $stmt = $pdo->prepare("
        SELECT 
            date,
            total_stocks,
            above_ma_20,
            above_ma_50,
            above_ma_200,
            percent_above_ma_20,
            percent_above_ma_50,
            percent_above_ma_200
        FROM moving_average_stats 
        WHERE exchange_code = ? 
        ORDER BY date DESC 
        LIMIT 1
    ");
    $stmt->execute([$exchange]);
    $latestMA = $stmt->fetch();
    
    // Get moving average history (last 100 days)
    $stmt = $pdo->prepare("
        SELECT 
            date,
            percent_above_ma_20,
            percent_above_ma_50,
            percent_above_ma_200
        FROM moving_average_stats 
        WHERE exchange_code = ? 
        AND date >= DATE_SUB(CURDATE(), INTERVAL 100 DAY)
        ORDER BY date ASC
    ");
    $stmt->execute([$exchange]);
    $maHistory = $stmt->fetchAll();
    
    // Calculate changes (compare with previous day)
    $stmt = $pdo->prepare("
        SELECT 
            oscillator,
            summation_index
        FROM mcclellan_data 
        WHERE exchange_code = ? 
        AND date < ? 
        ORDER BY date DESC 
        LIMIT 1
    ");
    $stmt->execute([$exchange, $latestMcclellan['date'] ?? date('Y-m-d')]);
    $previousMcclellan = $stmt->fetch();
    
    // Calculate changes
    $oscillatorChange = 0;
    $summationChange = 0;
    
    if ($latestMcclellan && $previousMcclellan) {
        $oscillatorChange = $latestMcclellan['oscillator'] - $previousMcclellan['oscillator'];
        $summationChange = $latestMcclellan['summation_index'] - $previousMcclellan['summation_index'];
    }
    
    // Format response data
    $response = [
        'exchange' => $exchange,
        'exchange_name' => $EXCHANGE_CONFIG[$exchange]['name'],
        'last_updated' => date('Y-m-d H:i:s'),
        'summationIndex' => [
            'current' => $latestMcclellan['summation_index'] ?? 0,
            'change' => round($summationChange, 2),
            'history' => array_map(function($row) {
                return [
                    'x' => $row['date'],
                    'y' => (float)$row['summation_index']
                ];
            }, $mcclellanHistory)
        ],
        'oscillator' => [
            'current' => $latestMcclellan['oscillator'] ?? 0,
            'change' => round($oscillatorChange, 2),
            'history' => array_map(function($row) {
                return [
                    'x' => $row['date'],
                    'y' => (float)$row['oscillator']
                ];
            }, $mcclellanHistory)
        ],
        'movingAverages' => [
            'ma20' => $latestMA['percent_above_ma_20'] ?? 0,
            'ma50' => $latestMA['percent_above_ma_50'] ?? 0,
            'ma200' => $latestMA['percent_above_ma_200'] ?? 0,
            'history' => [
                'ma20' => array_map(function($row) {
                    return [
                        'x' => $row['date'],
                        'y' => (float)$row['percent_above_ma_20']
                    ];
                }, $maHistory),
                'ma50' => array_map(function($row) {
                    return [
                        'x' => $row['date'],
                        'y' => (float)$row['percent_above_ma_50']
                    ];
                }, $maHistory),
                'ma200' => array_map(function($row) {
                    return [
                        'x' => $row['date'],
                        'y' => (float)$row['percent_above_ma_200']
                    ];
                }, $maHistory)
            ]
        ],
        'stats' => [
            'advancing' => $latestMcclellan['advancing_stocks'] ?? 0,
            'declining' => $latestMcclellan['declining_stocks'] ?? 0,
            'total' => $latestMcclellan['total_stocks'] ?? 0,
            'netAdvances' => $latestMcclellan['net_advances'] ?? 0
        ]
    ];
    
    echo json_encode($response, JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    
    $error = [
        'error' => true,
        'message' => DEBUG_MODE ? $e->getMessage() : 'Internal server error',
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    if (DEBUG_MODE) {
        $error['trace'] = $e->getTraceAsString();
    }
    
    logMessage("API Error in get-data.php: " . $e->getMessage(), 'ERROR');
    
    echo json_encode($error, JSON_PRETTY_PRINT);
}

?>