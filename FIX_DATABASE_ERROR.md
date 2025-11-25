# Fix Database Error - "Could not find table 'public.profiles'"

## The Problem
Your Supabase database is missing the required tables, specifically the `profiles` table where user profile data is stored.

## Solution - Follow These Steps IN ORDER

### Step 1: Create All Database Tables

1. **Open Supabase SQL Editor**: 
   - Go to: https://supabase.com/dashboard/project/zgwcqyfeixtzriyujvdf/sql/new

2. **Copy and paste the entire contents of `create-profiles-table.sql`**
   - This will create all necessary tables: `profiles`, `admin_users`, `events`, `user_events`, `analytics`
   - Sets up proper Row Level Security (RLS) policies
   - Creates indexes for performance
   - Sets up triggers for automatic timestamps

3. **Click "Run" (or press Cmd+Enter)**

4. **Verify Success**:
   - Should show "✅ Database setup complete!"
   - Should show counts like: `profiles_table: 1`, `admin_users_table: 1`, etc.

### Step 2: Create Your Admin User Account

1. **Go to Authentication → Users**:
   - URL: https://supabase.com/dashboard/project/zgwcqyfeixtzriyujvdf/auth/users

2. **Click "Add User" (blue button)**

3. **Fill in the form**:
   ```
   Email: findyourkismat@gmail.com
   Password: admin123
   ```

4. **IMPORTANT - Check these settings**:
   - ✅ **"Auto Confirm User"** (MUST be checked!)
   - ❌ "Send invitation email" (leave unchecked)

5. **Click "Create User"**

6. **Verify**:
   - User appears in the list with email `findyourkismat@gmail.com`
   - Status shows green "Confirmed" checkmark

### Step 3: Add Admin Privileges

1. **Go back to SQL Editor**:
   - URL: https://supabase.com/dashboard/project/zgwcqyfeixtzriyujvdf/sql/new

2. **Run this SQL**:
   ```sql
   -- Add admin privileges for findyourkismat@gmail.com
   INSERT INTO admin_users (auth_user_id, created_at)
   SELECT 
     id as auth_user_id,
     NOW() as created_at
   FROM auth.users
   WHERE email = 'findyourkismat@gmail.com'
   ON CONFLICT (auth_user_id) DO NOTHING;

   -- Verify admin was created
   SELECT 
     '✅ Admin account ready!' as status,
     u.email,
     au.created_at as admin_since
   FROM admin_users au
   JOIN auth.users u ON au.auth_user_id = u.id
   WHERE u.email = 'findyourkismat@gmail.com';
   ```

3. **Verify Success**:
   - Should show "✅ Admin account ready!"
   - Should show the email and creation timestamp

### Step 4: Test the Application

1. **Refresh your application** at http://localhost:3001

2. **Try to sign in**:
   - Email: `findyourkismat@gmail.com`
   - Password: `admin123`

3. **Expected Result**:
   - Login should work without errors
   - You should be able to create/complete your profile
   - No more "Could not find table" errors

## What This Fixes

- ✅ Creates the missing `profiles` table
- ✅ Sets up proper database schema with all required tables
- ✅ Configures Row Level Security for data protection
- ✅ Creates the admin user account
- ✅ Grants admin privileges
- ✅ Enables profile creation and saving

## If You Still Get Errors

1. **Check the browser console** (F12 → Console) for any JavaScript errors
2. **Verify the tables exist** by going to Supabase → Table Editor
3. **Check that your `.env.local` file has the correct Supabase credentials**
4. **Make sure the dev server is running** with `npm run dev`

The database error should be completely resolved after following these steps!
