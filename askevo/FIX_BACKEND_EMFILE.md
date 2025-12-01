# Fix Backend EMFILE Error

## Problem
```
[nodemon] Internal watch failed: EMFILE: too many open files
```

This is the same "too many open files" issue affecting nodemon in the backend.

## Solution (Already Applied)

Created `nodemon.json` in the backend directory to optimize file watching:

```json
{
  "watch": ["server.js", "config", "middleware", "routes"],
  "ignore": ["node_modules", "uploads", ".env", "*.log"],
  "ext": "js,json",
  "delay": 500,
  "env": {
    "NODE_ENV": "development"
  }
}
```

This configuration:
- ✅ Only watches specific directories (not all files)
- ✅ Ignores node_modules and uploads
- ✅ Reduces file watcher overhead
- ✅ Adds delay to prevent rapid restarts

## Quick Fix (2 Steps)

### Step 1: Increase System File Watcher Limit
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Step 2: Restart Backend
```bash
cd askevo/backend
npm run dev
```

## What Was Fixed

Created `askevo/backend/nodemon.json` with optimized configuration:

**Before (❌ watches everything):**
```
[nodemon] watching path(s): *.*
```

**After (✅ watches only necessary files):**
```
[nodemon] watching: ["server.js", "config", "middleware", "routes"]
```

## Verify the Fix

### Check System Limit
```bash
cat /proc/sys/fs/inotify/max_user_watches
```

Should show: `524288` or higher

### Start Backend
```bash
cd askevo/backend
npm run dev
```

Should show:
```
[nodemon] 3.1.11
[nodemon] watching: ["server.js", "config", "middleware", "routes"]
[nodemon] starting `node server.js`
Progenics AI Backend running on http://localhost:3001
```

## Complete Fix Steps

### 1. Increase System Limit (One-time)
```bash
# Permanent fix
echo "fs.inotify.max_user_watches=524288" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Verify
cat /proc/sys/fs/inotify/max_user_watches
```

### 2. Verify nodemon.json Exists
```bash
ls -la askevo/backend/nodemon.json
```

Should show the file exists.

### 3. Start Backend
```bash
cd askevo/backend
npm run dev
```

### 4. Test Backend
```bash
# In new terminal
curl http://localhost:3001/api/health
```

Should return:
```json
{"status":"ok","timestamp":"..."}
```

## Troubleshooting

### Still Getting EMFILE Error?

1. **Check system limit:**
   ```bash
   cat /proc/sys/fs/inotify/max_user_watches
   ```

2. **Increase if needed:**
   ```bash
   echo 524288 | sudo tee /proc/sys/fs/inotify/max_user_watches
   ```

3. **Restart terminal:**
   ```bash
   exit
   # Open new terminal
   cd askevo/backend
   npm run dev
   ```

### nodemon.json Not Being Used?

1. **Verify file exists:**
   ```bash
   cat askevo/backend/nodemon.json
   ```

2. **Check package.json script:**
   ```bash
   cat askevo/backend/package.json | grep -A 2 "dev"
   ```

3. **Reinstall nodemon:**
   ```bash
   cd askevo/backend
   npm install nodemon --save-dev
   ```

## Alternative Solutions

### Option 1: Disable File Watching
```bash
# Start without file watching
node server.js
```

### Option 2: Use Different Watch Tool
```bash
# Install chokidar
npm install --save-dev chokidar-cli

# Update package.json script
"dev": "chokidar 'server.js' 'config/**' 'middleware/**' 'routes/**' -c 'node server.js'"
```

### Option 3: Use Production Mode
```bash
# No file watching in production
NODE_ENV=production npm start
```

## nodemon.json Configuration Explained

```json
{
  "watch": ["server.js", "config", "middleware", "routes"],
  // Only watch these directories/files
  
  "ignore": ["node_modules", "uploads", ".env", "*.log"],
  // Don't watch these
  
  "ext": "js,json",
  // Only watch these file extensions
  
  "delay": 500,
  // Wait 500ms before restarting after file change
  
  "env": {
    "NODE_ENV": "development"
  }
  // Set environment variables
}
```

## System Limits Reference

| Setting | Value | Purpose |
|---------|-------|---------|
| max_user_watches | 524288 | Max file watchers per user |
| max_user_instances | 8192 | Max inotify instances |
| max_queued_events | 16384 | Max queued events |

## Quick Commands

```bash
# Check limit
cat /proc/sys/fs/inotify/max_user_watches

# Increase limit (temporary)
echo 524288 | sudo tee /proc/sys/fs/inotify/max_user_watches

# Increase limit (permanent)
echo "fs.inotify.max_user_watches=524288" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Start backend
cd askevo/backend && npm run dev

# Test backend
curl http://localhost:3001/api/health
```

## Complete Backend Setup

### 1. Navigate to Backend
```bash
cd askevo/backend
```

### 2. Increase System Limit
```bash
echo "fs.inotify.max_user_watches=524288" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### 3. Verify nodemon.json
```bash
ls -la nodemon.json
```

### 4. Start Backend
```bash
npm run dev
```

### 5. Verify It's Running
```bash
# In new terminal
curl http://localhost:3001/api/health
```

## Status

✅ **Fixed** - nodemon.json created with optimized configuration

---

**Next Steps:**
1. Increase system file watcher limit
2. Start backend: `npm run dev`
3. Start frontend: `cd askevo && npm run dev`
4. Start Ollama: `ollama serve`
5. Open: `http://localhost:5173`
