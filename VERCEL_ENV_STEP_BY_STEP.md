# Fix Vercel Environment Variables - Step by Step

## 🚨 Issue Confirmed

Your console still shows `https://placeholder.supabase.co` which means environment variables are **NOT** set correctly in Vercel.

## 📋 Step-by-Step Fix

### Step 1: Get Your Supabase Credentials

1. **Open new tab**: https://app.supabase.com
2. **Select your project** (the one you created for Kismat)
3. **Click Settings** (gear icon in sidebar)
4. **Click API**
5. **Copy these two values**:

   **Project URL** (should look like):
   ```
   https://abcdefghijklmnop.supabase.co
   ```

   **anon/public key** (should look like):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzOTU4NzIwMCwiZXhwIjoxOTU1MTYzMjAwfQ.example-key-here
   ```

### Step 2: Set Environment Variables in Vercel

1. **Open new tab**: https://vercel.com/dashboard
2. **Find your project**: `kismat-updated-main`
3. **Click on the project name**
4. **Click Settings** (top navigation)
5. **Click Environment Variables** (left sidebar)

### Step 3: Delete Existing Variables (Important!)

1. **Look for existing variables** starting with `VITE_SUPABASE_`
2. **Click the "..." menu** next to each one
3. **Click Delete**
4. **Confirm deletion**

### Step 4: Add New Variables

**Add Variable 1:**
1. **Click "Add New"**
2. **Name**: `VITE_SUPABASE_URL`
3. **Value**: Paste your Supabase Project URL (from Step 1)
4. **Environments**: Check ALL THREE boxes:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. **Click Save**

**Add Variable 2:**
1. **Click "Add New"** again
2. **Name**: `VITE_SUPABASE_ANON_KEY`
3. **Value**: Paste your Supabase anon key (from Step 1)
4. **Environments**: Check ALL THREE boxes:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. **Click Save**

### Step 5: Force Redeploy

1. **Click Deployments** (top navigation)
2. **Find the latest deployment**
3. **Click the "..." menu** on the right
4. **Click "Redeploy"**
5. **Click "Redeploy" again** to confirm
6. **Wait 2-3 minutes** for deployment to complete

### Step 6: Verify Fix

1. **Visit your Vercel URL** (after deployment completes)
2. **Open browser console** (F12 → Console tab)
3. **Look for this log**:
   ```
   🔧 Supabase Configuration: {
     url: "https://your-actual-project.supabase.co",  // Should be your real URL
     urlValid: true,
     keyExists: true,
     keyLength: 180+
   }
   ```
4. **Try signing in** - should work without "Failed to fetch" error

## 🔍 Common Mistakes to Avoid

### ❌ Wrong URL Format
- **Wrong**: `https://app.supabase.com/project/abcdefg`
- **Wrong**: `http://abcdefg.supabase.co` (missing 's' in https)
- **Correct**: `https://abcdefg.supabase.co`

### ❌ Not Enabling All Environments
- Must check **Production**, **Preview**, AND **Development**

### ❌ Not Redeploying
- Environment variables only take effect after redeployment

### ❌ Copying Wrong Key
- Use **anon/public** key, NOT the **service_role** key

## 🆘 Still Not Working?

### Check 1: Verify Variables Were Saved
1. Go back to Vercel → Settings → Environment Variables
2. You should see both variables listed
3. Each should show "Production, Preview, Development"

### Check 2: Check Deployment Status
1. Go to Deployments tab
2. Latest deployment should show "Ready" with green checkmark
3. If failed, click on it to see error logs

### Check 3: Test Environment Variables
Open browser console on your Vercel site and run:
```javascript
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

**Expected result**: Should show your actual Supabase URL, not "placeholder"

## 📞 Need Help?

If still not working, share:
1. Screenshot of your Vercel environment variables page
2. Your Supabase project URL (first part only, like `https://abcdefg.supabase.co`)
3. Console output after following these steps

---

**The key is ensuring environment variables are properly set AND redeploying afterward.**
