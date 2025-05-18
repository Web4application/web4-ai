#!/bin/bash

echo "Setting up Web4AI development environment..."

# Check if .env file exists; if not, create it
if [ ! -f /workspace/.env ]; then
    echo "Creating .env file..."
    cp /workspace/.env.example /workspace/.env
fi

echo "Installing Python dependencies..."
pip install -r /workspace/requirements.txt

echo "Installing Node.js dependencies..."
cd /workspace
if [ -f "package.json" ]; then
    npm install
fi

echo "Web4AI environment setup complete."
