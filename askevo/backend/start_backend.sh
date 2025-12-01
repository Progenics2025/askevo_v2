#!/bin/bash
# Increase file descriptor limit
ulimit -n 65535

# Start the backend
echo "Starting backend with increased file limit..."
npm run dev
