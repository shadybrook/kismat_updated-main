# Complete Admin Setup - Step by Step

The `admin_users` table doesn't exist yet. Follow these steps in order:

## Step 1: Create the admin_users Table

1. **Go to SQL Editor**: https://supabase.com/dashboard/project/zgwcqyfeixtzriyujvdf/sql/new

2. **Run this SQL** (from `create-admin-users-table.sql`):

```sql
-- Create the admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can view admin_users" 
ON admin_users FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert admin_users" 
ON admin_users FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Create index
CREATE INDEX IF NOT EXISTS idx_admin_users_auth_user_id ON admin_users(auth_user_id);

-- Verify
SELECT 'admin_users table created!' as status;
```

3. **Check the result** - should say "table created!"

---

## Step 2: Create the User Account (If Not Exists)

1. **Go to**: https://supabase.com/dashboard/project/zgwcqyfeixtzriyujvdf/auth/users

2. **Check if user exists**:
   - Look for `findyourkismat@gmail.com` in the list
   - If it exists, skip to Step 3
   - If it doesn't exist, continue:

3. **Click "Add User"**

4. **Fill in**:
   - Email: `findyourkismat@gmail.com`
   - Password: `admin123`
   - ✅ **Check "Auto Confirm User"** (IMPORTANT!)
   - ❌ Uncheck "Send invitation email"

5. **Click "Create User"**

6. **Verify**: User appears with green "Confirmed" status

---

## Step 3: Add Admin Account

1. **Go to SQL Editor**: https://supabase.com/dashboard/project/zgwcqyfeixtzriyujvdf/sql/new

2. **Run this SQL** (from `add-admin-findyourkismat.sql`):

```sql
-- Create admin account
INSERT INTO admin_users (auth_user_id, created_at)
SELECT 
  id as auth_user_id,
  NOW() as created_at
FROM auth.users
WHERE email = 'findyourkismat@gmail.com'
ON CONFLICT (auth_user_id) DO NOTHING;

-- Verify admin was created
SELECT 
  au.id as admin_id,
  u.email,
  au.created_at as admin_since
FROM admin_users au
JOIN auth.users u ON au.auth_user_id = u.id
WHERE u.email = 'findyourkismat@gmail.com';
```

3. **Check results**:
   - Should show "1 row inserted" or "0 rows" (if already exists)
   - Second query should show the admin account

---

## Step 4: Test Login

1. **Go to**: `http://localhost:3000`

2. **Sign in with**:
   - Email: `findyourkismat@gmail.com`
   - Password: `admin123`

3. **You should see**:
   - ✅ Successful login
   - ✅ Admin Dashboard (if admin account was created)
   - ✅ No errors!

---

## Troubleshooting

### "relation admin_users does not exist"
- **Solution**: Run Step 1 first to create the table

### "user not found" in SQL query
- **Solution**: Create the user account first (Step 2)

### "duplicate key value violates unique constraint"
- **Solution**: User is already an admin - that's fine!

### "permission denied" error
- **Solution**: The RLS policies might be too restrictive. Try this:

```sql
-- Temporarily allow all operations (for setup)
DROP POLICY IF EXISTS "Authenticated users can view admin_users" ON admin_users;
DROP POLICY IF EXISTS "Authenticated users can insert admin_users" ON admin_users;

CREATE POLICY "Allow all for admin_users" 
ON admin_users FOR ALL
USING (true)
WITH CHECK (true);
```

Then try adding the admin again.

---

## Quick All-in-One SQL (If User Already Exists)

If the user account already exists, you can run this all at once:

```sql
-- 1. Create table (if doesn't exist)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 2. Create policies
DROP POLICY IF EXISTS "Allow all for admin_users" ON admin_users;
CREATE POLICY "Allow all for admin_users" 
ON admin_users FOR ALL
USING (true)
WITH CHECK (true);

-- 3. Create index
CREATE INDEX IF NOT EXISTS idx_admin_users_auth_user_id ON admin_users(auth_user_id);

-- 4. Add admin account
INSERT INTO admin_users (auth_user_id, created_at)
SELECT id, NOW()
FROM auth.users
WHERE email = 'findyourkismat@gmail.com'
ON CONFLICT (auth_user_id) DO NOTHING;

-- 5. Verify
SELECT 
  '✅ Admin account created!' as status,
  au.id as admin_id,
  u.email
FROM admin_users au
JOIN auth.users u ON au.auth_user_id = u.id
WHERE u.email = 'findyourkismat@gmail.com';
```

---

## Direct Links

- **SQL Editor**: https://supabase.com/dashboard/project/zgwcqyfeixtzriyujvdf/sql/new
- **Create User**: https://supabase.com/dashboard/project/zgwcqyfeixtzriyujvdf/auth/users
- **View Users**: https://supabase.com/dashboard/project/zgwcqyfeixtzriyujvdf/auth/users

