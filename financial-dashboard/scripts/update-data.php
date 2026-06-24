<?php
/**
 * Data Update Script
 * 
 * This script fetches data from EODHD API and calculates McClellan indicators
 * and moving average statistics. Run this daily via cron job.
 * 
 * Usage: php update-data.php [exchange_code]
 * Example: php update-data.php FTSE
 */

require_once '../config.php';
require_once '../api/eodhd-client.php';

class DataUpdater {
    private $pdo;
    private $eodhd;
    
    public function __construct() {
        $this->pdo = getDbConnection();
        $this->eodhd = getEODHDClient();
    }
    
    /**
     * Update data for all exchanges or specific exchange
     * @param string|null $exchangeCode Specific exchange to update
     */
    public function updateData($exchangeCode = null) {
        global $EXCHANGE_CONFIG;
        
        $exchanges = $exchangeCode ? [$exchangeCode => $EXCHANGE_CONFIG[$exchangeCode]] : $EXCHANGE_CONFIG;
        
        foreach ($exchanges as $code => $config) {
            try {
                logMessage("Starting update for exchange: {$code}", 'INFO');
                
                // Update constituents
                $this->updateConstituents($code, $config);
                
                // Update stock prices
                $this->updateStockPrices($code);
                
                // Calculate McClellan indicators
                $this->calculateMcclellanIndicators($code);
                
                // Calculate moving average statistics
                $this->calculateMovingAverageStats($code);
                
                logMessage("Completed update for exchange: {$code}", 'INFO');
                
            } catch (Exception $e) {
                logMessage("Error updating {$code}: " . $e->getMessage(), 'ERROR');
                continue;
            }
        }
    }
    
