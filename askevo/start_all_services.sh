#!/bin/bash

# Quick Start Script for Progenics AI Askevo
# This script will start all services and verify they're running correctly

set -e  # Exit on error

echo "========================================="
echo "🚀 Progenics AI Askevo - Quick Start"
echo "========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base directory
BASE_DIR="/home/progenics-bioinfo/genomics_project/askevo_v2/askevo"
BACKEND_DIR="$BASE_DIR/backend"

# Function to check if a port is in use
check_port() {
    local port=$1
    local service=$2
    if ss -tuln | grep -q ":$port "; then
        echo -e "${GREEN}✓${NC} $service is running on port $port"
        return 0
    else
        echo -e "${RED}✗${NC} $service is NOT running on port $port"
        return 1
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    echo "  Attempting to free port $port..."
    lsof -ti:$port | xargs kill -9 2>/dev/null || true
    sleep 1
}

echo "Step 1: Checking Prerequisites"
echo "--------------------------------"

# Check if Node.js is installed
if command -v node &> /dev/null; then
    echo -e "${GREEN}✓${NC} Node.js $(node -v) installed"
else
    echo -e "${RED}✗${NC} Node.js is not installed"
    exit 1
fi

# Check if npm is installed
if command -v npm &> /dev/null; then
    echo -e "${GREEN}✓${NC} npm $(npm -v) installed"
else
    echo -e "${RED}✗${NC} npm is not installed"
    exit 1
fi

# Check if .env files exist
if [ -f "$BASE_DIR/.env" ]; then
    echo -e "${GREEN}✓${NC} Frontend .env file exists"
else
    echo -e "${YELLOW}⚠${NC}  Frontend .env file missing (should have been created)"
fi

if [ -f "$BACKEND_DIR/.env" ]; then
    echo -e "${GREEN}✓${NC} Backend .env file exists"
else
    echo -e "${RED}✗${NC} Backend .env file missing"
    exit 1
fi

echo ""
echo "Step 2: Checking Current Service Status"
echo "----------------------------------------"

BACKEND_RUNNING=false
FRONTEND_RUNNING=false
OLLAMA_RUNNING=false

check_port 3001 "Backend API" && BACKEND_RUNNING=true || true
check_port 5173 "Frontend (Vite)" && FRONTEND_RUNNING=true || true
check_port 11434 "Ollama" && OLLAMA_RUNNING=true || true

echo ""
echo "Step 3: Service Actions"
echo "-----------------------"

# Ask user what to do if services are already running
if [ "$BACKEND_RUNNING" = true ] || [ "$FRONTEND_RUNNING" = true ]; then
    echo -e "${YELLOW}Some services are already running.${NC}"
    echo "Options:"
    echo "  1) Restart all services (kill existing and start new)"
    echo "  2) Only start missing services"
    echo "  3) Exit and manage manually"
    read -p "Choose option (1-3): " option
    
    case $option in
        1)
            echo "Restarting all services..."
            [ "$BACKEND_RUNNING" = true ] && kill_port 3001
            [ "$FRONTEND_RUNNING" = true ] && kill_port 5173
            ;;
        2)
            echo "Will only start missing services..."
            ;;
        3)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo "Invalid option. Exiting..."
            exit 1
            ;;
    esac
fi

echo ""
echo "Step 4: Starting Services"
echo "-------------------------"

# Function to start backend
start_backend() {
    if [ "$BACKEND_RUNNING" = false ]; then
        echo "Starting Backend Server..."
        cd "$BACKEND_DIR"
        
        # Check if node_modules exists
        if [ ! -d "node_modules" ]; then
            echo "  Installing backend dependencies..."
            npm install
        fi
        
        # Start backend in background
        nohup npm run dev > "$BACKEND_DIR/backend.log" 2>&1 &
        BACKEND_PID=$!
        echo "  Backend started with PID: $BACKEND_PID"
        sleep 3
        
        if check_port 3001 "Backend API"; then
            echo -e "${GREEN}  Backend successfully started!${NC}"
        else
            echo -e "${RED}  Backend failed to start. Check $BACKEND_DIR/backend.log${NC}"
            exit 1
        fi
    else
        echo -e "${GREEN}Backend is already running${NC}"
    fi
}

