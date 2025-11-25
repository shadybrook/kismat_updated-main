# 🚨 Quick Fix for "Failed to Fetch" Error

## ⚡ 3-Step Quick Fix (5 minutes)

### Step 1: Check Vercel Environment Variables (2 min)

1. Go to: https://vercel.com → Your Project → **Settings** → **Environment Variables**
2. Verify these exist:
   - `VITE_SUPABASE_URL` = `https://xxxxx.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGc...` (long string)
3. **IMPORTANT**: Make sure both are enabled for:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development
4. If missing/wrong → **Add/Update** → **Save**

### Step 2: Configure Supabase CORS (2 min)

1. Go to: https://app.supabase.com → Your Project
2. **Settings** → **API** → Scroll to **CORS**
3. Add your Vercel domain:
   ```
   https://your-app.vercel.app
   https://*.vercel.app
   ```
4. Click **Save**

### Step 3: Redeploy on Vercel (1 min)

1. Go to: Vercel → Your Project → **Deployments**
2. Click **"..."** on latest deployment → **Redeploy**
3. Wait 2-3 minutes for deployment to complete
4. Test your app again

---

## 🔍 Still Not Working? Check These:

### Check 1: Supabase Project Status
- Go to Supabase Dashboard
- Is project **Active**? (Not paused)
- If paused → Click **Restore**

### Check 2: Browser Console
1. Open your Vercel app
2. Press `F12` → **Console** tab
3. Look for:
   - `❌ Supabase environment variables not set!` → Environment variables missing
   - `CORS policy` → CORS not configured
   - `Failed to fetch` → Connection issue

### Check 3: Environment Variables Format
- ✅ Correct: `https://xxxxx.supabase.co`
- ❌ Wrong: `https://app.supabase.com/project/xxx`
- ❌ Wrong: `http://` (must be `https://`)

---

## 📋 Verification Checklist

After fixing, verify:

- [ ] Environment variables set in Vercel
- [ ] Variables enabled for all environments (Production/Preview/Development)
- [ ] Supabase CORS includes Vercel domain
- [ ] Supabase project is Active (not paused)
- [ ] Redeployed on Vercel
- [ ] Browser console shows no errors
- [ ] Can sign in successfully

---

## 🆘 Need More Help?

See detailed guide: `FIX_FAILED_TO_FETCH.md`

**Most Common Issue**: CORS not configured + Environment variables not set correctly
