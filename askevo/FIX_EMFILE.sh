#!/bin/bash

# ============================================================================
# Progenics AI - Fix EMFILE Error Script
# ============================================================================
# This script fixes the "too many open files" error on Linux

echo "============================================================================"
echo "Fixing EMFILE Error - Too Many Open Files"
echo "============================================================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running on Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo -e "${YELLOW}⚠ This script is for Linux systems${NC}"
    echo "For macOS or Windows, see FIX_EMFILE_ERROR.md"
    exit 1
fi

echo "Step 1: Checking Current File Watcher Limit"
echo "============================================================================"
CURRENT_LIMIT=$(cat /proc/sys/fs/inotify/max_user_watches)
echo "Current limit: $CURRENT_LIMIT"
echo ""

if [ "$CURRENT_LIMIT" -lt 524288 ]; then
    echo -e "${YELLOW}⚠ Limit is too low (need at least 524288)${NC}"
    echo ""
    
    echo "Step 2: Increasing File Watcher Limit"
    echo "============================================================================"
    echo "This requires sudo access..."
    echo ""
    
    # Try to increase the limit
    if echo "fs.inotify.max_user_watches=524288" | sudo tee -a /etc/sysctl.conf > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Added to /etc/sysctl.conf${NC}"
    else
        echo -e "${RED}✗ Failed to add to /etc/sysctl.conf${NC}"
        echo "Try running: echo 'fs.inotify.max_user_watches=524288' | sudo tee -a /etc/sysctl.conf"
        exit 1
    fi
    
    # Apply the changes
    if sudo sysctl -p > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Applied sysctl changes${NC}"
    else
        echo -e "${RED}✗ Failed to apply sysctl changes${NC}"
        echo "Try running: sudo sysctl -p"
        exit 1
    fi
    echo ""
else
    echo -e "${GREEN}✓ Limit is already sufficient${NC}"
    echo ""
fi

echo "Step 3: Verifying Changes"
echo "============================================================================"
NEW_LIMIT=$(cat /proc/sys/fs/inotify/max_user_watches)
echo "New limit: $NEW_LIMIT"

if [ "$NEW_LIMIT" -ge 524288 ]; then
    echo -e "${GREEN}✓ File watcher limit is now sufficient${NC}"
else
    echo -e "${RED}✗ Limit is still too low${NC}"
    exit 1
fi
echo ""

echo "Step 4: Checking vite.config.js"
echo "============================================================================"
if grep -q "usePolling" askevo/vite.config.js 2>/dev/null; then
    echo -e "${GREEN}✓ vite.config.js is optimized${NC}"
else
    echo -e "${YELLOW}⚠ vite.config.js may need optimization${NC}"
    echo "See FIX_EMFILE_ERROR.md for details"
fi
echo ""

echo "============================================================================"
echo "✓ EMFILE Error Fix Complete!"
echo "============================================================================"
echo ""
echo "You can now start the frontend:"
echo "  cd askevo"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo ""
echo "============================================================================"