    /**
     * Update index constituents from EODHD API
     * @param string $exchangeCode Exchange code
     * @param array $config Exchange configuration
     */
    private function updateConstituents($exchangeCode, $config) {
        logMessage("Updating constituents for {$exchangeCode}", 'INFO');
        
        $constituents = $this->eodhd->getIndexConstituents($config['symbol']);
        
        if (!$constituents) {
            throw new Exception("Failed to fetch constituents for {$exchangeCode}");
        }
        
        // Mark all current constituents as inactive
        $stmt = $this->pdo->prepare("
            UPDATE index_constituents 
            SET is_active = FALSE 
            WHERE exchange_code = ?
        ");
        $stmt->execute([$exchangeCode]);
        
        // Insert/update constituents
        $stmt = $this->pdo->prepare("
            INSERT INTO index_constituents (exchange_code, symbol, name, weight, is_active) 
            VALUES (?, ?, ?, ?, TRUE)
            ON DUPLICATE KEY UPDATE 
                name = VALUES(name),
                weight = VALUES(weight),
                is_active = TRUE
        ");
        
        $count = 0;
        foreach ($constituents as $symbol => $data) {
            $name = $data['Name'] ?? $symbol;
            $weight = isset($data['Weight']) ? (float)$data['Weight'] : null;
            
            $stmt->execute([$exchangeCode, $symbol, $name, $weight]);
            $count++;
        }
        
        logMessage("Updated {$count} constituents for {$exchangeCode}", 'INFO');
    }
    
    /**
     * Update stock prices for exchange constituents
     * @param string $exchangeCode Exchange code
     */
    private function updateStockPrices($exchangeCode) {
        logMessage("Updating stock prices for {$exchangeCode}", 'INFO');
        
        // Get active constituents
        $stmt = $this->pdo->prepare("
            SELECT symbol 
            FROM index_constituents 
            WHERE exchange_code = ? AND is_active = TRUE
        ");
        $stmt->execute([$exchangeCode]);
        $constituents = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        if (empty($constituents)) {
            throw new Exception("No constituents found for {$exchangeCode}");
        }
        
        global $EXCHANGE_CONFIG;
        $config = $EXCHANGE_CONFIG[$exchangeCode];
        
        // Get the last trading day we have data for
        $stmt = $this->pdo->prepare("
            SELECT MAX(date) as last_date
            FROM stock_prices 
            WHERE exchange_code = ?
        ");
        $stmt->execute([$exchangeCode]);
        $lastDate = $stmt->fetchColumn();
        
        $fromDate = $lastDate ? date('Y-m-d', strtotime($lastDate . ' +1 day')) : date('Y-m-d', strtotime('-30 days'));
        $toDate = date('Y-m-d');
        
        // Batch process constituents to avoid API rate limits
        $batchSize = 10;
        $batches = array_chunk($constituents, $batchSize);
        
        $totalUpdated = 0;
        
        foreach ($batches as $batch) {
            foreach ($batch as $symbol) {
                try {
                    $prices = $this->eodhd->getHistoricalPrices($symbol, $config['exchange_code'], $fromDate, $toDate);
                    
                    if ($prices) {
                        $this->insertStockPrices($symbol, $exchangeCode, $prices);
                        $totalUpdated++;
                    }
                    
                    // Small delay to respect rate limits
                    usleep(100000); // 100ms
                    
                } catch (Exception $e) {
                    logMessage("Error updating prices for {$symbol}: " . $e->getMessage(), 'WARNING');
                    continue;
                }
            }
        }
        
        logMessage("Updated prices for {$totalUpdated} stocks in {$exchangeCode}", 'INFO');
    }
    
    /**
     * Insert stock price data into database
     * @param string $symbol Stock symbol
     * @param string $exchangeCode Exchange code
     * @param array $prices Price data from API
     */
    private function insertStockPrices($symbol, $exchangeCode, $prices) {
        $stmt = $this->pdo->prepare("
            INSERT INTO stock_prices 
            (symbol, exchange_code, date, open_price, high_price, low_price, close_price, volume, adjusted_close)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                open_price = VALUES(open_price),
                high_price = VALUES(high_price),
                low_price = VALUES(low_price),
                close_price = VALUES(close_price),
                volume = VALUES(volume),
                adjusted_close = VALUES(adjusted_close)
        ");
        
        foreach ($prices as $price) {
            $stmt->execute([
                $symbol,
                $exchangeCode,
                $price['date'],
                $price['open'] ?? null,
                $price['high'] ?? null,
                $price['low'] ?? null,
                $price['close'],
                $price['volume'] ?? null,
                $price['adjusted_close'] ?? $price['close']
            ]);
        }
    }
    
    /**
     * Calculate McClellan Oscillator and Summation Index
     * @param string $exchangeCode Exchange code
     */
    private function calculateMcclellanIndicators($exchangeCode) {
        logMessage("Calculating McClellan indicators for {$exchangeCode}", 'INFO');
        
        // Get dates that need calculation
        $stmt = $this->pdo->prepare("
            SELECT DISTINCT date 
            FROM stock_prices 
            WHERE exchange_code = ? 
            AND date NOT IN (
                SELECT date FROM mcclellan_data WHERE exchange_code = ?
            )
            ORDER BY date ASC
        ");
        $stmt->execute([$exchangeCode, $exchangeCode]);
        $dates = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        foreach ($dates as $date) {
            $this->calculateMcclellanForDate($exchangeCode, $date);
        }
        
        logMessage("Calculated McClellan indicators for " . count($dates) . " days", 'INFO');
    }
    
    /**
     * Calculate McClellan indicators for specific date
     * @param string $exchangeCode Exchange code
     * @param string $date Date in Y-m-d format
     */
    private function calculateMcclellanForDate($exchangeCode, $date) {
        // Get price changes for the date
        $stmt = $this->pdo->prepare("
            SELECT 
                p1.symbol,
                p1.close_price as current_close,
                p2.close_price as previous_close,
                CASE 
                    WHEN p1.close_price > p2.close_price THEN 1 
                    ELSE 0 
                END as is_advancing
            FROM stock_prices p1
            LEFT JOIN stock_prices p2 ON p1.symbol = p2.symbol 
                AND p1.exchange_code = p2.exchange_code
                AND p2.date = (
                    SELECT MAX(date) 
                    FROM stock_prices p3 
                    WHERE p3.symbol = p1.symbol 
                    AND p3.exchange_code = p1.exchange_code 
                    AND p3.date < p1.date
                )
            WHERE p1.exchange_code = ? 
            AND p1.date = ?
            AND p2.close_price IS NOT NULL
        ");
        $stmt->execute([$exchangeCode, $date]);
        $stocks = $stmt->fetchAll();
        
        if (empty($stocks)) {
            return;
        }
        
        // Calculate advancing/declining counts
        $advancing = array_sum(array_column($stocks, 'is_advancing'));
        $declining = count($stocks) - $advancing;
        $netAdvances = $advancing - $declining;
        $totalStocks = count($stocks);
        
        // Get previous EMAs for calculation
        $stmt = $this->pdo->prepare("
            SELECT ema_19_net_advances, ema_39_net_advances, summation_index
            FROM mcclellan_data 
            WHERE exchange_code = ? 
            AND date < ? 
            ORDER BY date DESC 
            LIMIT 1
        ");
        $stmt->execute([$exchangeCode, $date]);
        $previous = $stmt->fetch();
        
        // Calculate EMAs (using simple approximation for first calculation)
        $alpha19 = 2 / (19 + 1); // 0.1
        $alpha39 = 2 / (39 + 1); // 0.05
        
        $ema19 = $previous ? 
            ($netAdvances * $alpha19) + ($previous['ema_19_net_advances'] * (1 - $alpha19)) :
            $netAdvances;
            
        $ema39 = $previous ? 
            ($netAdvances * $alpha39) + ($previous['ema_39_net_advances'] * (1 - $alpha39)) :
            $netAdvances;
        
        // Calculate oscillator
        $oscillator = $ema19 - $ema39;
        
        // Calculate summation index
        $summationIndex = $previous ? 
            $previous['summation_index'] + $oscillator :
            $oscillator;
        
        // Insert into database
        $stmt = $this->pdo->prepare("
            INSERT INTO mcclellan_data 
            (exchange_code, date, advancing_stocks, declining_stocks, net_advances, total_stocks, 
             ema_19_net_advances, ema_39_net_advances, oscillator, summation_index)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                advancing_stocks = VALUES(advancing_stocks),
                declining_stocks = VALUES(declining_stocks),
                net_advances = VALUES(net_advances),
                total_stocks = VALUES(total_stocks),
                ema_19_net_advances = VALUES(ema_19_net_advances),
                ema_39_net_advances = VALUES(ema_39_net_advances),
                oscillator = VALUES(oscillator),
                summation_index = VALUES(summation_index)
        ");
        
        $stmt->execute([
            $exchangeCode, $date, $advancing, $declining, $netAdvances, $totalStocks,
            $ema19, $ema39, $oscillator, $summationIndex
        ]);
    }
    
    /**
     * Calculate moving average statistics
     * @param string $exchangeCode Exchange code
     */
    private function calculateMovingAverageStats($exchangeCode) {
        logMessage("Calculating moving average statistics for {$exchangeCode}", 'INFO');
        
        // Get dates that need calculation
        $stmt = $this->pdo->prepare("
            SELECT DISTINCT date 
            FROM stock_prices 
            WHERE exchange_code = ? 
            AND date NOT IN (
                SELECT date FROM moving_average_stats WHERE exchange_code = ?
            )
            ORDER BY date ASC
        ");
        $stmt->execute([$exchangeCode, $exchangeCode]);
        $dates = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        foreach ($dates as $date) {
            $this->calculateMAStatsForDate($exchangeCode, $date);
        }
        
        logMessage("Calculated MA statistics for " . count($dates) . " days", 'INFO');
    }
    
    /**
     * Calculate moving average statistics for specific date
     * @param string $exchangeCode Exchange code
     * @param string $date Date in Y-m-d format
     */
    private function calculateMAStatsForDate($exchangeCode, $date) {
        // Calculate for each moving average period
        $periods = [20, 50, 200];
        $results = [];
        
        foreach ($periods as $period) {
            $stmt = $this->pdo->prepare("
                SELECT 
                    symbol,
                    close_price,
                    (
                        SELECT AVG(p2.close_price)
                        FROM stock_prices p2
                        WHERE p2.symbol = p1.symbol 
                        AND p2.exchange_code = p1.exchange_code
                        AND p2.date <= p1.date
                        AND p2.date >= DATE_SUB(p1.date, INTERVAL ? DAY)
                    ) as ma_price
                FROM stock_prices p1
                WHERE p1.exchange_code = ? 
                AND p1.date = ?
                HAVING ma_price IS NOT NULL
            ");
            
            $stmt->execute([$period, $exchangeCode, $date]);
            $stocks = $stmt->fetchAll();
            
            if (!empty($stocks)) {
                $aboveMA = 0;
                foreach ($stocks as $stock) {
                    if ($stock['close_price'] > $stock['ma_price']) {
                        $aboveMA++;
                    }
                }
                
                $results["above_ma_{$period}"] = $aboveMA;
                $results["percent_above_ma_{$period}"] = count($stocks) > 0 ? 
                    round(($aboveMA / count($stocks)) * 100, 2) : 0;
            } else {
                $results["above_ma_{$period}"] = 0;
                $results["percent_above_ma_{$period}"] = 0;
            }
        }
        
        // Get total stocks for this date
        $stmt = $this->pdo->prepare("
            SELECT COUNT(*) 
            FROM stock_prices 
            WHERE exchange_code = ? AND date = ?
        ");
        $stmt->execute([$exchangeCode, $date]);
        $totalStocks = $stmt->fetchColumn();
        
        // Insert results
        $stmt = $this->pdo->prepare("
            INSERT INTO moving_average_stats 
            (exchange_code, date, total_stocks, above_ma_20, above_ma_50, above_ma_200, 
             percent_above_ma_20, percent_above_ma_50, percent_above_ma_200)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                total_stocks = VALUES(total_stocks),
                above_ma_20 = VALUES(above_ma_20),
                above_ma_50 = VALUES(above_ma_50),
                above_ma_200 = VALUES(above_ma_200),
                percent_above_ma_20 = VALUES(percent_above_ma_20),
                percent_above_ma_50 = VALUES(percent_above_ma_50),
                percent_above_ma_200 = VALUES(percent_above_ma_200)
        ");
        
        $stmt->execute([
            $exchangeCode, $date, $totalStocks,
            $results['above_ma_20'], $results['above_ma_50'], $results['above_ma_200'],
            $results['percent_above_ma_20'], $results['percent_above_ma_50'], $results['percent_above_ma_200']
        ]);
    }
}

// Command line execution
if (php_sapi_name() === 'cli') {
    $exchangeCode = $argv[1] ?? null;
    
    echo "Starting data update...\n";
    
    $updater = new DataUpdater();
    $updater->updateData($exchangeCode);
    
    echo "Data update completed.\n";
} else {
    // Web execution (for testing)
    if (DEBUG_MODE && isset($_GET['run'])) {
        $exchangeCode = $_GET['exchange'] ?? null;
        
        echo "<pre>";
        echo "Starting data update...\n";
        
        $updater = new DataUpdater();
        $updater->updateData($exchangeCode);
        
        echo "Data update completed.\n";
        echo "</pre>";
    } else {
        echo "This script should be run from command line or with ?run=1 parameter in debug mode.";
    }
}

?>