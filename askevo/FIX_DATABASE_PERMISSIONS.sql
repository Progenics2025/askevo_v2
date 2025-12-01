-- ============================================================================
-- Fix Database Permissions for remote_user
-- ============================================================================
-- Run this as root user to fix access denied errors

-- Step 1: Drop existing user if it exists
DROP USER IF EXISTS 'remote_user'@'localhost';
DROP USER IF EXISTS 'remote_user'@'%';

-- Step 2: Create user with correct password
CREATE USER 'remote_user'@'localhost' IDENTIFIED BY 'Prolab#05';
CREATE USER 'remote_user'@'%' IDENTIFIED BY 'Prolab#05';

-- Step 3: Grant all privileges on progenics_ai database
GRANT ALL PRIVILEGES ON progenics_ai.* TO 'remote_user'@'localhost';
GRANT ALL PRIVILEGES ON progenics_ai.* TO 'remote_user'@'%';

-- Step 4: Grant global privileges
GRANT ALL PRIVILEGES ON *.* TO 'remote_user'@'localhost' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON *.* TO 'remote_user'@'%' WITH GRANT OPTION;

-- Step 5: Flush privileges to apply changes
FLUSH PRIVILEGES;

-- Step 6: Verify user was created
SELECT user, host FROM mysql.user WHERE user = 'remote_user';

-- Step 7: Verify privileges
SHOW GRANTS FOR 'remote_user'@'localhost';
SHOW GRANTS FOR 'remote_user'@'%';

-- ============================================================================
-- END OF FIX
-- ============================================================================
