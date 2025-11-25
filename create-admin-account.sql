-- ============================================
-- SQL Script to Create Admin Account
-- Run this in your Supabase SQL Editor
-- ============================================

-- Method 1: Create admin account by email
-- Replace 'user@example.com' with the email of the user you want to make an admin
INSERT INTO admin_users (auth_user_id, created_at)
SELECT 
  id as auth_user_id,
  NOW() as created_at
FROM auth.users
WHERE email = 'user@example.com'
ON CONFLICT (auth_user_id) DO NOTHING;

-- Method 2: Create admin account by user ID (if you know the auth user ID)
-- Replace 'USER_ID_HERE' with the actual auth user ID from auth.users table
INSERT INTO admin_users (auth_user_id, created_at)
VALUES ('USER_ID_HERE', NOW())
ON CONFLICT (auth_user_id) DO NOTHING;

-- Method 3: View all existing admin accounts
SELECT 
  au.id,
  au.auth_user_id,
  au.created_at,
  u.email,
  u.created_at as user_created_at
FROM admin_users au
JOIN auth.users u ON au.auth_user_id = u.id
ORDER BY au.created_at DESC;

-- Method 4: Find user by email to get their auth_user_id
-- Replace 'user@example.com' with the email you're looking for
SELECT 
  id as auth_user_id,
  email,
  created_at
FROM auth.users
WHERE email = 'user@example.com';

-- Method 5: Remove admin access (if needed)
-- Replace 'USER_ID_HERE' with the auth_user_id
DELETE FROM admin_users
WHERE auth_user_id = 'USER_ID_HERE';

-- ============================================
-- Instructions:
-- ============================================
-- 1. First, find the user's auth_user_id using Method 4
-- 2. Then use Method 2 to create the admin account
-- OR
-- 1. Use Method 1 directly if you know the user's email
-- 2. Verify using Method 3 to see all admins
-- ============================================

