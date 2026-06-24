<?php
/**
 * Timezone-Aware Data Update Script
 * 
 * This enhanced script checks if it's the right time to update each exchange
 * based on their market closing times and timezones.
 * 
 * Usage: 
 * - php timezone-aware-update.php [exchange_code]
 * - php timezone-aware-update.php auto (checks all exchanges automatically)
 */

require_once '../config.php';
require_once '../api/eodhd-client.php';
require_once 'update-data.php';

class TimezoneAwareUpdater extends DataUpdater {
    
    private $marketSchedule = [
        'N225' => [
            'timezone' => 'Asia/Tokyo',
            'close_time' => '15:00',
            'update_delay_minutes' => 30,
            'name' => 'Nikkei 225'
        ],
        'HSI' => [
            'timezone' => 'Asia/Hong_Kong',
            'close_time' => '16:00', 
            'update_delay_minutes' => 30,
            'name' => 'Hang Seng Index'
        ],
        'KLCI' => [
            'timezone' => 'Asia/Kuala_Lumpur',
            'close_time' => '17:00',
            'update_delay_minutes' => 30,
            'name' => 'FTSE Bursa Malaysia KLCI'
        ],
        'FTSE' => [
            'timezone' => 'Europe/London',
            'close_time' => '16:30',
            'update_delay_minutes' => 30,
            'name' => 'FTSE 100'
        ],
        'TSX' => [
            'timezone' => 'America/Toronto',
            'close_time' => '16:00',
            'update_delay_minutes' => 30,
            'name' => 'TSX Composite'
        ]
    ];
    
    /**
     * Check if it's time to update a specific exchange
     * @param string $exchangeCode Exchange code
     * @return bool True if it's time to update
     */
    public function isUpdateTime($exchangeCode) {
        if (!isset($this->marketSchedule[$exchangeCode])) {
            return false;
        }
        
        $schedule = $this->marketSchedule[$exchangeCode];
        
        // Get current time in exchange timezone
        $exchangeTimezone = new DateTimeZone($schedule['timezone']);
        $now = new DateTime('now', $exchangeTimezone);
        
        // Parse market close time
        $closeTime = DateTime::createFromFormat('H:i', $schedule['close_time'], $exchangeTimezone);
        $closeTime->setDate($now->format('Y'), $now->format('m'), $now->format('d'));
        
        // Calculate update time (close + delay)
        $updateTime = clone $closeTime;
        $updateTime->add(new DateInterval('PT' . $schedule['update_delay_minutes'] . 'M'));
        
        // Check if we're in the update window (update time ± 15 minutes)
        $windowStart = clone $updateTime;
        $windowStart->sub(new DateInterval('PT15M'));
        
        $windowEnd = clone $updateTime;
        $windowEnd->add(new DateInterval('PT15M'));
        
        $isWeekday = $now->format('N') <= 5; // Monday = 1, Sunday = 7
        $isInWindow = $now >= $windowStart && $now <= $windowEnd;
        
        return $isWeekday && $isInWindow;
    }
    
    /**
     * Check if exchange is closed today (weekend or holiday)
     * @param string $exchangeCode Exchange code
     * @return bool True if market is closed
     */
    public function isMarketClosed($exchangeCode) {
        if (!isset($this->marketSchedule[$exchangeCode])) {
            return true;
        }
        
        $schedule = $this->marketSchedule[$exchangeCode];
        $exchangeTimezone = new DateTimeZone($schedule['timezone']);
        $now = new DateTime('now', $exchangeTimezone);
        
        // Check if it's weekend
        $dayOfWeek = $now->format('N'); // 1 = Monday, 7 = Sunday
        
        if ($dayOfWeek > 5) { // Saturday or Sunday
            return true;
        }
        
        // TODO: Add holiday checking logic here if needed
        // You could maintain a holidays table or use an API
        
        return false;
    }
    
    /**
     * Get next update time for an exchange
     * @param string $exchangeCode Exchange code
     * @return string Next update time in exchange timezone
     */
    public function getNextUpdateTime($exchangeCode) {
        if (!isset($this->marketSchedule[$exchangeCode])) {
            return 'Unknown';
        }
        
        $schedule = $this->marketSchedule[$exchangeCode];
        $exchangeTimezone = new DateTimeZone($schedule['timezone']);
        $now = new DateTime('now', $exchangeTimezone);
        
        // Calculate next update time
        $closeTime = DateTime::createFromFormat('H:i', $schedule['close_time'], $exchangeTimezone);
        $closeTime->setDate($now->format('Y'), $now->format('m'), $now->format('d'));
        
        $updateTime = clone $closeTime;
        $updateTime->add(new DateInterval('PT' . $schedule['update_delay_minutes'] . 'M'));
        
        // If update time has passed today, move to next business day
        if ($now > $updateTime || $now->format('N') > 5) {
            do {
                $updateTime->add(new DateInterval('P1D'));
            } while ($updateTime->format('N') > 5); // Skip weekends
        }
        
        return $updateTime->format('Y-m-d H:i T');
    }
    
