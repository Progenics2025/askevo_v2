# Fix Database Access Denied Error

## Problem
```
✗ Database connection failed: Access denied for user 'remote_user'@'localhost' (using password: YES)
```

This means `remote_user` doesn't have proper permissions to access the database.

## Solution (3 Steps)

### Step 1: Connect as Root
```bash
mysql -u root -p
# Enter root password: Prolab%2305
```

### Step 2: Run Permission Fix Script
```bash
mysql -u root -p < askevo/FIX_DATABASE_PERMISSIONS.sql
# Enter root password: Prolab%2305
```

This script will:
- ✅ Drop existing remote_user (if exists)
- ✅ Create fresh remote_user with correct password
- ✅ Grant all privileges
- ✅ Flush privileges

### Step 3: Verify It Works
```bash
# Test connection
mysql -u remote_user -p"Prolab#05" progenics_ai -e "SELECT 1;"
```

Should return: `1`

## Manual Fix (If Script Doesn't Work)

### Step 1: Connect as Root
```bash
mysql -u root -p
```

### Step 2: Drop Old User
```sql
DROP USER IF EXISTS 'remote_user'@'localhost';
DROP USER IF EXISTS 'remote_user'@'%';
```

### Step 3: Create New User
```sql
CREATE USER 'remote_user'@'localhost' IDENTIFIED BY 'Prolab#05';
CREATE USER 'remote_user'@'%' IDENTIFIED BY 'Prolab#05';
```

### Step 4: Grant Privileges
```sql
GRANT ALL PRIVILEGES ON progenics_ai.* TO 'remote_user'@'localhost';
GRANT ALL PRIVILEGES ON progenics_ai.* TO 'remote_user'@'%';
GRANT ALL PRIVILEGES ON *.* TO 'remote_user'@'localhost' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON *.* TO 'remote_user'@'%' WITH GRANT OPTION;
```

### Step 5: Flush Privileges
```sql
FLUSH PRIVILEGES;
```

### Step 6: Verify
```sql
SELECT user, host FROM mysql.user WHERE user = 'remote_user';
SHOW GRANTS FOR 'remote_user'@'localhost';
```

### Step 7: Exit
```sql
EXIT;
```

## Quick Fix Commands

```bash
# 1. Run fix script
mysql -u root -p < askevo/FIX_DATABASE_PERMISSIONS.sql

# 2. Test connection
mysql -u remote_user -p"Prolab#05" progenics_ai -e "SELECT 1;"

# 3. Restart backend
cd askevo/backend
npm run dev
```

## Verify Backend Works

After fixing permissions, you should see:

```
Progenics AI Backend running on http://localhost:3001
Environment: development
✓ Database connected successfully
```

## Troubleshooting

### Still Getting "Access Denied"?

1. **Check root password:**
   ```bash
   mysql -u root -p
   # Try: Prolab%2305 or Prolab#05
   ```

2. **Check if user exists:**
   ```bash
   mysql -u root -p -e "SELECT user, host FROM mysql.user WHERE user='remote_user';"
   ```

3. **Check user privileges:**
   ```bash
   mysql -u root -p -e "SHOW GRANTS FOR 'remote_user'@'localhost';"
   ```

4. **Reset user password:**
   ```bash
   mysql -u root -p -e "ALTER USER 'remote_user'@'localhost' IDENTIFIED BY 'Prolab#05';"
   mysql -u root -p -e "FLUSH PRIVILEGES;"
   ```

### Getting "ERROR 1045 (28000): Access denied for user 'root'"?

This means the root password is wrong. Try:
```bash
# Try without password
mysql -u root

# Or try different password
mysql -u root -p
# Enter: Prolab%2305
# Or: Prolab#05
```

### Getting "ERROR 1064 (42000): Syntax error"?

Make sure you're running the SQL commands in MySQL prompt, not bash:
```bash
# Wrong (in bash)
mysql -u root -p "DROP USER IF EXISTS 'remote_user'@'localhost';"

# Right (in MySQL prompt)
mysql -u root -p
mysql> DROP USER IF EXISTS 'remote_user'@'localhost';
```

## Complete Fix Workflow

```bash
# 1. Connect as root
mysql -u root -p
# Enter password: Prolab%2305

# 2. In MySQL prompt, run:
DROP USER IF EXISTS 'remote_user'@'localhost';
DROP USER IF EXISTS 'remote_user'@'%';
CREATE USER 'remote_user'@'localhost' IDENTIFIED BY 'Prolab#05';
CREATE USER 'remote_user'@'%' IDENTIFIED BY 'Prolab#05';
GRANT ALL PRIVILEGES ON progenics_ai.* TO 'remote_user'@'localhost';
GRANT ALL PRIVILEGES ON progenics_ai.* TO 'remote_user'@'%';
GRANT ALL PRIVILEGES ON *.* TO 'remote_user'@'localhost' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON *.* TO 'remote_user'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EXIT;

# 3. Test connection
mysql -u remote_user -p"Prolab#05" progenics_ai -e "SELECT 1;"

# 4. Restart backend
cd askevo/backend
npm run dev
```

## Expected Success

After fixing permissions:

```
✓ Database connected successfully
```

Then you can:
1. Start frontend: `cd askevo && npm run dev`
2. Start Ollama: `ollama serve`
3. Open: `http://localhost:5173`

## Status

✅ **Fix Script Created** - FIX_DATABASE_PERMISSIONS.sql

---

**Next Steps:**
1. Run: `mysql -u root -p < askevo/FIX_DATABASE_PERMISSIONS.sql`
2. Test: `mysql -u remote_user -p"Prolab#05" progenics_ai -e "SELECT 1;"`
3. Restart backend: `cd askevo/backend && npm run dev`
