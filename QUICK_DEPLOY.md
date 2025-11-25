# 🚀 Quick Deploy to Vercel - 5 Minutes

## Step 1: Get Supabase Keys (2 min)
1. Go to: https://app.supabase.com → Your Project → Settings → API
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon key**: `eyJhbGc...` (long string)

## Step 2: Deploy to Vercel (3 min)
1. Go to: https://vercel.com → Sign in with GitHub
2. Click **"Add New Project"**
3. Import: `shadybrook/kismat_updated-main`
4. **Add Environment Variables**:
   ```
   VITE_SUPABASE_URL = [paste your Supabase URL]
   VITE_SUPABASE_ANON_KEY = [paste your anon key]
   ```
5. Click **"Deploy"**

## Step 3: Configure Supabase (2 min)
1. Supabase Dashboard → Settings → API → **CORS**
   - Add: `https://your-app.vercel.app`
   - Add: `https://*.vercel.app`
2. Authentication → URL Configuration
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/**`

## ✅ Done!
Your app is live at: `https://your-app.vercel.app`

Share this URL with users in Mumbai to test!

---

**Full guide**: See `VERCEL_DEPLOYMENT.md` for detailed instructions.
