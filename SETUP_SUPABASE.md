# Supabase Setup Guide - Fix "Failed to fetch" Error

## The Problem

Your `.env.local` file currently has placeholder values:
```
VITE_SUPABASE_URL=https://placeholder.supabase.co
VITE_SUPABASE_ANON_KEY=placeholder-key
```

This is why you're getting "Failed to fetch" - the app can't connect to a real Supabase instance.

---

## Step 1: Get Your Supabase Credentials

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project** (or create a new one if you don't have one)
3. **Go to Settings** → **API**
4. **Copy these values**:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (a long JWT token)

---

## Step 2: Update .env.local File

1. **Open** `.env.local` in your project root
2. **Replace** the placeholder values with your real Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Example:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. **Save** the file
4. **Restart** your dev server (stop with Ctrl+C and run `npm run dev` again)

---

## Step 3: Create the User Account in Supabase

**Option A: Through Supabase Dashboard (Easiest)**

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add User"** or **"Invite User"**
3. Fill in:
   - **Email**: `findyourkismat@gmail.com`
   - **Password**: `admin123` (or your preferred password)
   - **Auto Confirm User**: ✅ **Check this box** (so they don't need to verify email)
4. Click **"Create User"**

**Option B: Through Your App**

1. Go to your app at `http://localhost:3000`
2. Click **"Create an account"** or **"Sign Up"**
3. Use email: `findyourkismat@gmail.com`
4. Use password: `admin123`
5. Complete the signup process

---

## Step 4: Make the User an Admin

After the user account is created, run this SQL in **Supabase SQL Editor**:

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

**Verify it worked:**
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

## Step 5: Test the Login

1. **Restart your dev server** (if you haven't already):
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

2. **Go to** `http://localhost:3000`
3. **Sign in with**:
   - Email: `findyourkismat@gmail.com`
   - Password: `admin123` (or whatever you set)

4. **You should now**:
   - Successfully log in
   - See the Admin Dashboard (if admin account was created)
   - No more "Failed to fetch" errors

---

## Troubleshooting

### Still getting "Failed to fetch"?

1. **Check browser console** (F12) for detailed error messages
2. **Verify .env.local** has correct values (no quotes, no extra spaces)
3. **Restart dev server** after changing .env.local
4. **Check Supabase project** is active and not paused

### "Invalid login credentials"?

- User account doesn't exist yet - create it first (Step 3)
- Wrong password - reset it in Supabase Dashboard → Authentication → Users

### "User not found" when creating admin?

- User account doesn't exist - create it first (Step 3)
- Check the email is exactly `findyourkismat@gmail.com` (case-sensitive)

### Admin dashboard not showing?

- Make sure you ran the SQL to create admin account (Step 4)
- Log out and log back in
- Check browser console for errors

---

## Quick Checklist

- [ ] Supabase project created
- [ ] .env.local updated with real credentials
- [ ] Dev server restarted
- [ ] User account created (`findyourkismat@gmail.com`)
- [ ] Admin account created (SQL query run)
- [ ] Can log in successfully
- [ ] Admin dashboard appears

---

## Need Help?

If you're still having issues:
1. Check the browser console (F12) for error messages
2. Check Supabase Dashboard → Logs for API errors
3. Verify your Supabase project is not paused or deleted

