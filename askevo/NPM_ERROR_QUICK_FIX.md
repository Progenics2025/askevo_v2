# NPM Error - Quick Fix

## Problem
```
npm error code ETARGET
npm error notarget No matching version found for jsonwebtoken@^9.1.0.
```

## Solution (3 Steps)

### Step 1: Clean npm Cache
```bash
npm cache clean --force
```

### Step 2: Remove Old Files
```bash
cd askevo/backend
rm -rf node_modules package-lock.json
```

### Step 3: Install Again
```bash
npm install
```

## What Was Fixed

The `package.json` has been updated:
- ❌ `jsonwebtoken@^9.1.0` (doesn't exist)
- ✅ `jsonwebtoken@^9.0.2` (exists and works)

## Automated Installation

Run the installation script:
```bash
cd askevo
bash INSTALL_DEPENDENCIES.sh
```

This will:
1. Clean npm cache
2. Remove old node_modules
3. Install frontend dependencies
4. Install backend dependencies
5. Verify everything works

## Manual Installation

### Frontend
```bash
cd askevo
npm install
```

### Backend
```bash
cd askevo/backend
npm install
```

## Verify Installation

### Check jsonwebtoken
```bash
npm list jsonwebtoken
```

Should show:
```
jsonwebtoken@9.0.2
```

### Check All Packages
```bash
npm list
```

Should show all packages without errors.

## If Still Having Issues

### Option 1: Use Legacy Peer Deps
```bash
npm install --legacy-peer-deps
```

### Option 2: Force Clean Install
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --no-optional
```

### Option 3: Update npm
```bash
npm install -g npm@latest
npm install
```

## Next Steps

Once dependencies are installed:

```bash
# Terminal 1: Backend
cd askevo/backend
npm run dev

# Terminal 2: Frontend
cd askevo
npm run dev

# Terminal 3: Ollama
ollama serve

# Terminal 4: Open browser
http://localhost:5173
```

## Status

✅ **Fixed** - Backend package.json updated with compatible versions

---

**Quick Reference:**
- Backend: `askevo/backend/`
- Frontend: `askevo/`
- Install: `npm install`
- Start: `npm run dev`
