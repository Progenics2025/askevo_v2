#!/bin/bash

# ============================================================================
# Progenics AI - Fix Backend EMFILE Error
# ============================================================================

echo "============================================================================"
echo "Fixing Backend EMFILE Error"
echo "============================================================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "Step 1: Checking System File Watcher Limit"
echo "============================================================================"
CURRENT_LIMIT=$(cat /proc/sys/fs/inotify/max_user_watches)
echo "Current limit: $CURRENT_LIMIT"
echo ""

if [ "$CURRENT_LIMIT" -lt 524288 ]; then
    echo -e "${YELLOW}⚠ Limit is too low (need at least 524288)${NC}"
    echo ""
    
    echo "Step 2: Increasing File Watcher Limit"
    echo "============================================================================"
    
    if echo "fs.inotify.max_user_watches=524288" | sudo tee -a /etc/sysctl.conf > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Added to /etc/sysctl.conf${NC}"
    else
        echo -e "${RED}✗ Failed to add to /etc/sysctl.conf${NC}"
        exit 1
    fi
    
    if sudo sysctl -p > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Applied sysctl changes${NC}"
    else
        echo -e "${RED}✗ Failed to apply sysctl changes${NC}"
        exit 1
    fi
    echo ""
else
    echo -e "${GREEN}✓ Limit is already sufficient${NC}"
    echo ""
fi

echo "Step 3: Verifying nodemon.json"
echo "============================================================================"
if [ -f "askevo/backend/nodemon.json" ]; then
    echo -e "${GREEN}✓ nodemon.json exists${NC}"
    echo "Configuration:"
    cat askevo/backend/nodemon.json | head -5
else
    echo -e "${RED}✗ nodemon.json not found${NC}"
    exit 1
fi
echo ""

echo "Step 4: Verifying Changes"
echo "============================================================================"
NEW_LIMIT=$(cat /proc/sys/fs/inotify/max_user_watches)
echo "New limit: $NEW_LIMIT"

if [ "$NEW_LIMIT" -ge 524288 ]; then
    echo -e "${GREEN}✓ File watcher limit is sufficient${NC}"
else
    echo -e "${YELLOW}⚠ Limit may still be low${NC}"
fi
echo ""

echo "============================================================================"
echo "✓ Backend EMFILE Error Fix Complete!"
echo "============================================================================"
echo ""
echo "You can now start the backend:"
echo "  cd askevo/backend"
echo "  npm run dev"
echo ""
echo "Then start frontend in another terminal:"
echo "  cd askevo"
echo "  npm run dev"
echo ""
echo "And Ollama in another terminal:"
echo "  ollama serve"
echo ""
echo "============================================================================"
