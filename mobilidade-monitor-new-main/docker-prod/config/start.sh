#!/bin/sh

# Change to the nginx html directory
cd /usr/share/nginx/html


# Check if env.sh exists and is executable
if [ -f "./env.sh" ] && [ -x "./env.sh" ]; then
    echo "Executing env.sh..."
    ./env.sh
else
    echo "env.sh not found or not executable, skipping environment setup"
fi

# Start nginx
echo "Starting nginx..."
nginx -g "daemon off;" 