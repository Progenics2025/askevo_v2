#!/bin/bash

# ============================================================================
# Progenics AI - Setup Verification Script (Fixed)
# ============================================================================
# Run this from the askevo directory: bash VERIFY_SETUP_FIXED.sh

echo "============================================================================"
echo "Progenics AI - Setup Verification"
echo "============================================================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for checks
PASSED=0
FAILED=0

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo "Project directory: $SCRIPT_DIR"
echo ""

# Function to check if command exists
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $2 is installed"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $2 is NOT installed"
        ((FAILED++))
    fi
}

# Function to check if service is running
check_service() {
    if curl -s $1 > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} $2 is running ($1)"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $2 is NOT running ($1)"
        ((FAILED++))
    fi
}

# Function to check database
check_database() {
    if mysql -u remote_user -p"Prolab#05" progenics_ai -e "SELECT 1" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Database connection successful"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} Database connection FAILED"
        ((FAILED++))
    fi
}

# Function to check database tables
check_tables() {
    TABLES=$(mysql -u remote_user -p"Prolab#05" progenics_ai -e "SHOW TABLES;" 2>/dev/null | wc -l)
    if [ $TABLES -ge 12 ]; then
        echo -e "${GREEN}✓${NC} Database tables created ($TABLES tables)"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} Database tables NOT created (found $TABLES)"
        ((FAILED++))
    fi
}

# Function to check file exists
check_file() {
    if [ -f "$SCRIPT_DIR/$1" ]; then
        echo -e "${GREEN}✓${NC} $2 exists"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $2 NOT found at $SCRIPT_DIR/$1"
        ((FAILED++))
    fi
}

# Function to check directory exists
check_dir() {
    if [ -d "$SCRIPT_DIR/$1" ]; then
        echo -e "${GREEN}✓${NC} $2 directory exists"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $2 directory NOT found at $SCRIPT_DIR/$1"
        ((FAILED++))
    fi
}

echo "1. Checking Required Tools"
echo "============================================================================"
check_command "node" "Node.js"
check_command "npm" "npm"
check_command "mysql" "MySQL Client"
check_command "ollama" "Ollama"
echo ""

echo "2. Checking Project Structure"
echo "============================================================================"
check_dir "src" "Frontend src"
check_dir "backend" "Backend"
check_dir "public" "Public"
check_file "package.json" "Frontend package.json"
check_file "backend/package.json" "Backend package.json"
check_file "vite.config.js" "Vite config"
echo ""

echo "3. Checking Configuration Files"
echo "============================================================================"
check_file ".env.example" "Frontend .env.example"
check_file "backend/.env.example" "Backend .env.example"
check_file "DATABASE_SETUP.sql" "Database setup script"
check_file "DATABASE_SETUP_FIX.sql" "Database fix script"
echo ""

echo "4. Checking Database"
echo "============================================================================"
check_database
check_tables
echo ""

echo "5. Checking Services (if running)"
echo "============================================================================"
check_service "http://localhost:3001/api/health" "Backend API"
check_service "http://localhost:5173" "Frontend"
check_service "http://localhost:11434/api/tags" "Ollama"
echo ""

echo "6. Checking Dependencies"
echo "============================================================================"
if [ -d "$SCRIPT_DIR/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} Frontend dependencies NOT installed"
    echo "   Run: npm install"
    ((FAILED++))
fi

if [ -d "$SCRIPT_DIR/backend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Backend dependencies installed"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} Backend dependencies NOT installed"
    echo "   Run: cd backend && npm install"
    ((FAILED++))
fi
echo ""

echo "============================================================================"
echo "Summary"
echo "============================================================================"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -le 2 ]; then
    echo -e "${GREEN}✓ Setup looks good! Services just need to be started.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Install dependencies (if not done):"
    echo "   npm install"
    echo "   cd backend && npm install"
    echo ""
    echo "2. Start services in separate terminals:"
    echo "   Terminal 1: ollama serve"
    echo "   Terminal 2: cd backend && npm run dev"
    echo "   Terminal 3: npm run dev"
    echo ""
    echo "3. Open application:"
    echo "   http://localhost:5173"
elif [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Your system is ready.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Start Backend:  cd backend && npm run dev"
    echo "2. Start Frontend: npm run dev"
    echo "3. Start Ollama:   ollama serve"
    echo "4. Open:           http://localhost:5173"
else
    echo -e "${RED}✗ Some checks failed. Please review the errors above.${NC}"
    echo ""
    echo "Common fixes:"
    echo "1. Install Node.js: https://nodejs.org/"
    echo "2. Install MySQL: https://dev.mysql.com/downloads/"
    echo "3. Install Ollama: https://ollama.ai/"
    echo "4. Run: npm install (in askevo directory)"
    echo "5. Run: npm install (in askevo/backend directory)"
fi

echo ""
echo "============================================================================"
