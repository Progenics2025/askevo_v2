#!/bin/bash

echo "🔍 PROGENICS AI - INTEGRATION VERIFICATION SCRIPT"
echo "=================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check MySQL
echo "1️⃣  Checking MySQL Connection..."
if mysql -u remote_user -p"Prolab#05" -e "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ MySQL is running${NC}"
else
    echo -e "${RED}✗ MySQL is NOT running${NC}"
    echo "  Start MySQL and try again"
fi
echo ""

# Check Ollama
echo "2️⃣  Checking Ollama Server..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Ollama is running${NC}"
    MODELS=$(curl -s http://localhost:11434/api/tags | grep -o '"name":"[^"]*"' | head -1)
    echo "  Available models: $MODELS"
else
    echo -e "${YELLOW}⚠ Ollama is NOT running${NC}"
    echo "  Start Ollama with: ollama serve"
fi
echo ""

# Check Backend
echo "3️⃣  Checking Backend Server..."
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is running on port 3001${NC}"
else
    echo -e "${YELLOW}⚠ Backend is NOT running${NC}"
    echo "  Start backend with: cd askevo/backend && npm run dev"
fi
echo ""

# Check Frontend
echo "4️⃣  Checking Frontend Server..."
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend is running on port 5173${NC}"
else
    echo -e "${YELLOW}⚠ Frontend is NOT running${NC}"
    echo "  Start frontend with: cd askevo && npm run dev"
fi
echo ""

# Check Database Tables
echo "5️⃣  Checking Database Tables..."
TABLES=$(mysql -u remote_user -p"Prolab#05" progenics_ai -e "SHOW TABLES;" 2>/dev/null | wc -l)
if [ $TABLES -gt 1 ]; then
    echo -e "${GREEN}✓ Database tables exist ($TABLES tables found)${NC}"
else
    echo -e "${RED}✗ Database tables NOT found${NC}"
    echo "  Run: mysql -u remote_user -p\"Prolab#05\" progenics_ai < DATABASE_SETUP.sql"
fi
echo ""

# Check Admin User
echo "6️⃣  Checking Admin User..."
ADMIN=$(mysql -u remote_user -p"Prolab#05" progenics_ai -e "SELECT COUNT(*) FROM users WHERE email='admin@progenics.com';" 2>/dev/null | tail -1)
if [ "$ADMIN" -eq 1 ]; then
    echo -e "${GREEN}✓ Admin user exists${NC}"
else
    echo -e "${YELLOW}⚠ Admin user NOT found${NC}"
    echo "  Create with: mysql -u remote_user -p\"Prolab#05\" progenics_ai -e \"INSERT INTO users (username, email, password_hash, first_name, last_name, role) VALUES ('admin', 'admin@progenics.com', '\$2b\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'admin');\""
fi
echo ""

# Summary
echo "=================================================="
echo "📋 INTEGRATION VERIFICATION SUMMARY"
echo "=================================================="
echo ""
echo "✅ All systems should be running for full functionality:"
echo "   • MySQL (Database)"
echo "   • Ollama (AI Model Server)"
echo "   • Backend (API Server on port 3001)"
echo "   • Frontend (Web Server on port 5173)"
echo ""
echo "🌐 Access the application at: http://localhost:5173"
echo ""
echo "🔐 Demo Credentials:"
echo "   Email: admin@progenics.com"
echo "   Password: progenics123"
echo ""
echo "📖 For more details, see: INTEGRATION_FIX_GUIDE.md"
echo ""
