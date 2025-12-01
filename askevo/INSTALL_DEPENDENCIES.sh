#!/bin/bash

# ============================================================================
# Progenics AI - Install Dependencies Script
# ============================================================================
# This script installs all dependencies for frontend and backend

echo "============================================================================"
echo "Progenics AI - Installing Dependencies"
echo "============================================================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Project directory: $SCRIPT_DIR"
echo ""

# Function to check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}✗ npm is not installed${NC}"
        echo "Please install Node.js from https://nodejs.org/"
        exit 1
    fi
    echo -e "${GREEN}✓ npm is installed${NC}"
}

# Function to install dependencies
install_deps() {
    local dir=$1
    local name=$2
    
    echo ""
    echo "Installing $name dependencies..."
    echo "============================================================================"
    
    if [ ! -d "$dir" ]; then
        echo -e "${RED}✗ Directory not found: $dir${NC}"
        return 1
    fi
    
    cd "$dir"
    
    # Clean install
    echo "Cleaning npm cache..."
    npm cache clean --force
    
    echo "Removing old node_modules..."
    rm -rf node_modules package-lock.json
    
    echo "Installing dependencies..."
    if npm install; then
        echo -e "${GREEN}✓ $name dependencies installed successfully${NC}"
        return 0
    else
        echo -e "${RED}✗ Failed to install $name dependencies${NC}"
        return 1
    fi
}

# Function to verify installation
verify_installation() {
    local dir=$1
    local name=$2
    
    echo ""
    echo "Verifying $name installation..."
    echo "============================================================================"
    
    cd "$dir"
    
    if npm list > /dev/null 2>&1; then
        echo -e "${GREEN}✓ $name dependencies verified${NC}"
        return 0
    else
        echo -e "${RED}✗ $name dependencies verification failed${NC}"
        return 1
    fi
}

# Main installation process
main() {
    echo "Step 1: Checking npm"
    echo "============================================================================"
    check_npm
    echo ""
    
    echo "Step 2: Installing Frontend Dependencies"
    if install_deps "$SCRIPT_DIR" "Frontend"; then
        verify_installation "$SCRIPT_DIR" "Frontend"
    else
        echo -e "${RED}Frontend installation failed${NC}"
        exit 1
    fi
    echo ""
    
    echo "Step 3: Installing Backend Dependencies"
    if install_deps "$SCRIPT_DIR/backend" "Backend"; then
        verify_installation "$SCRIPT_DIR/backend" "Backend"
    else
        echo -e "${RED}Backend installation failed${NC}"
        exit 1
    fi
    echo ""
    
    echo "============================================================================"
    echo "Installation Summary"
    echo "============================================================================"
    echo -e "${GREEN}✓ All dependencies installed successfully!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Start Backend:  cd backend && npm run dev"
    echo "2. Start Frontend: npm run dev"
    echo "3. Start Ollama:   ollama serve"
    echo "4. Open:           http://localhost:5173"
    echo ""
    echo "============================================================================"
}

# Run main function
main
