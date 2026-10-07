#!/bin/sh

# Change to the nginx html directory
cd /usr/share/nginx/html

# Check if .env exists
if [ ! -f "./.env" ]; then
    echo "Warning: .env file not found. Environment variables will not be injected."
    echo "Make sure to mount the .env file as a volume:"
    echo "  docker-compose: - ./.env:/usr/share/nginx/html/.env:ro"
    echo "  docker run: -v \$(pwd)/.env:/usr/share/nginx/html/.env:ro"
else
    echo ".env file found, proceeding with environment setup..."
fi

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