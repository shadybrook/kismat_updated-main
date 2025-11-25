-- ============================================
-- Add Admin Account for findyourkismat@gmail.com
-- Run this AFTER creating the admin_users table
-- ============================================

-- Step 1: Verify the user exists
SELECT 
  id as auth_user_id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'findyourkismat@gmail.com';

-- Step 2: Create admin account
INSERT INTO admin_users (auth_user_id, created_at)
SELECT 
  id as auth_user_id,
  NOW() as created_at
FROM auth.users
WHERE email = 'findyourkismat@gmail.com'
ON CONFLICT (auth_user_id) DO NOTHING
RETURNING *;

-- Step 3: Verify admin was created
SELECT 
  au.id as admin_id,
  au.auth_user_id,
  au.created_at as admin_created_at,
  u.email,
  u.email_confirmed_at,
  u.created_at as user_created_at
FROM admin_users au
JOIN auth.users u ON au.auth_user_id = u.id
WHERE u.email = 'findyourkismat@gmail.com';

-- ============================================
-- If you get "user not found" error above,
-- create the user account first:
-- Go to: Authentication → Users → Add User
-- Email: findyourkismat@gmail.com
-- Password: admin123
-- ✅ Check "Auto Confirm User"
-- ============================================

