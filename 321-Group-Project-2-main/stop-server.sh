#!/bin/bash

# AQE Platform Server Stop Script
echo "🛑 Stopping AQE Platform Server..."

# Kill any dotnet run processes
echo "🔧 Stopping dotnet processes..."
pkill -f "dotnet run" 2>/dev/null || true

# Kill any processes on port 5001
echo "🔧 Freeing port 5001..."
lsof -ti:5001 | xargs kill -9 2>/dev/null || true

echo "✅ Server stopped successfully!"