# Function to start frontend
start_frontend() {
    if [ "$FRONTEND_RUNNING" = false ]; then
        echo "Starting Frontend (Vite)..."
        cd "$BASE_DIR"
        
        # Check if node_modules exists
        if [ ! -d "node_modules" ]; then
            echo "  Installing frontend dependencies..."
            npm install
        fi
        
        # Start frontend in background
        nohup npm run dev > "$BASE_DIR/frontend.log" 2>&1 &
        FRONTEND_PID=$!
        echo "  Frontend started with PID: $FRONTEND_PID"
        sleep 5
        
        if check_port 5173 "Frontend (Vite)"; then
            echo -e "${GREEN}  Frontend successfully started!${NC}"
        else
            echo -e "${RED}  Frontend failed to start. Check $BASE_DIR/frontend.log${NC}"
            exit 1
        fi
    else
        echo -e "${GREEN}Frontend is already running${NC}"
    fi
}

# Check Ollama
if [ "$OLLAMA_RUNNING" = false ]; then
    echo -e "${YELLOW}⚠  Ollama is not running on port 11434${NC}"
    echo "   You need to start Ollama manually:"
    echo "   $ ollama serve"
else
    echo -e "${GREEN}✓ Ollama is running${NC}"
fi

# Start services
start_backend
echo ""
start_frontend

echo ""
echo "Step 5: Verification"
echo "--------------------"

sleep 2

# Final check
echo "Checking all services..."
ALL_GOOD=true

check_port 3001 "Backend API" || ALL_GOOD=false
check_port 5173 "Frontend (Vite)" || ALL_GOOD=false
check_port 11434 "Ollama" || ALL_GOOD=false

echo ""
echo "Step 6: Testing Connectivity"
echo "-----------------------------"

# Test backend health endpoint
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Backend health check: OK"
else
    echo -e "${RED}✗${NC} Backend health check: FAILED"
    ALL_GOOD=false
fi

# Test Ollama
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Ollama connectivity: OK"
else
    echo -e "${YELLOW}⚠${NC}  Ollama connectivity: FAILED (but may work when started)"
fi

echo ""
echo "========================================="
if [ "$ALL_GOOD" = true ]; then
    echo -e "${GREEN}✅ ALL SERVICES RUNNING SUCCESSFULLY!${NC}"
    echo ""
    echo "🌐 Access your application at:"
    echo "   Local:    http://localhost:5173"
    echo "   Network:  http://$(hostname -I | awk '{print $1}'):5173"
    echo ""
    echo "📊 Service URLs:"
    echo "   Frontend:  http://localhost:5173"
    echo "   Backend:   http://localhost:3001"
    echo "   Ollama:    http://localhost:11434"
    echo ""
    echo "📝 Logs:"
    echo "   Backend:   tail -f $BACKEND_DIR/backend.log"
    echo "   Frontend:  tail -f $BASE_DIR/frontend.log"
else
    echo -e "${RED}⚠️  SOME SERVICES FAILED TO START${NC}"
    echo ""
    echo "Check the logs for more information:"
    echo "   Backend:   cat $BACKEND_DIR/backend.log"
    echo "   Frontend:  cat $BASE_DIR/frontend.log"
fi
echo "========================================="

# Save PIDs for easy stopping
echo "BACKEND_PID=${BACKEND_PID:-}" > "$BASE_DIR/.service_pids"
echo "FRONTEND_PID=${FRONTEND_PID:-}" >> "$BASE_DIR/.service_pids"

echo ""
echo "To stop all services, run:"
echo "  $ bash $BASE_DIR/stop_services.sh"
