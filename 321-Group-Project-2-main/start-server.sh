#!/bin/bash

# AQE Platform Server Startup Script
echo "🚀 Starting AQE Platform Server..."

# Kill any existing dotnet processes on port 5001
echo "🔧 Cleaning up any existing processes..."
lsof -ti:5001 | xargs kill -9 2>/dev/null || true

# Wait a moment for cleanup
sleep 1

# Navigate to API directory and start server
echo "📁 Navigating to API directory..."
cd "$(dirname "$0")/api"

# Start the server
echo "🌟 Starting .NET server on http://localhost:5001"
echo "📱 Open your browser to: http://localhost:5001"
echo "👨‍🏫 Demo Teacher Login: teacher@demo.com / teacher123"
echo ""
echo "Press Ctrl+C to stop the server"
echo "----------------------------------------"

dotnet run