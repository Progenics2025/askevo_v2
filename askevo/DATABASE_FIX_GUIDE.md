# Database Setup Fix Guide

## Problem
```
ERROR 1044 (42000) at line 405: Access denied for user 'remote_user'@'%' to database 'progenics_ai'
```

This error means `remote_user` doesn't have permission to create the database.

## Solution

### Option 1: Run as Root/Admin User (Recommended)

#### Step 1: Connect as Root
```bash
mysql -u root -p
# Enter your root password
```

#### Step 2: Run the Fixed Setup Script
```bash
mysql -u root -p < DATABASE_SETUP_FIX.sql
```

This script will:
1. Create the `remote_user` if it doesn't exist
2. Grant all necessary permissions
3. Create the database and all tables

#### Step 3: Verify Installation
```bash
mysql -u remote_user -p progenics_ai
# Enter password: Prolab#05

mysql> SHOW TABLES;
```

You should see 12 tables listed.

---

### Option 2: Manual Setup (Step by Step)

If you prefer to do it manually, follow these steps:

#### Step 1: Connect as Root
```bash
mysql -u root -p
```

#### Step 2: Create User
```sql
CREATE USER IF NOT EXISTS 'remote_user'@'%' IDENTIFIED BY 'Prolab#05';
```

#### Step 3: Grant Permissions
```sql
GRANT ALL PRIVILEGES ON *.* TO 'remote_user'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

#### Step 4: Verify User Creation
```sql
SELECT user, host FROM mysql.user WHERE user = 'remote_user';
```

You should see:
```
| user         | host |
| remote_user  | %    |
```

#### Step 5: Exit and Run Database Setup
```sql
EXIT;
```

Then run:
```bash
mysql -u remote_user -p < DATABASE_SETUP.sql
# Enter password: Prolab#05
```

---

### Option 3: If You Don't Have Root Access

If you don't have root access, ask your database administrator to:

1. Create the user:
```sql
CREATE USER 'remote_user'@'%' IDENTIFIED BY 'Prolab#05';
```

2. Grant permissions:
```sql
GRANT ALL PRIVILEGES ON *.* TO 'remote_user'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

3. Then you can run:
```bash
mysql -u remote_user -p < DATABASE_SETUP.sql
```

---

## Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"
**Solution:** You need the root password. Ask your system administrator.

### Error: "Can't connect to MySQL server"
**Solution:** Ensure MySQL is running:
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql
```

### Error: "Unknown database 'progenics_ai'"
**Solution:** This is normal on first run. The script creates it. Just run the setup again.

### Error: "Duplicate entry for key 'user'"
**Solution:** The user already exists. You can:
1. Drop the user: `DROP USER 'remote_user'@'%';`
2. Then run the setup again

Or just run the original DATABASE_SETUP.sql:
```bash
mysql -u remote_user -p < DATABASE_SETUP.sql
```

---

## Verification Steps

### 1. Check User Exists
```bash
mysql -u root -p
mysql> SELECT user, host FROM mysql.user WHERE user = 'remote_user';
```

### 2. Check User Permissions
```bash
mysql> SHOW GRANTS FOR 'remote_user'@'%';
```

Should show:
```
GRANT ALL PRIVILEGES ON *.* TO 'remote_user'@'%' WITH GRANT OPTION
```

### 3. Check Database Exists
```bash
mysql -u remote_user -p
mysql> SHOW DATABASES;
```

Should show `progenics_ai` in the list.

### 4. Check Tables Exist
```bash
mysql -u remote_user -p progenics_ai
mysql> SHOW TABLES;
```

Should show 12 tables.

---

## Quick Reference

### Connect as Root
```bash
mysql -u root -p
```

### Connect as remote_user
```bash
mysql -u remote_user -p progenics_ai
```

### Run Setup Script
```bash
mysql -u root -p < DATABASE_SETUP_FIX.sql
```

### Check User Permissions
```bash
mysql -u root -p
mysql> SHOW GRANTS FOR 'remote_user'@'%';
```

### Reset User Password
```bash
mysql -u root -p
mysql> ALTER USER 'remote_user'@'%' IDENTIFIED BY 'Prolab#05';
mysql> FLUSH PRIVILEGES;
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Access denied | Run as root first to create user |
| Can't connect | Check MySQL is running |
| Database not found | Run setup script again |
| Tables not created | Check for errors in setup script |
| Permission denied | Ensure user has ALL PRIVILEGES |

---

## Next Steps

Once the database is set up:

1. **Verify Installation**
   ```bash
   mysql -u remote_user -p progenics_ai
   mysql> SELECT * FROM users;
   ```

2. **Start Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Start Frontend**
   ```bash
   npm run dev
   ```

---

## Support

If you still have issues:

1. Check MySQL error log:
   ```bash
   tail -f /var/log/mysql/error.log
   ```

2. Verify MySQL is running:
   ```bash
   mysql -u root -p -e "SELECT 1;"
   ```

3. Check user exists:
   ```bash
   mysql -u root -p -e "SELECT user, host FROM mysql.user WHERE user = 'remote_user';"
   ```

4. Check database exists:
   ```bash
   mysql -u root -p -e "SHOW DATABASES;"
   ```

---

**Database Setup Complete!** 🎉

Your Progenics AI database is now ready to use.
