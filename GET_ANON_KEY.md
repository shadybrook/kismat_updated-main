# How to Get Your Supabase Anon Key

## Quick Steps:

1. **Go to your Supabase API Settings**:
   - Direct link: https://supabase.com/dashboard/project/zgwcqyfeixtzriyujvdf/settings/api
   - Or: Dashboard → Your Project → Settings → API

2. **Find the "Project API keys" section**

3. **Look for the `anon` or `public` key**:
   - It's a long JWT token
   - Starts with `eyJ...`
   - It's the one labeled "anon" or "public" (NOT "service_role")

4. **Copy the entire key** (it's very long, make sure you get it all)

5. **Update your `.env.local` file**:
   - Open `.env.local` in your project
   - Replace `YOUR_ANON_KEY_HERE` with the actual key
   - Save the file

6. **Restart your dev server**:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

## Example of what it should look like:

```env
VITE_SUPABASE_URL=https://zgwcqyfeixtzriyujvdf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpn...
```

**Note**: The key is very long (hundreds of characters). Make sure you copy the entire key!

## Visual Guide:

In the Supabase Dashboard → Settings → API page, you'll see:

```
Project API keys
┌─────────────────────────────────────────┐
│ anon / public                          │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...│ ← Copy this entire key
│ [Copy] button                           │
└─────────────────────────────────────────┘
```

Click the "Copy" button next to the `anon` key to copy it automatically.

