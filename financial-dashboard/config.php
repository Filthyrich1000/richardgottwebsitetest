<?php
/**
 * Financial Dashboard Configuration
 * 
 * This file contains all configuration settings for the financial dashboard
 * including database connection, EODHD API settings, and exchange configurations.
 */

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'financial_dashboard');  // You'll need to create this database
define('DB_USER', 'your_db_username');     // Replace with your database username
define('DB_PASS', 'your_db_password');     // Replace with your database password

// EODHD API Configuration
define('EODHD_API_KEY', 'YOUR_EODHD_API_KEY_HERE');  // Replace with your EODHD API key
define('EODHD_BASE_URL', 'https://eodhd.com/api/');

// Exchange Configuration
$EXCHANGE_CONFIG = [
    'FTSE' => [
        'name' => 'FTSE 100',
        'symbol' => 'FTSE.INDX',
        'exchange_code' => 'LSE',
        'constituents_url' => 'fundamentals/FTSE.INDX?api_token=' . EODHD_API_KEY,
        'timezone' => 'Europe/London'
    ],
    'TSX' => [
        'name' => 'TSX Composite',
        'symbol' => 'GSPTSE.INDX',
        'exchange_code' => 'TO',
        'constituents_url' => 'fundamentals/GSPTSE.INDX?api_token=' . EODHD_API_KEY,
        'timezone' => 'America/Toronto'
    ],
    'HSI' => [
        'name' => 'Hang Seng Index',
        'symbol' => 'HSI.INDX',
        'exchange_code' => 'HK',
        'constituents_url' => 'fundamentals/HSI.INDX?api_token=' . EODHD_API_KEY,
        'timezone' => 'Asia/Hong_Kong'
    ],
    'KLCI' => [
        'name' => 'FTSE Bursa Malaysia KLCI',
        'symbol' => 'KLCI.INDX',
        'exchange_code' => 'KLSE',
        'constituents_url' => 'fundamentals/KLCI.INDX?api_token=' . EODHD_API_KEY,
        'timezone' => 'Asia/Kuala_Lumpur'
    ],
    'N225' => [
        'name' => 'Nikkei 225',
        'symbol' => 'N225.INDX',
        'exchange_code' => 'JPX',
        'constituents_url' => 'fundamentals/N225.INDX?api_token=' . EODHD_API_KEY,
        'timezone' => 'Asia/Tokyo'
    ]
];

// Application Settings
define('CACHE_DURATION', 3600);  // Cache data for 1 hour
define('MAX_HISTORY_DAYS', 365); // Maximum historical data to store
define('DEBUG_MODE', true);      // Set to false in production

// Error Reporting
if (DEBUG_MODE) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Timezone
date_default_timezone_set('UTC');

/**
 * Get database connection
 * @return PDO Database connection
 */
function getDbConnection() {
    static $pdo = null;
    
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            if (DEBUG_MODE) {
                die("Database connection failed: " . $e->getMessage());
            } else {
                die("Database connection failed. Please check your configuration.");
            }
        }
    }
    
    return $pdo;
}

/**
 * Log errors and debug information
 * @param string $message Error message
 * @param string $level Error level (ERROR, WARNING, INFO)
 */
function logMessage($message, $level = 'INFO') {
    if (DEBUG_MODE) {
        $timestamp = date('Y-m-d H:i:s');
        $logEntry = "[$timestamp] [$level] $message" . PHP_EOL;
        file_put_contents('logs/dashboard.log', $logEntry, FILE_APPEND | LOCK_EX);
    }
}

/**
 * Create logs directory if it doesn't exist
 */
if (!file_exists('logs')) {
    mkdir('logs', 0755, true);
}

?>