# Quick Fix - Database Access Denied

## The Problem
```
Access denied for user 'remote_user'@'localhost' (using password: YES)
```

The `remote_user` account doesn't have proper permissions.

## The Fix (1 Command)

```bash
mysql -u root -p < askevo/FIX_DATABASE_PERMISSIONS.sql
```

When prompted, enter root password: `Prolab%2305`

## Verify It Works

```bash
mysql -u remote_user -p"Prolab#05" progenics_ai -e "SELECT 1;"
```

Should return: `1`

## Restart Backend

```bash
cd askevo/backend
npm run dev
```

You should now see:
```
✓ Database connected successfully
```

## If That Doesn't Work

Try manually in MySQL:

```bash
# 1. Connect as root
mysql -u root -p
# Password: Prolab%2305

# 2. Copy and paste this entire block:
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

# 3. Test
mysql -u remote_user -p"Prolab#05" progenics_ai -e "SELECT 1;"

# 4. Restart backend
cd askevo/backend && npm run dev
```

## Success Indicator

Backend output should show:
```
✓ Database connected successfully
```

---

**That's it!** 🧬
