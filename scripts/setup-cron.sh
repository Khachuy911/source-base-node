#!/bin/bash

# Get the directory where the setupCron.sh script is located
SCRIPT_DIR=$(dirname "$(realpath "$0")")

# Path to the directory containing the log files
LOG_DIR="$SCRIPT_DIR/../logs"

# Command to find and delete log files older than 7 days
CLEANUP_COMMAND="find $LOG_DIR -type f \\( -name "*.txt" -o -name '*.log' -o -name '*.log.gz' -o -name '*.log.*.gz' \\) -mtime +6 -exec rm {} \\;"

# Command to truncate nginx access log monthly
NGINX_TRUNCATE="truncate -s 0 $LOG_DIR/nginx/access.log"

# Cron schedule (daily at midnight)
DAILY_SCHEDULE="0 0 * * *"
MONTHLY_SCHEDULE="0 0 1 * *"

# Create a new cron job (removing any existing similar cron jobs first)
(crontab -l | grep -v "$CLEANUP_COMMAND" | grep -v "$NGINX_TRUNCATE" ; echo "$DAILY_SCHEDULE $CLEANUP_COMMAND" ; echo "$MONTHLY_SCHEDULE $NGINX_TRUNCATE") | crontab -

echo "Cron job for log cleanup and nginx log truncation have been set up successfully."
