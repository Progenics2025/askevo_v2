# Fix EMFILE Error - Too Many Open Files

## Problem
```
Error: EMFILE: too many open files, watch '/home/progenics-bioinfo/genomics_project/askevo_v2/askevo/vite.config.js'
```

This error occurs on Linux systems when the file watcher limit is exceeded.

## Solution (Already Applied)

The `vite.config.js` has been updated to optimize file watching:

```javascript
server: {
  watch: {
    usePolling: true,
    interval: 100,
    binaryInterval: 300,
    ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/.next/**']
  }
}
```

## Quick Fix (3 Steps)

### Step 1: Increase File Watcher Limit
```bash
# Check current limit
cat /proc/sys/fs/inotify/max_user_watches

# Increase the limit (temporary)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf

# Apply changes
sudo sysctl -p
```

### Step 2: Verify Changes
```bash
cat /proc/sys/fs/inotify/max_user_watches
```

Should show: `524288` or higher

### Step 3: Start Frontend Again
```bash
cd askevo
npm run dev
```

## What Was Fixed in vite.config.js

Added file watching optimization:

```javascript
server: {
  watch: {
    // Use polling instead of native file watching
    usePolling: true,
    
    // Check for changes every 100ms
    interval: 100,
    
    // Check binary files every 300ms
    binaryInterval: 300,
    
    // Ignore large directories
    ignored: [
      '**/node_modules/**',
      '**/.git/**',
      '**/dist/**',
      '**/.next/**'
    ]
  }
}
```

## Permanent Fix (Linux)

### Option 1: Edit sysctl.conf
```bash
sudo nano /etc/sysctl.conf
```

Add this line:
```
fs.inotify.max_user_watches=524288
```

Save and apply:
```bash
sudo sysctl -p
```

### Option 2: Create a New sysctl File
```bash
echo "fs.inotify.max_user_watches=524288" | sudo tee /etc/sysctl.d/99-vite.conf
sudo sysctl -p /etc/sysctl.d/99-vite.conf
```

### Option 3: Temporary Fix (Until Reboot)
```bash
echo 524288 | sudo tee /proc/sys/fs/inotify/max_user_watches
```

## Verify the Fix

### Check Current Limit
```bash
cat /proc/sys/fs/inotify/max_user_watches
```

### Check Default Limit
```bash
cat /proc/sys/fs/inotify/max_user_instances
```

### List All inotify Settings
```bash
cat /proc/sys/fs/inotify/*
```

## Alternative Solutions

### Option 1: Use Polling (Slower but Works)
Already configured in vite.config.js

### Option 2: Exclude More Directories
Edit `vite.config.js`:
```javascript
ignored: [
  '**/node_modules/**',
  '**/.git/**',
  '**/dist/**',
  '**/.next/**',
  '**/uploads/**',
  '**/.env',
  '**/package-lock.json'
]
```

### Option 3: Use WSL2 (Windows)
If on Windows with WSL2:
```bash
# In WSL2 terminal
echo "fs.inotify.max_user_watches=524288" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Option 4: Disable File Watching
```javascript
server: {
  watch: null
}
```

## Troubleshooting

### Still Getting EMFILE Error?

1. **Check if changes were applied:**
   ```bash
   cat /proc/sys/fs/inotify/max_user_watches
   ```

2. **Restart terminal:**
   ```bash
   exit
   # Open new terminal
   ```

3. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

4. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules
   npm install
   ```

5. **Try with polling:**
   ```bash
   npm run dev -- --host
   ```

### Check Open File Descriptors
```bash
# See how many files are open
lsof -p $$ | wc -l

# See what files are open
lsof -p $$
```

### Monitor File Watchers
```bash
# Watch inotify usage in real-time
watch -n 1 'cat /proc/sys/fs/inotify/max_user_watches'
```

## System Information

### Check Your System
```bash
# OS
uname -a

# Kernel version
uname -r

# Current inotify settings
cat /proc/sys/fs/inotify/max_user_watches
cat /proc/sys/fs/inotify/max_user_instances
cat /proc/sys/fs/inotify/max_queued_events
```

## Complete Setup After Fix

### 1. Increase File Watcher Limit
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### 2. Verify vite.config.js is Updated
```bash
cat askevo/vite.config.js
```

Should show the `server.watch` configuration.

### 3. Start Frontend
```bash
cd askevo
npm run dev
```

### 4. Open Application
```
http://localhost:5173
```

## Performance Tips

### If Still Slow:

1. **Increase polling interval:**
   ```javascript
   interval: 500  // Check every 500ms instead of 100ms
   ```

2. **Exclude more directories:**
   ```javascript
   ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/uploads/**']
   ```

3. **Use faster storage:**
   - SSD is faster than HDD
   - Local storage is faster than network storage

## Reference

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

# Start frontend
cd askevo && npm run dev
```

## Status

✅ **Fixed** - vite.config.js optimized for file watching

---

**Next Steps:**
1. Increase file watcher limit
2. Start frontend: `npm run dev`
3. Open: `http://localhost:5173`
