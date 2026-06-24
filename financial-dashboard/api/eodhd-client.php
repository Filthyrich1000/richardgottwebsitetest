<?php
/**
 * EODHD API Client
 * 
 * This class handles all interactions with the EODHD API including
 * fetching stock prices, index constituents, and managing rate limits.
 */

require_once '../config.php';

class EODHDClient {
    private $apiKey;
    private $baseUrl;
    private $rateLimitDelay = 100000; // 100ms delay between requests (microseconds)
    private $lastRequestTime = 0;
    
    public function __construct($apiKey = null) {
        $this->apiKey = $apiKey ?: EODHD_API_KEY;
        $this->baseUrl = EODHD_BASE_URL;
    }
    
    /**
     * Make HTTP request to EODHD API with rate limiting
     * @param string $endpoint API endpoint
     * @param array $params Query parameters
     * @return array|false API response or false on error
     */
    private function makeRequest($endpoint, $params = []) {
        // Rate limiting
        $currentTime = microtime(true);
        $timeSinceLastRequest = ($currentTime - $this->lastRequestTime) * 1000000;
        
        if ($timeSinceLastRequest < $this->rateLimitDelay) {
            usleep($this->rateLimitDelay - $timeSinceLastRequest);
        }
        
        // Add API key to parameters
        $params['api_token'] = $this->apiKey;
        $params['fmt'] = 'json';
        
        // Build URL
        $url = $this->baseUrl . $endpoint . '?' . http_build_query($params);
        
        // Log API request
        $this->logApiRequest($endpoint, $url);
        
        // Make request
        $startTime = microtime(true);
        $context = stream_context_create([
            'http' => [
                'timeout' => 30,
                'user_agent' => 'Financial Dashboard/1.0'
            ]
        ]);
        
        $response = @file_get_contents($url, false, $context);
        $responseTime = (microtime(true) - $startTime) * 1000;
        
        $this->lastRequestTime = microtime(true);
        
        if ($response === false) {
            $this->logApiError($endpoint, 'Failed to fetch data from API');
            return false;
        }
        
        $data = json_decode($response, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->logApiError($endpoint, 'Invalid JSON response: ' . json_last_error_msg());
            return false;
        }
        
        // Log successful request
        $this->logApiSuccess($endpoint, $responseTime);
        
        return $data;
    }
    
    /**
     * Get historical stock prices
     * @param string $symbol Stock symbol
     * @param string $exchange Exchange code
     * @param string $from Start date (YYYY-MM-DD)
     * @param string $to End date (YYYY-MM-DD)
     * @return array|false Historical price data
     */
    public function getHistoricalPrices($symbol, $exchange, $from, $to) {
        $endpoint = "eod/{$symbol}.{$exchange}";
        $params = [
            'from' => $from,
            'to' => $to,
            'period' => 'd'
        ];
        
        return $this->makeRequest($endpoint, $params);
    }
    
    /**
     * Get real-time or latest stock price
     * @param string $symbol Stock symbol
     * @param string $exchange Exchange code
     * @return array|false Latest price data
     */
    public function getLatestPrice($symbol, $exchange) {
        $endpoint = "real-time/{$symbol}.{$exchange}";
        return $this->makeRequest($endpoint);
    }
    
    /**
     * Get multiple stock prices in batch
     * @param array $symbols Array of symbols
     * @param string $exchange Exchange code
     * @return array|false Batch price data
     */
    public function getBatchPrices($symbols, $exchange) {
        if (empty($symbols)) {
            return [];
        }
        
        $symbolsString = implode(',', array_map(function($symbol) use ($exchange) {
            return $symbol . '.' . $exchange;
        }, $symbols));
        
        $endpoint = "real-time/bulk-api";
        $params = ['symbols' => $symbolsString];
        
        return $this->makeRequest($endpoint, $params);
    }
    
    /**
     * Get index constituents
     * @param string $indexSymbol Index symbol (e.g., 'FTSE.INDX')
     * @return array|false Index constituents data
     */
    public function getIndexConstituents($indexSymbol) {
        $endpoint = "fundamentals/{$indexSymbol}";
        $params = ['filter' => 'Components'];
        
        $data = $this->makeRequest($endpoint, $params);
        
        if ($data && isset($data['Components'])) {
            return $data['Components'];
        }
        
        return false;
    }
    
    /**
     * Get exchange symbol list
     * @param string $exchange Exchange code
     * @return array|false Exchange symbols
     */
    public function getExchangeSymbols($exchange) {
        $endpoint = "exchange-symbol-list/{$exchange}";
        return $this->makeRequest($endpoint);
    }
    
    /**
     * Test API connection
     * @return bool True if API is accessible
     */
    public function testConnection() {
        $endpoint = "real-time/AAPL.US";
        $result = $this->makeRequest($endpoint);
        return $result !== false;
    }
    
    /**
     * Get API usage statistics
     * @return array API usage data
     */
    public function getApiUsage() {
        $pdo = getDbConnection();
        
        // Get today's API calls
        $stmt = $pdo->prepare("
            SELECT 
                COUNT(*) as total_calls,
                COUNT(CASE WHEN response_code = 200 THEN 1 END) as successful_calls,
                COUNT(CASE WHEN response_code != 200 OR response_code IS NULL THEN 1 END) as failed_calls,
                AVG(response_time_ms) as avg_response_time
            FROM api_logs 
            WHERE DATE(request_time) = CURDATE()
        ");
        
        $stmt->execute();
        $todayStats = $stmt->fetch();
        
        // Get recent errors
        $stmt = $pdo->prepare("
            SELECT endpoint, error_message, request_time
            FROM api_logs 
            WHERE error_message IS NOT NULL 
            AND request_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
            ORDER BY request_time DESC 
            LIMIT 10
        ");
        
        $stmt->execute();
        $recentErrors = $stmt->fetchAll();
        
        return [
            'today' => $todayStats,
            'recent_errors' => $recentErrors
        ];
    }
    
    /**
     * Log API request
     * @param string $endpoint API endpoint
     * @param string $url Full URL
     */
    private function logApiRequest($endpoint, $url) {
        if (DEBUG_MODE) {
            logMessage("API Request: {$endpoint} - {$url}", 'INFO');
        }
    }
    
    /**
     * Log successful API response
     * @param string $endpoint API endpoint
     * @param float $responseTime Response time in milliseconds
     */
    private function logApiSuccess($endpoint, $responseTime) {
        try {
            $pdo = getDbConnection();
            $stmt = $pdo->prepare("
                INSERT INTO api_logs (endpoint, response_code, response_time_ms) 
                VALUES (?, 200, ?)
            ");
            $stmt->execute([$endpoint, round($responseTime)]);
        } catch (Exception $e) {
            logMessage("Failed to log API success: " . $e->getMessage(), 'ERROR');
        }
    }
    
    /**
     * Log API error
     * @param string $endpoint API endpoint
     * @param string $error Error message
     */
    private function logApiError($endpoint, $error) {
        logMessage("API Error: {$endpoint} - {$error}", 'ERROR');
        
        try {
            $pdo = getDbConnection();
            $stmt = $pdo->prepare("
                INSERT INTO api_logs (endpoint, response_code, error_message) 
                VALUES (?, NULL, ?)
            ");
            $stmt->execute([$endpoint, $error]);
        } catch (Exception $e) {
            logMessage("Failed to log API error: " . $e->getMessage(), 'ERROR');
        }
    }
}

/**
 * Helper function to get EODHD client instance
 * @return EODHDClient
 */
function getEODHDClient() {
    static $client = null;
    if ($client === null) {
        $client = new EODHDClient();
    }
    return $client;
}

?>