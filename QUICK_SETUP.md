# Quick Supabase Setup for Testing

Based on your Supabase dashboard, I can see your project reference is: **zgwcqyfeixtzriyujvdf**

## Step 1: Get Your Anon Key

1. **Go to**: https://supabase.com/dashboard/project/zgwcqyfeixtzriyujvdf/settings/api
2. **Find** the section "Project API keys"
3. **Copy** the **`anon`** or **`public`** key (it's a long JWT token that starts with `eyJ...`)

## Step 2: Update .env.local

Your Supabase URL is: `https://zgwcqyfeixtzriyujvdf.supabase.co`

Update your `.env.local` file with:

```env
VITE_SUPABASE_URL=https://zgwcqyfeixtzriyujvdf.supabase.co
VITE_SUPABASE_ANON_KEY=paste-your-anon-key-here
```

**Or run the setup script:**
```bash
chmod +x update-supabase-config.sh
./update-supabase-config.sh
```

## Step 3: Create the Admin User Account

### Option A: Through Supabase Dashboard (Easiest)

1. Go to: https://supabase.com/dashboard/project/zgwcqyfeixtzriyujvdf/auth/users
2. Click **"Add User"** or **"Invite User"**
3. Fill in:
   - **Email**: `findyourkismat@gmail.com`
   - **Password**: `admin123`
   - ✅ **Check "Auto Confirm User"** (so no email verification needed)
4. Click **"Create User"**

### Option B: Through Your App

1. Go to `http://localhost:3000`
2. Click **"Create an account"**
3. Use:
   - Email: `findyourkismat@gmail.com`
   - Password: `admin123`
4. Complete signup

## Step 4: Make User an Admin

1. Go to: https://supabase.com/dashboard/project/zgwcqyfeixtzriyujvdf/sql/new
2. **Run this SQL**:

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

## Step 5: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

## Step 6: Test Login

1. Go to `http://localhost:3000`
2. Sign in with:
   - Email: `findyourkismat@gmail.com`
   - Password: `admin123`
3. You should see the Admin Dashboard!

---

## Quick Links for Your Project

- **Dashboard**: https://supabase.com/dashboard/project/zgwcqyfeixtzriyujvdf
- **API Settings**: https://supabase.com/dashboard/project/zgwcqyfeixtzriyujvdf/settings/api
- **Authentication**: https://supabase.com/dashboard/project/zgwcqyfeixtzriyujvdf/auth/users
- **SQL Editor**: https://supabase.com/dashboard/project/zgwcqyfeixtzriyujvdf/sql/new

---

## Troubleshooting

### Still getting "Failed to fetch"?
- Make sure `.env.local` has the correct anon key (not "placeholder-key")
- Restart the dev server after updating `.env.local`
- Check browser console (F12) for specific error messages

### "Invalid login credentials"?
- User account doesn't exist - create it first (Step 3)
- Wrong password - check what you set

### Admin dashboard not showing?
- Make sure you ran the SQL to create admin (Step 4)
- Log out and log back in
- Check that `admin_users` table has the entry

