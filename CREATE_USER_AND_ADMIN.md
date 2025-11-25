# Create User Account and Make Admin - Step by Step

The "Invalid email or password" error means the user account doesn't exist yet. Follow these steps:

## Step 1: Create the User Account in Supabase

### Method A: Through Supabase Dashboard (Easiest - Recommended)

1. **Go to**: https://supabase.com/dashboard/project/zgwcqyfeixtzriyujvdf/auth/users

2. **Click "Add User"** button (top right)

3. **Fill in the form**:
   - **Email**: `findyourkismat@gmail.com`
   - **Password**: `admin123` (or your preferred password)
   - **Auto Confirm User**: ✅ **CHECK THIS BOX** (important - skips email verification)
   - **Send invitation email**: ❌ Uncheck this (not needed)

4. **Click "Create User"**

5. **Verify the user was created**:
   - You should see `findyourkismat@gmail.com` in the users list
   - Status should show as "Confirmed" (green checkmark)

### Method B: Through Your App (Alternative)

1. Go to `http://localhost:3000`
2. Click **"Create an account"** or **"Sign Up"**
3. Use:
   - Email: `findyourkismat@gmail.com`
   - Password: `admin123`
4. Complete the signup process

---

## Step 2: Make the User an Admin

**After the user account is created**, make them an admin:

1. **Go to**: https://supabase.com/dashboard/project/zgwcqyfeixtzriyujvdf/sql/new

2. **Run this SQL query**:

```sql
-- First, verify the user exists
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'findyourkismat@gmail.com';

-- Then, create admin account
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
  au.auth_user_id,
  u.email,
  u.email_confirmed_at
FROM admin_users au
JOIN auth.users u ON au.auth_user_id = u.id
WHERE u.email = 'findyourkismat@gmail.com';
```

3. **Check the results**:
   - First query should show the user with their ID
   - Second query should insert the admin record
   - Third query should show the admin account was created

---

## Step 3: Test the Login

1. **Go to**: `http://localhost:3000`
2. **Sign in with**:
   - Email: `findyourkismat@gmail.com`
   - Password: `admin123` (or whatever you set)
3. **You should now**:
   - Successfully log in
   - See the Admin Dashboard (if admin account was created)
   - No more "Invalid email or password" error

---

## Troubleshooting

### "User already exists" when creating?
- The user account already exists
- Skip Step 1 and go directly to Step 2 (make them admin)
- Or reset the password in Supabase Dashboard → Authentication → Users

### "No rows returned" in SQL query?
- User account doesn't exist yet
- Go back to Step 1 and create the user account first

### "Admin dashboard not showing"?
- Make sure you ran the SQL in Step 2
- Log out and log back in
- Check browser console (F12) for errors

### Still getting "Invalid email or password"?
- Double-check the email is exactly: `findyourkismat@gmail.com`
- Make sure the password matches what you set
- Check that "Auto Confirm User" was checked when creating the account
- Try resetting the password in Supabase Dashboard

---

## Quick Checklist

- [ ] User account created in Supabase Dashboard
- [ ] User shows as "Confirmed" status
- [ ] SQL query run to create admin account
- [ ] Admin account verified in SQL results
- [ ] Logged out and logged back in
- [ ] Can see Admin Dashboard

---

## Direct Links

- **Create User**: https://supabase.com/dashboard/project/zgwcqyfeixtzriyujvdf/auth/users
- **SQL Editor**: https://supabase.com/dashboard/project/zgwcqyfeixtzriyujvdf/sql/new
- **View Users**: https://supabase.com/dashboard/project/zgwcqyfeixtzriyujvdf/auth/users

