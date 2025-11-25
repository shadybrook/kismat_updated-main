# Deploy Kismat to Vercel - Complete Guide

This guide will help you deploy your Kismat app to Vercel so users across Mumbai can test it.

## Prerequisites

- ✅ GitHub repository (already done: https://github.com/shadybrook/kismat_updated-main)
- ✅ Supabase project set up
- ✅ Vercel account (free tier works perfectly)

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project: https://app.supabase.com
2. Click on **Settings** (gear icon) → **API**
3. Copy these two values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

**Keep these handy** - you'll need them in Step 3!

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with your GitHub account
3. **Click "Add New Project"**
4. **Import your repository**:
   - Search for `kismat_updated-main`
   - Click **Import**
5. **Configure Project**:
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build` (should auto-fill)
   - **Output Directory**: `dist` (should auto-fill)
   - **Install Command**: `npm install` (should auto-fill)
6. **Add Environment Variables** (IMPORTANT!):
   - Click **"Environment Variables"**
   - Add these two variables:
     ```
     Name: VITE_SUPABASE_URL
     Value: [Your Supabase Project URL]
     
     Name: VITE_SUPABASE_ANON_KEY
     Value: [Your Supabase anon key]
     ```
   - Make sure to select **Production**, **Preview**, and **Development** for both
7. **Click "Deploy"**

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from your project directory)
cd /Users/chintandedhia/Downloads/kismat_updated-main
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: kismat_updated-main
# - Directory: ./
# - Override settings? No

# Add environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Deploy to production
vercel --prod
```

## Step 3: Configure Supabase for Production

### Enable CORS for Your Vercel Domain

1. Go to Supabase Dashboard → **Settings** → **API**
2. Under **CORS**, add your Vercel domain:
   - `https://your-app.vercel.app`
   - `https://*.vercel.app` (for preview deployments)

### Update Supabase Auth Settings

1. Go to **Authentication** → **URL Configuration**
2. Add to **Site URL**: `https://your-app.vercel.app`
3. Add to **Redirect URLs**:
   - `https://your-app.vercel.app/**`
   - `https://your-app.vercel.app/auth/callback`

### Storage Bucket Policies

Your storage buckets should already be configured, but verify:
- `profile-photos` bucket is **public**
- `event-images` bucket is **public**
- Policies allow authenticated users to upload

## Step 4: Test Your Deployment

1. **Visit your Vercel URL**: `https://your-app.vercel.app`
2. **Test these features**:
   - ✅ Sign up / Login
   - ✅ Profile creation with photo upload
   - ✅ Personality questions
   - ✅ Events page
   - ✅ Event creation with image upload
   - ✅ Payment flow

## Step 5: Share with Users in Mumbai

Your app is now live! Share the Vercel URL with test users.

**Example URL**: `https://kismat-community.vercel.app`

## Troubleshooting

### Issue: "Supabase connection failed"
- ✅ Check environment variables are set correctly in Vercel
- ✅ Verify Supabase URL and anon key
- ✅ Check browser console for errors

### Issue: "CORS error"
- ✅ Add Vercel domain to Supabase CORS settings
- ✅ Check Supabase project is active

### Issue: "Build failed"
- ✅ Check Vercel build logs
- ✅ Ensure all dependencies are in `package.json`
- ✅ Verify Node.js version (Vercel auto-detects, but you can set it in `package.json`)

### Issue: "Images not uploading"
- ✅ Verify storage bucket policies in Supabase
- ✅ Check bucket is set to public
- ✅ Verify environment variables are set

## Environment Variables Reference

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Supabase Dashboard → Settings → API |

## Post-Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] Supabase CORS configured
- [ ] Supabase Auth redirect URLs updated
- [ ] Storage buckets are public
- [ ] Test sign up/login
- [ ] Test image uploads
- [ ] Test event creation
- [ ] Share URL with test users

## Updating Your Deployment

Every time you push to GitHub:
- Vercel automatically redeploys
- Preview deployments are created for each PR
- Production updates when you merge to `main`

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Check Vercel deployment logs for errors

---

**Your app will be live at**: `https://[your-project-name].vercel.app`

Enjoy! 🚀
