# Create Admin Account for findyourkismat@gmail.com

## Important: User Account Must Exist First

Before making someone an admin, they need to have a user account. Here are your options:

---

## Option 1: User Already Exists (Recommended - Easiest)

If the user `findyourkismat@gmail.com` has already signed up:

1. **Go to Supabase Dashboard** → **SQL Editor**
2. **Run this query**:

```sql
-- Create admin account for findyourkismat@gmail.com
INSERT INTO admin_users (auth_user_id, created_at)
SELECT 
  id as auth_user_id,
  NOW() as created_at
FROM auth.users
WHERE email = 'findyourkismat@gmail.com'
ON CONFLICT (auth_user_id) DO NOTHING;
```

3. **Verify it worked**:

```sql
SELECT 
  au.id as admin_id,
  u.email,
  u.email_confirmed_at
FROM admin_users au
JOIN auth.users u ON au.auth_user_id = u.id
WHERE u.email = 'findyourkismat@gmail.com';
```

---

## Option 2: Create User Account First (If they don't exist)

### Method A: Through Supabase Dashboard (Easiest)

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add User"** or **"Invite User"**
3. Enter email: `findyourkismat@gmail.com`
4. Set a password (you mentioned "very basic" - something like `admin123` or `password123`)
5. **Uncheck "Auto Confirm User"** if you want them to verify email, or **check it** to auto-confirm
6. Click **"Create User"**
7. Then run the SQL from Option 1 to make them admin

### Method B: Through Your App

1. Have them sign up through your app at `http://localhost:3000`
2. Use email: `findyourkismat@gmail.com`
3. Use a simple password like `admin123`
4. Then run the SQL from Option 1 to make them admin

### Method C: Using Supabase Admin API (Advanced)

If you have access to the service role key, you can create the user programmatically. But the Dashboard method (Method A) is easier.

---

## Option 3: All-in-One Script (Check + Create Admin)

Run this in Supabase SQL Editor - it will check if user exists and create admin:

```sql
-- Check if user exists and create admin in one go
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Check if user exists
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'findyourkismat@gmail.com';
  
  IF v_user_id IS NULL THEN
    RAISE NOTICE 'User findyourkismat@gmail.com does not exist. Please create the user account first through Supabase Dashboard → Authentication → Add User';
  ELSE
    -- Create admin account
    INSERT INTO admin_users (auth_user_id, created_at)
    VALUES (v_user_id, NOW())
    ON CONFLICT (auth_user_id) DO NOTHING;
    
    RAISE NOTICE 'Admin account created successfully for findyourkismat@gmail.com';
  END IF;
END $$;

-- Verify
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM admin_users au
      JOIN auth.users u ON au.auth_user_id = u.id
      WHERE u.email = 'findyourkismat@gmail.com'
    ) THEN '✅ Admin account exists'
    ELSE '❌ Admin account NOT found - user may not exist'
  END as status;
```

---

## After Creating Admin Account

1. **User must log out and log back in** to see admin dashboard
2. They can now log in with:
   - Email: `findyourkismat@gmail.com`
   - Password: (whatever password was set)

---

## Quick Password Suggestions

Since you want a "very basic" password, here are some simple options:
- `admin123`
- `password123`
- `kismat123`
- `admin2024`

**Note:** For production, use a stronger password and consider enabling 2FA.

---

## Troubleshooting

**"User not found" error:**
- The user account doesn't exist yet
- Create it first using Option 2, Method A (Supabase Dashboard)

**"Already an admin" message:**
- The user is already an admin - no action needed

**Admin dashboard not showing:**
- User needs to log out and log back in
- Clear browser cache if needed

