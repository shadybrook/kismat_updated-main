# How to Create Another Admin Account

There are **3 ways** to create an admin account for your Kismat project:

## Method 1: Using Supabase SQL Editor (Recommended)

This is the easiest and most direct method.

### Steps:

1. **Go to your Supabase Dashboard**
   - Open https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Find the user's auth_user_id** (if you know their email):
   ```sql
   SELECT 
     id as auth_user_id,
     email,
     created_at
   FROM auth.users
   WHERE email = 'user@example.com';
   ```
   Replace `'user@example.com'` with the actual email address.

4. **Create the admin account**:
   ```sql
   INSERT INTO admin_users (auth_user_id, created_at)
   VALUES ('USER_ID_FROM_STEP_3', NOW())
   ON CONFLICT (auth_user_id) DO NOTHING;
   ```
   Replace `'USER_ID_FROM_STEP_3'` with the `auth_user_id` from step 3.

5. **Verify the admin was created**:
   ```sql
   SELECT 
     au.id,
     au.auth_user_id,
     au.created_at,
     u.email
   FROM admin_users au
   JOIN auth.users u ON au.auth_user_id = u.id
   ORDER BY au.created_at DESC;
   ```

### Alternative: Create admin directly by email

If you know the user's email, you can do it in one step:

```sql
INSERT INTO admin_users (auth_user_id, created_at)
SELECT 
  id as auth_user_id,
  NOW() as created_at
FROM auth.users
WHERE email = 'user@example.com'
ON CONFLICT (auth_user_id) DO NOTHING;
```

---

## Method 2: Using the Browser Console (For Developers)

If you're logged in as an existing admin, you can use the browser console:

1. **Open your app** and log in as an existing admin
2. **Open Browser Console** (F12 or Cmd+Option+I)
3. **Run this code** (replace with the user's email):
   ```javascript
   // First, you need to get the user's auth_user_id
   // This requires the user to be signed up first
   
   // If you have access to Supabase dashboard, use Method 1 instead
   // This method is for programmatic access
   ```

**Note:** This method requires the user to already have an account. Method 1 is easier.

---

## Method 3: Programmatically via Code

You can also add admin management to your Admin Dashboard UI. The functions are already available in `src/utils/supabase.ts`:

```typescript
// Create admin account
const result = await db.createAdminAccount(authUserId);
if (result.success) {
  console.log('Admin created!');
}

// Remove admin account
const result = await db.removeAdminAccount(authUserId);

// List all admins
const result = await db.getAllAdmins();
console.log(result.admins);
```

---

## Important Notes:

1. **The user must exist first**: The user needs to sign up and create an account before you can make them an admin.

2. **auth_user_id vs profile id**: 
   - `auth_user_id` is from the `auth.users` table (Supabase Auth)
   - This is different from the profile `id` in the `profiles` table
   - The `admin_users` table uses `auth_user_id`

3. **Verify admin status**: After creating an admin account, the user needs to:
   - Log out and log back in
   - They should then see the Admin Dashboard instead of the regular dashboard

4. **Security**: Only existing admins should be able to create new admin accounts. Make sure your Row Level Security (RLS) policies are set up correctly in Supabase.

---

## Troubleshooting:

**"User not found" error:**
- Make sure the user has signed up and confirmed their email
- Check that the email is correct in the SQL query

**"Already an admin" message:**
- The user is already an admin, no action needed

**Admin not working after creation:**
- User needs to log out and log back in
- Check that the `auth_user_id` matches exactly (case-sensitive UUID)

---

## Quick Reference SQL:

```sql
-- Find user by email
SELECT id, email FROM auth.users WHERE email = 'user@example.com';

-- Create admin (replace USER_ID)
INSERT INTO admin_users (auth_user_id, created_at)
VALUES ('USER_ID', NOW())
ON CONFLICT (auth_user_id) DO NOTHING;

-- List all admins
SELECT au.*, u.email 
FROM admin_users au
JOIN auth.users u ON au.auth_user_id = u.id;

-- Remove admin
DELETE FROM admin_users WHERE auth_user_id = 'USER_ID';
```

