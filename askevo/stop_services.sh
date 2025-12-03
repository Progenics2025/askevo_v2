#!/bin/bash

# Stop All Services Script for Progenics AI Askevo

echo "🛑 Stopping Progenics AI Services..."

BASE_DIR="/home/progenics-bioinfo/genomics_project/askevo_v2/askevo"

# Function to kill process on port
kill_port() {
    local port=$1
    local service=$2
    if lsof -ti:$port > /dev/null 2>&1; then
        echo "  Stopping $service on port $port..."
        lsof -ti:$port | xargs kill -9 2>/dev/null
        sleep 1
        echo "  ✓ $service stopped"
    else
        echo "  ℹ  $service was not running on port $port"
    fi
}

# Stop Frontend (Vite)
kill_port 5173 "Frontend"

# Stop Backend
kill_port 3001 "Backend"

# Note: We don't stop Ollama as it might be used by other applications

echo ""
echo "✅ All services stopped!"
echo ""
echo "Note: Ollama (port 11434) was not stopped as it may be used by other applications."
echo "To stop Ollama manually, run: sudo systemctl stop ollama (or kill the process)"
