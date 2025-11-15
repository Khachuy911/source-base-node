#!/bin/bash
# Set permissions for the logs directory in NodeJS service
chmod -R 777 /app/logs
# Set permissions for the logs directory in C# service
chmod -R 777 /app/Files/Logs
# Now execute other commands (the main command defined in the Dockerfile)
exec "$@"
