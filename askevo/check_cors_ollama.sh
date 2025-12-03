#!/bin/bash

# CORS and Ollama Diagnostic Script

echo "=============================================="
echo "🔍 CORS and Ollama Connection Diagnostics"
echo "=============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "1️⃣ Checking Backend Server..."
echo "------------------------------"
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Backend is running on port 3001"
    echo "   Testing health endpoint:"
    curl -s http://localhost:3001/api/health | head -n 5
else
    echo -e "${RED}✗${NC} Backend is NOT accessible on port 3001"
fi
echo ""

echo "2️⃣ Checking Ollama Server..."
echo "----------------------------"
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Ollama is running on port 11434"
    echo "   Available models:"
    curl -s http://localhost:11434/api/tags | grep -o '"name":"[^"]*"' | head -n 3
else
    echo -e "${RED}✗${NC} Ollama is NOT accessible on port 11434"
    echo "   Start Ollama with: ollama serve"
fi
echo ""

echo "3️⃣ Checking Frontend (Vite)..."
echo "-------------------------------"
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Frontend is running on port 5173"
elif curl -s http://192.168.29.11:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Frontend is running on http://192.168.29.11:5173"
else
    echo -e "${RED}✗${NC} Frontend is NOT accessible"
    echo "   Start with: cd /home/progenics-bioinfo/genomics_project/askevo_v2/askevo && npm run dev"
fi
echo ""

echo "4️⃣ Checking Backend CORS Configuration..."
echo "------------------------------------------"
echo "Checking recent backend logs for CORS messages:"
if [ -f "/home/progenics-bioinfo/genomics_project/askevo_v2/askevo/backend/backend.log" ]; then
    RECENT_CORS=$(tail -20 /home/progenics-bioinfo/genomics_project/askevo_v2/askevo/backend/backend.log | grep -E "(CORS|Development mode|Allowed CORS)" | tail -5)
    if [ ! -z "$RECENT_CORS" ]; then
        echo "$RECENT_CORS"
    else
        echo "   No recent CORS logs found"
    fi
else
    echo "   Backend log file not found"
fi
echo ""

echo "5️⃣ Checking Network Configuration..."
echo "-------------------------------------"
echo "Local IP addresses:"
hostname -I | tr ' ' '\n' | head -5
echo ""
echo "Ports in use:"
ss -tuln | grep -E ":(3001|5173|11434)" || echo "   No services detected on target ports"
echo ""

echo "6️⃣ Environment Variables Check..."
echo "----------------------------------"
if [ -f "/home/progenics-bioinfo/genomics_project/askevo_v2/askevo/.env" ]; then
    echo -e "${GREEN}✓${NC} Frontend .env exists"
    echo "   VITE_OLLAMA_URL: $(grep VITE_OLLAMA_URL /home/progenics-bioinfo/genomics_project/askevo_v2/askevo/.env | cut -d'=' -f2)"
    echo "   VITE_API_URL: $(grep VITE_API_URL /home/progenics-bioinfo/genomics_project/askevo_v2/askevo/.env | head -1 | cut -d'=' -f2)"
else
    echo -e "${RED}✗${NC} Frontend .env missing"
fi
echo ""

echo "7️⃣ Testing Vite Proxy Configuration..."
echo "---------------------------------------"
echo "Checking if Vite config has Ollama proxy:"
if grep -q "/ollama" /home/progenics-bioinfo/genomics_project/askevo_v2/askevo/vite.config.js; then
    echo -e "${GREEN}✓${NC} Ollama proxy configured in vite.config.js"
else
    echo -e "${YELLOW}⚠${NC}  Ollama proxy NOT found in vite.config.js"
fi
echo ""

echo "=============================================="
echo "📊 Summary"
echo "=============================================="
echo ""

ALL_GOOD=true

# Check backend
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Backend: Running"
else
    echo -e "${RED}✗${NC} Backend: Not Running"
    ALL_GOOD=false
fi

# Check Ollama
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Ollama: Running"
else
    echo -e "${RED}✗${NC} Ollama: Not Running"
    ALL_GOOD=false
fi

# Check Frontend
if curl -s http://localhost:5173 > /dev/null 2>&1 || curl -s http://192.168.29.11:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Frontend: Running"
else
    echo -e "${RED}✗${NC} Frontend: Not Running"
    ALL_GOOD=false
fi

# Check proxy
if grep -q "/ollama" /home/progenics-bioinfo/genomics_project/askevo_v2/askevo/vite.config.js; then
    echo -e "${GREEN}✓${NC} Vite Proxy: Configured"
else
    echo -e "${YELLOW}⚠${NC}  Vite Proxy: Not Configured"
fi

echo ""
if [ "$ALL_GOOD" = true ]; then
    echo -e "${GREEN}✅ All critical services are running!${NC}"
    echo ""
    echo "🌐 Access your application at:"
    echo "   http://localhost:5173"
    echo "   http://$(hostname -I | awk '{print $1}'):5173"
    echo ""
    echo "🔧 If you still see CORS errors:"
    echo "   1. RESTART the frontend: Ctrl+C then 'npm run dev'"
    echo "   2. Hard refresh browser: Ctrl+Shift+R"
    echo "   3. Check browser console for specific errors"
else
    echo -e "${YELLOW}⚠️  Some services are not running${NC}"
    echo ""
    echo "Quick fix:"
    echo "   cd /home/progenics-bioinfo/genomics_project/askevo_v2/askevo"
    echo "   bash start_all_services.sh"
fi
echo "=============================================="
