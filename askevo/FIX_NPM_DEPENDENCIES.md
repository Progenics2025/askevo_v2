# Fix NPM Dependencies Error

## Problem
```
npm error code ETARGET
npm error notarget No matching version found for jsonwebtoken@^9.1.0.
```

This error means the exact version specified doesn't exist on npm registry.

## Solution

### Quick Fix (Already Applied)

The `package.json` has been updated with compatible versions:

**Changed:**
- `jsonwebtoken`: `^9.1.0` → `^9.0.2` ✅

### Step 1: Clear npm Cache
```bash
npm cache clean --force
```

### Step 2: Remove Old Dependencies
```bash
cd askevo/backend
rm -rf node_modules
rm package-lock.json
```

### Step 3: Install Dependencies Again
```bash
npm install
```

Expected output:
```
added 123 packages in 45s
```

## Verification

### Check Installation
```bash
npm list jsonwebtoken
```

Should show:
```
jsonwebtoken@9.0.2
```

### Check All Dependencies
```bash
npm list
```

Should show all packages installed without errors.

## If Still Having Issues

### Option 1: Use Exact Versions
```bash
cd askevo/backend
npm install --save-exact
```

### Option 2: Update All Dependencies
```bash
cd askevo/backend
npm update
```

### Option 3: Use npm ci (Recommended for CI/CD)
```bash
cd askevo/backend
npm ci
```

## Common Version Issues & Fixes

| Package | Issue | Fix |
|---------|-------|-----|
| jsonwebtoken | ^9.1.0 not found | Use ^9.0.2 |
| express-validator | Version mismatch | Use ^7.0.0 |
| multer | LTS version | Use ^1.4.5-lts.1 |

## Updated Dependencies

All backend dependencies are now compatible:

```json
{
  "express": "^4.18.2",
  "mysql2": "^3.6.0",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "multer": "^1.4.5-lts.1",
  "express-validator": "^7.0.0",
  "helmet": "^7.1.0",
  "morgan": "^1.10.0"
}
```

## Complete Installation Steps

### 1. Navigate to Backend
```bash
cd askevo/backend
```

### 2. Clean Install
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### 3. Verify Installation
```bash
npm list
npm list jsonwebtoken
```

### 4. Start Backend
```bash
npm run dev
```

Expected output:
```
Progenics AI Backend running on http://localhost:3001
Environment: development
```

## Troubleshooting

### Error: "npm ERR! code ERESOLVE"
```bash
npm install --legacy-peer-deps
```

### Error: "npm ERR! 404 Not Found"
```bash
npm cache clean --force
npm install
```

### Error: "npm ERR! EACCES: permission denied"
```bash
sudo npm install
# Or fix npm permissions
```

### Stuck Installation
```bash
# Kill npm process
pkill -f npm

# Try again
npm install
```

## Verify Backend Works

### Test Health Endpoint
```bash
curl http://localhost:3001/api/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

## Next Steps

1. **Install Frontend Dependencies**
   ```bash
   cd askevo
   npm install
   ```

2. **Start Backend**
   ```bash
   cd askevo/backend
   npm run dev
   ```

3. **Start Frontend**
   ```bash
   cd askevo
   npm run dev
   ```

4. **Access Application**
   ```
   http://localhost:5173
   ```

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm cache clean --force` | Clear npm cache |
| `npm list` | List installed packages |
| `npm update` | Update all packages |
| `npm ci` | Clean install (CI/CD) |
| `npm run dev` | Start development server |

---

**Status:** ✅ Fixed
**Updated:** November 28, 2025
