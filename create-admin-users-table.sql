-- ============================================
-- Create admin_users Table
-- Run this FIRST in Supabase SQL Editor
-- ============================================

-- Step 1: Create the admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Step 3: Create policies for admin_users table
-- Policy: Anyone authenticated can view admin_users (for checking if user is admin)
CREATE POLICY "Authenticated users can view admin_users" 
ON admin_users FOR SELECT
USING (auth.role() = 'authenticated');

-- Policy: Only service role can insert (or we can allow authenticated users to insert for now)
-- For testing, we'll allow authenticated users to insert
CREATE POLICY "Authenticated users can insert admin_users" 
ON admin_users FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only service role can delete (admins can't remove themselves)
CREATE POLICY "Only service role can delete admin_users" 
ON admin_users FOR DELETE
USING (false); -- Disable delete for now, only service role can delete

-- Step 4: Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_auth_user_id ON admin_users(auth_user_id);

-- Step 5: Verify table was created
SELECT 
  'admin_users table created successfully!' as status,
  COUNT(*) as existing_admins
FROM admin_users;

-- ============================================
-- After running the above, you can now add admin accounts
-- ============================================

