-- ============================================
-- Complete Database Setup for Kismat
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email TEXT,
  name TEXT,
  age TEXT,
  gender TEXT,
  pronouns TEXT,
  work_study TEXT,
  photo_url TEXT,
  apartment TEXT,
  locality TEXT,
  suburb TEXT,
  city TEXT,
  personality_answers JSONB DEFAULT '{}',
  joined_events TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add photo_url column if table already exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'photo_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN photo_url TEXT;
  END IF;
END $$;

-- Step 2: Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date TEXT,
  time TEXT,
  location TEXT,
  city TEXT,
  category TEXT,
  price INTEGER DEFAULT 150,
  total_spots INTEGER,
  spots_left INTEGER,
  participants TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  creator_paid BOOLEAN DEFAULT false,
  event_filled BOOLEAN DEFAULT false,
  girls_only BOOLEAN DEFAULT false,
  min_participants INTEGER DEFAULT 1,
  max_participants INTEGER,
  creator_group_size INTEGER DEFAULT 1,
  creator_payment_amount INTEGER DEFAULT 150,
  image_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create user_events table (for tracking who joined which events)
CREATE TABLE IF NOT EXISTS user_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  payment_status TEXT DEFAULT 'pending',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Step 5: Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT,
  page_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 6: Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Step 7: Create policies for profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT
USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT
WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE
USING (auth.uid() = auth_user_id)
WITH CHECK (auth.uid() = auth_user_id);

-- Step 8: Create policies for admin_users table
DROP POLICY IF EXISTS "Allow all for admin_users" ON admin_users;
CREATE POLICY "Allow all for admin_users" 
ON admin_users FOR ALL
USING (true)
WITH CHECK (true);

-- Step 9: Create policies for events table
DROP POLICY IF EXISTS "Anyone can view approved events" ON events;
DROP POLICY IF EXISTS "Users can create events" ON events;
DROP POLICY IF EXISTS "Users can update own events" ON events;

CREATE POLICY "Anyone can view approved events" 
ON events FOR SELECT
USING (status = 'approved' OR auth.uid() = created_by);

CREATE POLICY "Users can create events" 
ON events FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own events" 
ON events FOR UPDATE
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- Step 10: Create policies for user_events table
DROP POLICY IF EXISTS "Users can view own event joins" ON user_events;
DROP POLICY IF EXISTS "Users can join events" ON user_events;

CREATE POLICY "Users can view own event joins" 
ON user_events FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can join events" 
ON user_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Step 11: Create policies for analytics table
DROP POLICY IF EXISTS "Users can insert analytics" ON analytics;
CREATE POLICY "Users can insert analytics" 
ON analytics FOR INSERT
WITH CHECK (true);

-- Step 12: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_auth_user_id ON profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_auth_user_id ON admin_users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_events_city ON events(city);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_event_id ON user_events(event_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);

-- Step 13: Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 14: Create triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 15: Verify all tables exist
SELECT 
  '✅ Database setup complete!' as status,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'profiles') as profiles_table,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'admin_users') as admin_users_table,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'events') as events_table,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'user_events') as user_events_table,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'analytics') as analytics_table;
