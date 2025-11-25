-- ============================================
-- Setup Supabase Storage Buckets for Kismat
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Create profile-photos bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Create event-images bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- Step 3: Set up policies for profile-photos bucket
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view profile photos" ON storage.objects;

-- Allow authenticated users to upload profile photos
CREATE POLICY "Users can upload own profile photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-photos');

-- Allow authenticated users to update profile photos
CREATE POLICY "Users can update own profile photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-photos');

-- Allow authenticated users to delete profile photos
CREATE POLICY "Users can delete own profile photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profile-photos');

-- Allow public read access to profile photos
CREATE POLICY "Public can view profile photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

-- Step 4: Set up policies for event-images bucket
-- Allow authenticated users to upload event images
CREATE POLICY "Users can upload event images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event-images');

-- Allow authenticated users to update their own event images
CREATE POLICY "Users can update own event images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'event-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access to event images
CREATE POLICY "Public can view event images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'event-images');

-- Step 5: Verify buckets were created
SELECT 
  '✅ Storage buckets ready!' as status,
  id as bucket_id,
  name,
  public as is_public
FROM storage.buckets
WHERE id IN ('profile-photos', 'event-images');
