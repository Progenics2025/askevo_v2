# Backend Quick Diagnostic

## The Real Problem

The backend was starting but **not connecting to the database**. Now it will show clear error messages.

## What to Do Now

### Step 1: Start Backend
```bash
cd askevo/backend
npm run dev
```

### Step 2: Look for This Message

**✅ Success:**
```
✓ Database connected successfully
```

**❌ Error:**
```
✗ Database connection failed: [error message]
Check your .env file and ensure MySQL is running
```

## If You See an Error

### Error: "ECONNREFUSED"
**Means:** MySQL is not running

**Fix:**
```bash
sudo systemctl start mysql
```

### Error: "ER_ACCESS_DENIED_FOR_USER"
**Means:** Wrong credentials

**Fix:**
```bash
# Verify credentials work
mysql -u remote_user -p"Prolab#05" progenics_ai -e "SELECT 1;"
```

### Error: "ER_BAD_DB_ERROR"
**Means:** Database doesn't exist

**Fix:**
```bash
mysql -u root -p < askevo/DATABASE_SETUP_FIX.sql
```

## Verify Everything Works

```bash
# 1. Check MySQL
mysql -u remote_user -p"Prolab#05" progenics_ai -e "SELECT 1;"

# 2. Check .env
cat askevo/backend/.env

# 3. Start backend
cd askevo/backend && npm run dev

# 4. In new terminal, test health
curl http://localhost:3001/api/health
```

## Expected Success Output

```
Progenics AI Backend running on http://localhost:3001
Environment: development
✓ Database connected successfully
```

## Next Steps

Once backend is running:

```bash
# Terminal 2: Frontend
cd askevo && npm run dev

# Terminal 3: Ollama
ollama serve

# Terminal 4: Open browser
http://localhost:5173
```

---

**Status:** ✅ Backend now shows clear connection status
