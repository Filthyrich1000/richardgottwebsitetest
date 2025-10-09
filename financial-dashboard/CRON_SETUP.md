# 🕐 **Timezone-Aware Cron Job Setup**

## **Optimal Update Schedule**

Instead of one daily update, set up **5 separate cron jobs** that update each exchange 30 minutes after their market closes:

### **Method 1: Individual Exchange Updates** ⭐ **RECOMMENDED**

Add these **5 cron jobs** in your EcoHosting cPanel:

```bash
# Nikkei 225 - Updates at 06:30 UTC (15:30 JST + 30min)
30 6 * * 1-5 /usr/bin/php /home/yourusername/public_html/dashboard/scripts/update-data.php N225

# Hang Seng - Updates at 08:30 UTC (16:30 HKT + 30min)  
30 8 * * 1-5 /usr/bin/php /home/yourusername/public_html/dashboard/scripts/update-data.php HSI

# Malaysia KLCI - Updates at 09:30 UTC (17:30 MYT + 30min)
30 9 * * 1-5 /usr/bin/php /home/yourusername/public_html/dashboard/scripts/update-data.php KLCI

# FTSE 100 - Updates at 17:00 UTC (17:00 GMT + 30min)
0 17 * * 1-5 /usr/bin/php /home/yourusername/public_html/dashboard/scripts/update-data.php FTSE

# TSX - Updates at 21:30 UTC (16:30 EST + 30min) 
30 21 * * 1-5 /usr/bin/php /home/yourusername/public_html/dashboard/scripts/update-data.php TSX
```

### **Method 2: Smart Auto-Update** (Alternative)

Or use **one smart cron job** that checks all exchanges every hour:

```bash
# Check all exchanges every hour and update when ready
0 * * * * /usr/bin/php /home/yourusername/public_html/dashboard/scripts/timezone-aware-update.php auto
```

## **Cron Job Format Explanation**

```
┌───────────── minute (0 - 59)
│ ┌─────────── hour (0 - 23)
│ │ ┌───────── day of month (1 - 31)
│ │ │ ┌─────── month (1 - 12)
│ │ │ │ ┌───── day of week (0 - 7, Sunday = 0 or 7)
│ │ │ │ │
* * * * *
```

- `1-5` = Monday to Friday (weekdays only)
- `*` = Every day/month/etc.

## **Setting Up in EcoHosting cPanel**

### **Step 1: Access Cron Jobs**
1. Log into your EcoHosting cPanel
2. Find **"Cron Jobs"** (usually in Advanced section)
3. Click **"Create Cron Job"**

### **Step 2: Add Each Cron Job**

For **Nikkei 225** (first to close):
```
Minute: 30
Hour: 6  
Day: *
Month: *
Weekday: 1-5
Command: /usr/bin/php /home/yourusername/public_html/dashboard/scripts/update-data.php N225
```

For **Hang Seng**:
```
Minute: 30
Hour: 8
Day: *
Month: *  
Weekday: 1-5
Command: /usr/bin/php /home/yourusername/public_html/dashboard/scripts/update-data.php HSI
```

For **Malaysia**:
```
Minute: 30
Hour: 9
Day: *
Month: *
Weekday: 1-5  
Command: /usr/bin/php /home/yourusername/public_html/dashboard/scripts/update-data.php KLCI
```

For **FTSE**:
```
Minute: 0
Hour: 17
Day: *
Month: *
Weekday: 1-5
Command: /usr/bin/php /home/yourusername/public_html/dashboard/scripts/update-data.php FTSE
```

For **TSX** (last to close):
```
Minute: 30  
Hour: 21
Day: *
Month: *
Weekday: 1-5
Command: /usr/bin/php /home/yourusername/public_html/dashboard/scripts/update-data.php TSX
```

### **Step 3: Find Your Correct Path**

Replace `/home/yourusername/public_html/dashboard/` with your actual path:

1. In **File Manager**, navigate to your dashboard folder
2. Look at the **address bar** for the full path
3. Common paths:
   - `/home/yourusername/public_html/dashboard/`
   - `/home/yourusername/domains/yoursite.com/public_html/dashboard/`

## **Benefits of This Approach**

✅ **Fresh Data**: Each exchange updates within 30 minutes of market close
✅ **Efficient**: Only processes data when markets actually close  
✅ **Global Coverage**: Handles all timezones automatically
✅ **Weekday Only**: Skips weekends when markets are closed
✅ **Staggered Load**: Spreads API calls throughout the day

## **Timeline Example (UTC)**

```
06:30 UTC - Nikkei 225 updates    (3:30 PM Tokyo close + 30min)
08:30 UTC - Hang Seng updates     (4:30 PM Hong Kong close + 30min)  
09:30 UTC - Malaysia updates      (5:30 PM Kuala Lumpur close + 30min)
17:00 UTC - FTSE updates          (5:00 PM London close + 30min)
21:30 UTC - TSX updates           (4:30 PM Toronto close + 30min)
```

## **Testing Your Setup**

### **Test Individual Updates**
```bash
# Test Nikkei update
php /path/to/dashboard/scripts/update-data.php N225

# Test auto-update system  
php /path/to/dashboard/scripts/timezone-aware-update.php auto

# Check exchange status
php /path/to/dashboard/scripts/timezone-aware-update.php status
```

### **Web Testing**
- Visit: `yoursite.com/dashboard/scripts/timezone-aware-update.php?run=1&exchange=status`
- Shows current status of all exchanges

## **Daylight Saving Time Notes**

⚠️ **Important**: London and Toronto observe daylight saving time:

- **London**: GMT (winter) / BST (summer) - 1 hour difference
- **Toronto**: EST (winter) / EDT (summer) - 1 hour difference  
- **Asia exchanges**: No daylight saving time

You may need to adjust FTSE and TSX cron times twice per year, or use the smart auto-update method which handles this automatically.

## **Monitoring**

Check your cron job logs in cPanel to ensure they're running successfully. You should see:
- 5 successful executions per weekday
- No weekend executions  
- Fresh data in your dashboard after each market closes

**Your dashboard will now have the freshest possible data from each global exchange!** 🌍📊