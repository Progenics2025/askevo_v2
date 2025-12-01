#!/bin/bash

echo "🔍 PROGENICS AI - DIAGNOSTIC SCRIPT"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check 1: Admin User
echo -e "${BLUE}1. Checking Admin User...${NC}"
ADMIN_EMAIL=$(mysql -u remote_user -p"Prolab#05" progenics_ai -e "SELECT email FROM users WHERE username='admin';" 2>/dev/null | tail -1)
if [ "$ADMIN_EMAIL" = "admin@progenics.com" ]; then
    echo -e "${GREEN}✓ Admin email is correct: $ADMIN_EMAIL${NC}"
else
    echo -e "${RED}✗ Admin email is WRONG: $ADMIN_EMAIL (should be admin@progenics.com)${NC}"
fi
echo ""

# Check 2: Frontend .env
echo -e "${BLUE}2. Checking Frontend .env...${NC}"
if [ -f "askevo/.env" ]; then
    echo -e "${GREEN}✓ Frontend .env file exists${NC}"
    API_URL=$(grep "REACT_APP_API_URL" askevo/.env | cut -d'=' -f2)
    echo "  API URL: $API_URL"
else
    echo -e "${RED}✗ Frontend .env file MISSING${NC}"
fi
echo ""

# Check 3: Backend .env
echo -e "${BLUE}3. Checking Backend .env...${NC}"
if [ -f "askevo/backend/.env" ]; then
    echo -e "${GREEN}✓ Backend .env file exists${NC}"
    PORT=$(grep "^PORT=" askevo/backend/.env | cut -d'=' -f2)
    echo "  Backend Port: $PORT"
else
    echo -e "${RED}✗ Backend .env file MISSING${NC}"
fi
echo ""

# Check 4: MySQL Connection
echo -e "${BLUE}4. Checking MySQL Connection...${NC}"
if mysql -u remote_user -p"Prolab#05" -e "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ MySQL is running${NC}"
    USER_COUNT=$(mysql -u remote_user -p"Prolab#05" progenics_ai -e "SELECT COUNT(*) FROM users;" 2>/dev/null | tail -1)
    echo "  Users in database: $USER_COUNT"
else
    echo -e "${RED}✗ MySQL is NOT running${NC}"
fi
echo ""

# Check 5: Backend Server
echo -e "${BLUE}5. Checking Backend Server...${NC}"
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is running on port 3001${NC}"
else
    echo -e "${YELLOW}⚠ Backend is NOT running on port 3001${NC}"
    echo "  Start with: cd askevo/backend && npm run dev"
fi
echo ""

# Check 6: Frontend Server
echo -e "${BLUE}6. Checking Frontend Server...${NC}"
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend is running on port 5173${NC}"
else
    echo -e "${YELLOW}⚠ Frontend is NOT running on port 5173${NC}"
    echo "  Start with: cd askevo && npm run dev"
fi
echo ""

# Check 7: Ollama Server
echo -e "${BLUE}7. Checking Ollama Server...${NC}"
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Ollama is running on port 11434${NC}"
    MODELS=$(curl -s http://localhost:11434/api/tags | grep -o '"name":"[^"]*"' | head -1)
    echo "  Models: $MODELS"
else
    echo -e "${YELLOW}⚠ Ollama is NOT running on port 11434${NC}"
    echo "  Start with: ollama serve"
fi
echo ""

# Check 8: Database Tables
echo -e "${BLUE}8. Checking Database Tables...${NC}"
TABLES=$(mysql -u remote_user -p"Prolab#05" progenics_ai -e "SHOW TABLES;" 2>/dev/null | wc -l)
if [ $TABLES -gt 1 ]; then
    echo -e "${GREEN}✓ Database tables exist ($TABLES tables)${NC}"
else
    echo -e "${RED}✗ Database tables NOT found${NC}"
fi
echo ""

# Check 9: Required Files
echo -e "${BLUE}9. Checking Required Files...${NC}"
FILES=(
    "askevo/src/pages/LoginPage.jsx"
    "askevo/src/context/AuthContext.jsx"
    "askevo/src/components/ProtectedRoute.jsx"
    "askevo/src/components/ChatArea.jsx"
    "askevo/src/components/Sidebar.jsx"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file${NC}"
    else
        echo -e "${RED}✗ $file MISSING${NC}"
    fi
done
echo ""

# Summary
echo "===================================="
echo -e "${BLUE}DIAGNOSTIC SUMMARY${NC}"
echo "===================================="
echo ""
echo "If you see ✓ for all items, the system should work."
echo "If you see ✗ or ⚠, follow the suggestions above."
echo ""
echo "Next steps:"
echo "1. Fix any ✗ issues"
echo "2. Start any ⚠ services"
echo "3. Try logging in at http://localhost:5173"
echo ""
