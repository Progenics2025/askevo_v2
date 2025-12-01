# EMFILE Error - Quick Fix

## Problem
```
Error: EMFILE: too many open files
```

## Solution (2 Steps)

### Step 1: Increase File Watcher Limit
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Step 2: Start Frontend
```bash
cd askevo
npm run dev
```

## Automated Fix

Run the fix script:
```bash
bash askevo/FIX_EMFILE.sh
```

## What Was Fixed

Updated `vite.config.js` to optimize file watching:
- ✅ Use polling instead of native watchers
- ✅ Ignore large directories (node_modules, .git, dist)
- ✅ Reduce watcher overhead

## Verify Fix

```bash
# Check limit
cat /proc/sys/fs/inotify/max_user_watches

# Should show: 524288 or higher
```

## If Still Having Issues

### Option 1: Restart Terminal
```bash
exit
# Open new terminal
cd askevo
npm run dev
```

### Option 2: Clear Cache
```bash
npm cache clean --force
rm -rf node_modules
npm install
npm run dev
```

### Option 3: Use Polling Only
```bash
npm run dev -- --host
```

## System Requirements

| Setting | Value |
|---------|-------|
| max_user_watches | 524288 |
| max_user_instances | 8192 |
| max_queued_events | 16384 |

## Quick Commands

```bash
# Check current limit
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

✅ **Fixed** - vite.config.js optimized

---

**Next:** Run the fix and start frontend
