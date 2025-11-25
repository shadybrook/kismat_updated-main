# Setup Photo Upload Feature

## Step 1: Add photo_url Column to Database

1. **Go to Supabase SQL Editor**: https://supabase.com/dashboard/project/zgwcqyfeixtzriyujvdf/sql/new

2. **Run this SQL**:
   ```sql
   -- Add photo_url column if it doesn't exist
   DO $$ 
   BEGIN
     IF NOT EXISTS (
       SELECT 1 FROM information_schema.columns 
       WHERE table_name = 'profiles' AND column_name = 'photo_url'
     ) THEN
       ALTER TABLE profiles ADD COLUMN photo_url TEXT;
     END IF;
   END $$;
   ```

3. **Verify**: Should show "Success. No rows returned"

## Step 2: Create Storage Buckets

1. **Go to Supabase SQL Editor**: https://supabase.com/dashboard/project/zgwcqyfeixtzriyujvdf/sql/new

2. **Copy and paste the entire contents of `setup-storage-buckets.sql`**

3. **Click "Run"**

4. **Verify**: Should show:
   ```
   ✅ Storage buckets ready!
   bucket_id: profile-photos
   is_public: true
   ```

## Step 3: Verify Storage Buckets in Dashboard

1. **Go to Storage**: https://supabase.com/dashboard/project/zgwcqyfeixtzriyujvdf/storage/buckets

2. **You should see two buckets**:
   - `profile-photos` (public)
   - `event-images` (public)

## Step 4: Test Photo Upload

1. **Refresh your app** at http://localhost:3001

2. **Go to Profile Creation page**

3. **Click "Choose File" or "Take Photo"**

4. **Select or capture an image**

5. **Click "Upload & Verify"**

6. **You should see**: ✓ Photo verified! message

## Features

✅ **Upload from Gallery**: Users can select existing photos  
✅ **Camera Capture**: Users can take photos directly from their phone  
✅ **Image Preview**: Shows preview before uploading  
✅ **Auto Verification**: Shows verified status immediately after upload  
✅ **Database Storage**: Photo URL saved to profile in database  
✅ **Error Handling**: Shows clear error messages if upload fails  

## Troubleshooting

**If upload fails:**
1. Check browser console for errors
2. Verify storage buckets exist in Supabase Dashboard
3. Check that storage policies are set correctly
4. Ensure user is authenticated before uploading

**If photo doesn't show:**
1. Check that `photo_url` column exists in `profiles` table
2. Verify the image URL is saved in the database
3. Check browser console for image loading errors
