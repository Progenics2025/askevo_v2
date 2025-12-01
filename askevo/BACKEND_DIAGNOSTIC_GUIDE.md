# Backend Diagnostic Guide

## What Was Fixed

Updated `server.js` to:
1. ✅ Import database pool
2. ✅ Test database connection on startup
3. ✅ Show clear error messages if connection fails
4. ✅ Add graceful shutdown handling

## The Real Issue

The backend was starting but **not connecting to the database**. The server.js didn't:
- Import the database pool
- Test the connection
- Show connection errors

Now it will clearly show if there's a database connection problem.

## How to Diagnose Issues

### Step 1: Start Backend and Watch for Messages
```bash
cd askevo/backend
npm run dev
```

You should see:
```
Progenics AI Backend running on http://localhost:3001
Environment: development
✓ Database connected successfully
```

### Step 2: If You See Database Error

```
✗ Database connection failed: connect ECONNREFUSED 127.0.0.1:3306
Check your .env file and ensure MySQL is running
```

**This means:**
- MySQL is not running
- Wrong credentials in .env
- Wrong host/port in .env

### Step 3: Verify Each Component

#### Check MySQL is Running
```bash
mysql -u remote_user -p"Prolab#05" progenics_ai -e "SELECT 1;"
```

Should return: `1`

#### Check .env File
```bash
cat askevo/backend/.env
```

Should show:
```
DB_HOST=localhost
DB_USER=remote_user
DB_PASSWORD=Prolab#05
DB_NAME=progenics_ai
DB_PORT=3306
```

#### Check Database Exists
```bash
mysql -u remote_user -p"Prolab#05" -e "SHOW DATABASES;" | grep progenics_ai
```

Should show: `progenics_ai`

#### Check Tables Exist
```bash
mysql -u remote_user -p"Prolab#05" progenics_ai -e "SHOW TABLES;"
```

Should show 12+ tables

## Complete Diagnostic Checklist

- [ ] MySQL is running: `mysql -u remote_user -p"Prolab#05" progenics_ai -e "SELECT 1;"`
- [ ] .env file exists: `ls -la askevo/backend/.env`
- [ ] .env has correct values: `cat askevo/backend/.env`
- [ ] Database exists: `mysql -u remote_user -p"Prolab#05" -e "SHOW DATABASES;"`
- [ ] Tables exist: `mysql -u remote_user -p"Prolab#05" progenics_ai -e "SHOW TABLES;"`
- [ ] Backend starts: `cd askevo/backend && npm run dev`
- [ ] Backend shows "Database connected": Check console output
- [ ] Health check works: `curl http://localhost:3001/api/health`

## Expected Output

### Successful Startup
```
[nodemon] 3.1.11
[nodemon] watching: ["server.js", "config", "middleware", "routes"]
[nodemon] starting `node server.js`
Progenics AI Backend running on http://localhost:3001
Environment: development
✓ Database connected successfully
```

### Database Connection Error
```
Progenics AI Backend running on http://localhost:3001
Environment: development
✗ Database connection failed: connect ECONNREFUSED 127.0.0.1:3306
Check your .env file and ensure MySQL is running
```

### Missing .env File
```
Progenics AI Backend running on http://localhost:3001
Environment: development
✗ Database connection failed: ER_ACCESS_DENIED_FOR_USER
Check your .env file and ensure MySQL is running
```

## Troubleshooting Steps

### Issue 1: "Database connection failed: ECONNREFUSED"

**Cause:** MySQL is not running

**Fix:**
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL
sudo systemctl start mysql

# Verify
mysql -u remote_user -p"Prolab#05" progenics_ai -e "SELECT 1;"
```

### Issue 2: "Database connection failed: ER_ACCESS_DENIED_FOR_USER"

**Cause:** Wrong credentials in .env

**Fix:**
```bash
# Check .env file
cat askevo/backend/.env

# Verify credentials work
mysql -u remote_user -p"Prolab#05" progenics_ai -e "SELECT 1;"

# If that fails, check MySQL user
mysql -u root -p -e "SELECT user, host FROM mysql.user WHERE user='remote_user';"
```

### Issue 3: "Database connection failed: ER_BAD_DB_ERROR"

**Cause:** Database doesn't exist

**Fix:**
```bash
# Check if database exists
mysql -u remote_user -p"Prolab#05" -e "SHOW DATABASES;" | grep progenics_ai

# If not, run setup
mysql -u root -p < askevo/DATABASE_SETUP_FIX.sql
```

### Issue 4: "Database connection failed: PROTOCOL_CONNECTION_LOST"

**Cause:** Connection pool issue or MySQL restarted

**Fix:**
```bash
# Restart backend
# Press Ctrl+C in backend terminal
# Then run again
npm run dev
```

## Testing Backend Endpoints

### Health Check
```bash
curl http://localhost:3001/api/health
```

Response:
```json
{"status":"ok","timestamp":"2024-01-01T10:00:00.000Z"}
```

### Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Backend Startup Flow

```
1. Load environment variables (.env)
2. Create Express app
3. Setup middleware (CORS, helmet, morgan)
4. Setup routes
5. Start listening on port 3001
6. Test database connection
7. Show success or error message
```

## Quick Commands

```bash
# Start backend
cd askevo/backend && npm run dev

# Check MySQL
mysql -u remote_user -p"Prolab#05" progenics_ai -e "SELECT 1;"

# Check .env
cat askevo/backend/.env

# Check database
mysql -u remote_user -p"Prolab#05" -e "SHOW DATABASES;"

# Check tables
mysql -u remote_user -p"Prolab#05" progenics_ai -e "SHOW TABLES;"

# Test health
curl http://localhost:3001/api/health
```

## Status

✅ **Fixed** - server.js now tests database connection and shows clear error messages

---

**Next Steps:**
1. Start backend: `cd askevo/backend && npm run dev`
2. Check for database connection message
3. If error, follow troubleshooting steps above
4. Once working, start frontend and Ollama
