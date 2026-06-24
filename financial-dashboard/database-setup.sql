-- Financial Dashboard Database Setup
-- Run this SQL script to create the required database tables

-- Create the database (run this first)
CREATE DATABASE IF NOT EXISTS financial_dashboard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE financial_dashboard;

-- Table to store exchange information
CREATE TABLE IF NOT EXISTS exchanges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    exchange_code VARCHAR(10) NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table to store index constituents
CREATE TABLE IF NOT EXISTS index_constituents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exchange_code VARCHAR(10) NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    name VARCHAR(100),
    weight DECIMAL(5,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_exchange_symbol (exchange_code, symbol),
    INDEX idx_active (is_active)
);

-- Table to store daily stock prices
CREATE TABLE IF NOT EXISTS stock_prices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    exchange_code VARCHAR(10) NOT NULL,
    date DATE NOT NULL,
    open_price DECIMAL(12,4),
    high_price DECIMAL(12,4),
    low_price DECIMAL(12,4),
    close_price DECIMAL(12,4) NOT NULL,
    volume BIGINT,
    adjusted_close DECIMAL(12,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_symbol_date (symbol, exchange_code, date),
    INDEX idx_symbol_date (symbol, date),
    INDEX idx_exchange_date (exchange_code, date)
);

-- Table to store calculated McClellan indicators
CREATE TABLE IF NOT EXISTS mcclellan_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    exchange_code VARCHAR(10) NOT NULL,
    date DATE NOT NULL,
    advancing_stocks INT NOT NULL DEFAULT 0,
    declining_stocks INT NOT NULL DEFAULT 0,
    net_advances INT NOT NULL DEFAULT 0,
    total_stocks INT NOT NULL DEFAULT 0,
    ema_19_net_advances DECIMAL(10,4),
    ema_39_net_advances DECIMAL(10,4),
    oscillator DECIMAL(10,4),
    summation_index DECIMAL(12,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_exchange_date (exchange_code, date),
    INDEX idx_exchange_date (exchange_code, date)
);

-- Table to store moving average statistics
CREATE TABLE IF NOT EXISTS moving_average_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    exchange_code VARCHAR(10) NOT NULL,
    date DATE NOT NULL,
    total_stocks INT NOT NULL DEFAULT 0,
    above_ma_20 INT NOT NULL DEFAULT 0,
    above_ma_50 INT NOT NULL DEFAULT 0,
    above_ma_200 INT NOT NULL DEFAULT 0,
    percent_above_ma_20 DECIMAL(5,2) NOT NULL DEFAULT 0,
    percent_above_ma_50 DECIMAL(5,2) NOT NULL DEFAULT 0,
    percent_above_ma_200 DECIMAL(5,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_exchange_date (exchange_code, date),
    INDEX idx_exchange_date (exchange_code, date)
);

-- Table to store API call logs for rate limiting
CREATE TABLE IF NOT EXISTS api_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    endpoint VARCHAR(255) NOT NULL,
    request_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response_code INT,
    response_time_ms INT,
    error_message TEXT,
    INDEX idx_request_time (request_time)
);

-- Table to store system configuration and cache
CREATE TABLE IF NOT EXISTS system_cache (
    cache_key VARCHAR(100) PRIMARY KEY,
    cache_value TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert initial exchange data
INSERT INTO exchanges (code, name, symbol, exchange_code, timezone) VALUES
('FTSE', 'FTSE 100', 'FTSE.INDX', 'LSE', 'Europe/London'),
('TSX', 'TSX Composite', 'GSPTSE.INDX', 'TO', 'America/Toronto'),
('HSI', 'Hang Seng Index', 'HSI.INDX', 'HK', 'Asia/Hong_Kong'),
('KLCI', 'FTSE Bursa Malaysia KLCI', 'KLCI.INDX', 'KLSE', 'Asia/Kuala_Lumpur'),
('N225', 'Nikkei 225', 'N225.INDX', 'JPX', 'Asia/Tokyo')
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    symbol = VALUES(symbol),
    exchange_code = VALUES(exchange_code),
    timezone = VALUES(timezone);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stock_prices_date ON stock_prices(date);
CREATE INDEX IF NOT EXISTS idx_mcclellan_date ON mcclellan_data(date);
CREATE INDEX IF NOT EXISTS idx_ma_stats_date ON moving_average_stats(date);

-- Create a view for the latest McClellan data
CREATE OR REPLACE VIEW latest_mcclellan_data AS
SELECT 
    m.*,
    e.name as exchange_name
FROM mcclellan_data m
JOIN exchanges e ON m.exchange_code = e.code
WHERE m.date = (
    SELECT MAX(date) 
    FROM mcclellan_data m2 
    WHERE m2.exchange_code = m.exchange_code
);

-- Create a view for the latest moving average stats
CREATE OR REPLACE VIEW latest_ma_stats AS
SELECT 
    ma.*,
    e.name as exchange_name
FROM moving_average_stats ma
JOIN exchanges e ON ma.exchange_code = e.code
WHERE ma.date = (
    SELECT MAX(date) 
    FROM moving_average_stats ma2 
    WHERE ma2.exchange_code = ma.exchange_code
);

-- Create a stored procedure to clean old data (optional)
DELIMITER //
CREATE PROCEDURE CleanOldData(IN days_to_keep INT)
BEGIN
    DECLARE exit handler for sqlexception
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Clean old API logs (keep only last 30 days)
    DELETE FROM api_logs 
    WHERE request_time < DATE_SUB(NOW(), INTERVAL 30 DAY);
    
    -- Clean expired cache entries
    DELETE FROM system_cache 
    WHERE expires_at < NOW();
    
    -- Optionally clean very old stock prices (keep based on days_to_keep parameter)
    IF days_to_keep > 0 THEN
        DELETE FROM stock_prices 
        WHERE date < DATE_SUB(CURDATE(), INTERVAL days_to_keep DAY);
        
        DELETE FROM mcclellan_data 
        WHERE date < DATE_SUB(CURDATE(), INTERVAL days_to_keep DAY);
        
        DELETE FROM moving_average_stats 
        WHERE date < DATE_SUB(CURDATE(), INTERVAL days_to_keep DAY);
    END IF;
    
    COMMIT;
END //
DELIMITER ;

-- Show table creation summary
SELECT 
    'Database setup completed successfully!' as status,
    COUNT(*) as tables_created
FROM information_schema.tables 
WHERE table_schema = 'financial_dashboard';