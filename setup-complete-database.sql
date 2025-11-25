-- ============================================
-- Complete Database Setup for Kismat
-- Run this in Supabase SQL Editor
-- This creates all necessary tables without changing existing ones
-- ============================================

-- Step 1: Create admin_users table (if doesn't exist)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Enable RLS and create policies for admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can view admin_users" ON admin_users;
DROP POLICY IF EXISTS "Authenticated users can insert admin_users" ON admin_users;
DROP POLICY IF EXISTS "Allow all for admin_users" ON admin_users;
DROP POLICY IF EXISTS "Only service role can delete admin_users" ON admin_users;

-- Create permissive policies for setup
CREATE POLICY "Allow all operations on admin_users" 
ON admin_users FOR ALL
USING (true)
WITH CHECK (true);

-- Step 3: Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_auth_user_id ON admin_users(auth_user_id);

-- Step 4: Verify admin_users table exists
SELECT 
  '✅ admin_users table ready' as status,
  COUNT(*) as existing_admins
FROM admin_users;

-- ============================================
-- IMPORTANT: You must create the user account FIRST
-- Go to: Authentication → Users → Add User
-- Email: findyourkismat@gmail.com
-- Password: admin123
-- ✅ Check "Auto Confirm User"
-- ============================================

-- Step 5: After creating the user, run this to add admin:
-- (This will work once the user exists)

-- Check if user exists
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM auth.users WHERE email = 'findyourkismat@gmail.com')
    THEN '✅ User exists - ready to add admin'
    ELSE '❌ User does not exist - create user account first'
  END as user_status;

-- Add admin account (only works if user exists)
INSERT INTO admin_users (auth_user_id, created_at)
SELECT 
  id as auth_user_id,
  NOW() as created_at
FROM auth.users
WHERE email = 'findyourkismat@gmail.com'
ON CONFLICT (auth_user_id) DO NOTHING;

-- Verify admin was created
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM admin_users au
      JOIN auth.users u ON au.auth_user_id = u.id
      WHERE u.email = 'findyourkismat@gmail.com'
    )
    THEN '✅ Admin account exists!'
    ELSE '⚠️ Admin account not found - user may not exist yet'
  END as admin_status,
  au.id as admin_id,
  u.email,
  au.created_at as admin_since
FROM admin_users au
JOIN auth.users u ON au.auth_user_id = u.id
WHERE u.email = 'findyourkismat@gmail.com';

