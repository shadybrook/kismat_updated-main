# Fix "Failed to Fetch" Error on Vercel

## Quick Diagnosis Checklist

### ✅ Step 1: Verify Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Verify these are set:
   - `VITE_SUPABASE_URL` = Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key
4. **IMPORTANT**: Make sure they're enabled for **Production**, **Preview**, AND **Development**
5. **Redeploy** after adding/changing variables

### ✅ Step 2: Configure Supabase CORS

1. Go to Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to **Settings** → **API**
4. Scroll to **CORS** section
5. Add these URLs (one per line):
   ```
   https://your-app.vercel.app
   https://*.vercel.app
   https://your-app-git-main-chintans-projects.vercel.app
   ```
6. Click **Save**

### ✅ Step 3: Check Supabase Project Status

1. Go to Supabase Dashboard
2. Check if your project is **Active** (not paused)
3. Free tier projects pause after 7 days of inactivity
4. If paused, click **Restore** to reactivate

### ✅ Step 4: Verify Supabase URL Format

Your Supabase URL should look like:
```
https://xxxxxxxxxxxxx.supabase.co
```

**NOT**:
- `https://app.supabase.com/project/xxx`
- `http://` (must be `https://`)

### ✅ Step 5: Check Browser Console

1. Open your Vercel app
2. Press `F12` or right-click → **Inspect**
3. Go to **Console** tab
4. Look for errors like:
   - `CORS policy`
   - `Network error`
   - `Failed to fetch`
   - Environment variable values (should NOT show `placeholder`)

### ✅ Step 6: Test Environment Variables

Add this to your browser console on the Vercel site:
```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...');
```

**Expected**: Should show your actual Supabase URL and key
**If shows**: `undefined` or `placeholder` → Environment variables not set correctly

## Common Issues & Solutions

### Issue 1: Environment Variables Not Loading

**Symptoms**: Console shows `undefined` or `placeholder`

**Solution**:
1. In Vercel, go to **Settings** → **Environment Variables**
2. Delete and re-add the variables
3. Make sure they're enabled for all environments
4. **Redeploy** (go to **Deployments** → click **...** → **Redeploy**)

### Issue 2: CORS Error

**Symptoms**: Console shows `CORS policy` error

**Solution**:
1. Add your Vercel domain to Supabase CORS settings
2. Include both:
   - Production URL: `https://your-app.vercel.app`
   - Preview URLs: `https://*.vercel.app`
3. Save and wait 1-2 minutes for changes to propagate

### Issue 3: Supabase Project Paused

**Symptoms**: All requests fail, no specific error

**Solution**:
1. Go to Supabase Dashboard
2. If project shows "Paused", click **Restore**
3. Wait 1-2 minutes for project to restart

### Issue 4: Wrong Supabase URL

**Symptoms**: Network errors, connection refused

**Solution**:
1. Get correct URL from: Supabase Dashboard → Settings → API
2. Should be: `https://[project-ref].supabase.co`
3. Update in Vercel environment variables
4. Redeploy

## Step-by-Step Fix

### 1. Get Your Supabase Credentials

```bash
# Go to: https://app.supabase.com
# → Your Project → Settings → API
# Copy:
# - Project URL: https://xxxxx.supabase.co
# - anon key: eyJhbGc...
```

### 2. Update Vercel Environment Variables

```bash
# In Vercel Dashboard:
# Settings → Environment Variables

# Add/Update:
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-key-here

# Enable for: Production, Preview, Development
# Save
```

### 3. Configure Supabase CORS

```bash
# In Supabase Dashboard:
# Settings → API → CORS

# Add:
https://your-app.vercel.app
https://*.vercel.app

# Save
```

### 4. Redeploy on Vercel

```bash
# In Vercel Dashboard:
# Deployments → Click "..." → Redeploy
# OR
# Push a new commit to trigger auto-deploy
```

### 5. Test

1. Visit your Vercel URL
2. Open browser console (F12)
3. Try to sign in
4. Check console for errors
5. Verify environment variables are loaded

## Debugging Commands

### Check Environment Variables in Browser

Open browser console on your Vercel site and run:

```javascript
// Check if variables are loaded
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('Key length:', import.meta.env.VITE_SUPABASE_ANON_KEY?.length);

// Test Supabase connection
import { createClient } from '@supabase/supabase-js';
const testClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
testClient.from('profiles').select('count').then(console.log).catch(console.error);
```

## Still Not Working?

1. **Check Vercel Build Logs**:
   - Go to Vercel → Your Project → Deployments
   - Click on latest deployment
   - Check build logs for errors

2. **Check Supabase Logs**:
   - Go to Supabase Dashboard → Logs
   - Check for API errors

3. **Test Locally**:
   ```bash
   # Create .env.local file
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-key
   
   # Run locally
   npm run dev
   # Test if it works locally
   ```

4. **Contact Support**:
   - Vercel: https://vercel.com/support
   - Supabase: https://supabase.com/support

## Quick Test Script

Add this to your browser console on the Vercel site to test:

```javascript
(async () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('🔍 Environment Check:');
  console.log('URL:', url || '❌ MISSING');
  console.log('Key:', key ? key.substring(0, 20) + '...' : '❌ MISSING');
  
  if (!url || !key) {
    console.error('❌ Environment variables not set!');
    return;
  }
  
  try {
    const response = await fetch(`${url}/rest/v1/`, {
      headers: { 'apikey': key }
    });
    console.log('✅ Supabase connection:', response.ok ? 'SUCCESS' : 'FAILED');
  } catch (error) {
    console.error('❌ Connection error:', error);
  }
})();
```

---

**Most Common Fix**: Add Vercel domain to Supabase CORS + Redeploy on Vercel