    /**
     * Auto-update exchanges that are ready
     */
    public function autoUpdate() {
        $updatedExchanges = [];
        $skippedExchanges = [];
        
        foreach ($this->marketSchedule as $exchangeCode => $schedule) {
            try {
                if ($this->isMarketClosed($exchangeCode)) {
                    $skippedExchanges[] = "{$exchangeCode} (market closed)";
                    continue;
                }
                
                if ($this->isUpdateTime($exchangeCode)) {
                    logMessage("Auto-updating {$exchangeCode} - market close time reached", 'INFO');
                    $this->updateData($exchangeCode);
                    $updatedExchanges[] = $exchangeCode;
                } else {
                    $nextUpdate = $this->getNextUpdateTime($exchangeCode);
                    $skippedExchanges[] = "{$exchangeCode} (next: {$nextUpdate})";
                }
                
            } catch (Exception $e) {
                logMessage("Error in auto-update for {$exchangeCode}: " . $e->getMessage(), 'ERROR');
                $skippedExchanges[] = "{$exchangeCode} (error)";
            }
        }
        
        return [
            'updated' => $updatedExchanges,
            'skipped' => $skippedExchanges
        ];
    }
    
    /**
     * Get status of all exchanges
     */
    public function getExchangeStatus() {
        $status = [];
        
        foreach ($this->marketSchedule as $exchangeCode => $schedule) {
            $exchangeTimezone = new DateTimeZone($schedule['timezone']);
            $now = new DateTime('now', $exchangeTimezone);
            
            $status[$exchangeCode] = [
                'name' => $schedule['name'],
                'timezone' => $schedule['timezone'],
                'current_time' => $now->format('Y-m-d H:i:s T'),
                'market_close' => $schedule['close_time'],
                'is_market_closed' => $this->isMarketClosed($exchangeCode),
                'is_update_time' => $this->isUpdateTime($exchangeCode),
                'next_update' => $this->getNextUpdateTime($exchangeCode)
            ];
        }
        
        return $status;
    }
}

// Command line execution
if (php_sapi_name() === 'cli') {
    $exchangeCode = $argv[1] ?? 'auto';
    
    echo "Timezone-Aware Financial Data Updater\n";
    echo "=====================================\n\n";
    
    $updater = new TimezoneAwareUpdater();
    
    if ($exchangeCode === 'auto') {
        echo "Running auto-update (checking all exchanges)...\n\n";
        
        $result = $updater->autoUpdate();
        
        if (!empty($result['updated'])) {
            echo "✅ Updated exchanges: " . implode(', ', $result['updated']) . "\n";
        }
        
        if (!empty($result['skipped'])) {
            echo "⏭️  Skipped exchanges: " . implode(', ', $result['skipped']) . "\n";
        }
        
        if (empty($result['updated']) && empty($result['skipped'])) {
            echo "ℹ️  No exchanges needed updating at this time.\n";
        }
        
    } elseif ($exchangeCode === 'status') {
        echo "Exchange Status Report:\n";
        echo "======================\n\n";
        
        $status = $updater->getExchangeStatus();
        
        foreach ($status as $code => $info) {
            echo "{$code} ({$info['name']}):\n";
            echo "  Current Time: {$info['current_time']}\n";
            echo "  Market Close: {$info['market_close']} {$info['timezone']}\n";
            echo "  Market Status: " . ($info['is_market_closed'] ? 'CLOSED' : 'OPEN') . "\n";
            echo "  Update Ready: " . ($info['is_update_time'] ? 'YES' : 'NO') . "\n";
            echo "  Next Update: {$info['next_update']}\n\n";
        }
        
    } else {
        // Update specific exchange
        echo "Updating specific exchange: {$exchangeCode}\n\n";
        
        if ($updater->isMarketClosed($exchangeCode)) {
            echo "⚠️  Market is closed for {$exchangeCode}\n";
        } else {
            $updater->updateData($exchangeCode);
            echo "✅ Update completed for {$exchangeCode}\n";
        }
    }
    
} else {
    // Web execution
    if (DEBUG_MODE && isset($_GET['run'])) {
        $exchangeCode = $_GET['exchange'] ?? 'auto';
        
        header('Content-Type: text/plain');
        
        echo "Timezone-Aware Financial Data Updater\n";
        echo "=====================================\n\n";
        
        $updater = new TimezoneAwareUpdater();
        
        if ($exchangeCode === 'status') {
            $status = $updater->getExchangeStatus();
            
            foreach ($status as $code => $info) {
                echo "{$code}: {$info['current_time']} | ";
                echo ($info['is_update_time'] ? 'READY' : 'WAITING') . " | ";
                echo "Next: {$info['next_update']}\n";
            }
        } else {
            $result = $updater->autoUpdate();
            
            if (!empty($result['updated'])) {
                echo "Updated: " . implode(', ', $result['updated']) . "\n";
            }
            if (!empty($result['skipped'])) {
                echo "Skipped: " . implode(', ', $result['skipped']) . "\n";
            }
        }
    } else {
        echo "Access this script from command line or with ?run=1 parameter in debug mode.";
    }
}

?>