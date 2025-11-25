-- ============================================
-- Create Admin Account for findyourkismat@gmail.com
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Check if the user already exists
SELECT 
  id as auth_user_id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
WHERE email = 'findyourkismat@gmail.com';

-- Step 2: If user exists, create admin account
-- (Run this after confirming the user exists from Step 1)
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
  u.created_at as user_created_at,
  u.email_confirmed_at
FROM admin_users au
JOIN auth.users u ON au.auth_user_id = u.id
WHERE u.email = 'findyourkismat@gmail.com';

-- ============================================
-- If user doesn't exist, you need to create the account first
-- Option A: Have them sign up through the app
-- Option B: Use Supabase Dashboard → Authentication → Add User
-- Option C: Use the SQL below (requires service role key)
-- ============================================

