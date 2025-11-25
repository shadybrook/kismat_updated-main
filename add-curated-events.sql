-- ============================================
-- Add Curated Events to Kismat
-- These events will be visible to all users
-- Run this in Supabase SQL Editor
-- ============================================

-- Insert curated events with status 'approved' so they're visible to all users
-- Note: These are template events. Users can create specific instances with dates/times
-- These events have is_curated = true to distinguish them from user-created events
INSERT INTO events (
  title,
  description,
  category,
  city,
  date,
  time,
  location,
  price,
  total_spots,
  spots_left,
  status,
  girls_only,
  creator_paid,
  event_filled,
  min_participants,
  max_participants,
  is_curated,
  image_url,
  created_at,
  updated_at
) VALUES
-- 1. Paddle Pickle
(
  'Paddle Pickle 🥪',
  'Join us for an exciting game of pickleball! Whether you''re a beginner or pro, come enjoy this fun paddle sport. All equipment provided.',
  'Sports',
  'Mumbai',
  'TBD',
  'TBD',
  'Location TBD',
  150,
  12,
  12,
  'approved',
  false,
  true,
  false,
  4,
  12,
  true, -- is_curated
  'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop&crop=center',
  NOW(),
  NOW()
),

-- 2. Karaoke Nights
(
  'Karaoke Nights 🎤',
  'Sing your heart out at our karaoke night! Choose from thousands of songs and enjoy a fun evening with fellow music lovers.',
  'Entertainment',
  'Mumbai',
  'TBD',
  'TBD',
  'Location TBD',
  150,
  15,
  15,
  'approved',
  false,
  true,
  false,
  6,
  15,
  true, -- is_curated
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center',
  NOW(),
  NOW()
),

-- 3. Run Clubs / Morning Runs
(
  'Run Clubs / Morning Runs 🏃',
  'Start your day right with a refreshing morning run! Join our running club for regular meetups, scenic routes, and great company.',
  'Fitness',
  'Mumbai',
  'TBD',
  'TBD',
  'Location TBD',
  150,
  20,
  20,
  'approved',
  false,
  true,
  false,
  5,
  20,
  true, -- is_curated
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center',
  NOW(),
  NOW()
),

-- 4. Cycling
(
  'Cycling 🚴',
  'Explore the city on two wheels! Join our cycling group for weekend rides, scenic routes, and a healthy dose of adventure.',
  'Fitness',
  'Mumbai',
  'TBD',
  'TBD',
  'Location TBD',
  150,
  10,
  10,
  'approved',
  false,
  true,
  false,
  4,
  10,
  true, -- is_curated
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center',
  NOW(),
  NOW()
),

-- 5. Board Game Nights
(
  'Board Game Nights 🎲',
  'Unplug and have fun with classic and modern board games! From strategy games to party games, there''s something for everyone.',
  'Social',
  'Mumbai',
  'TBD',
  'TBD',
  'Location TBD',
  150,
  12,
  12,
  'approved',
  false,
  true,
  false,
  4,
  12,
  true, -- is_curated
  'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=600&fit=crop&crop=center',
  NOW(),
  NOW()
),

-- 6. Dinners
(
  'Dinners 🍽️',
  'Enjoy great food and great company! Join us for dinner at some of the city''s best restaurants and make new friends over a meal.',
  'Food & Dining',
  'Mumbai',
  'TBD',
  'TBD',
  'Location TBD',
  150,
  8,
  8,
  'approved',
  false,
  true,
  false,
  4,
  8,
  true, -- is_curated
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&crop=center',
  NOW(),
  NOW()
),

-- 7. Sport Screenings
(
  'Sport Screenings 🏆',
  'Watch the big game together! Join fellow sports fans to cheer on your favorite teams at our screening events.',
  'Entertainment',
  'Mumbai',
  'TBD',
  'TBD',
  'Location TBD',
  150,
  25,
  25,
  'approved',
  false,
  true,
  false,
  10,
  25,
  true, -- is_curated
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop&crop=center',
  NOW(),
  NOW()
),

-- 8. Concerts
(
  'Concerts 🎵',
  'Experience live music together! Join us for concerts, gigs, and music events around the city. Discover new artists and enjoy amazing performances.',
  'Entertainment',
  'Mumbai',
  'TBD',
  'TBD',
  'Location TBD',
  150,
  15,
  15,
  'approved',
  false,
  true,
  false,
  6,
  15,
  true, -- is_curated
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop&crop=center',
  NOW(),
  NOW()
),

-- 9. Cafe Hopping (people would make videos)
(
  'Cafe Hopping 📸',
  'Explore the city''s best cafes! Visit multiple spots, try different coffees and treats, and create fun videos along the way. Perfect for content creators!',
  'Food & Dining',
  'Mumbai',
  'TBD',
  'TBD',
  'Location TBD',
  150,
  10,
  10,
  'approved',
  false,
  true,
  false,
  4,
  10,
  true, -- is_curated
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop&crop=center',
  NOW(),
  NOW()
),

-- 10. Beach Clean Up Events
(
  'Beach Clean Up Events 🌊',
  'Make a difference while meeting new people! Join our beach cleanup events to help keep our beaches clean and beautiful.',
  'Community Service',
  'Mumbai',
  'TBD',
  'TBD',
  'Location TBD',
  150,
  30,
  30,
  'approved',
  false,
  true,
  false,
  10,
  30,
  true, -- is_curated
  'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&h=600&fit=crop&crop=center',
  NOW(),
  NOW()
),

-- 11. Arcade Night
(
  'Arcade Night 🎮',
  'Relive your childhood at the arcade! Play classic and modern arcade games, compete for high scores, and have a blast!',
  'Entertainment',
  'Mumbai',
  'TBD',
  'TBD',
  'Location TBD',
  150,
  12,
  12,
  'approved',
  false,
  true,
  false,
  4,
  12,
  true, -- is_curated
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop&crop=center',
  NOW(),
  NOW()
),

-- 12. Meet and Do Nothing
(
  'Meet and Do Nothing 😌',
  'Sometimes the best plans are no plans! Join us for a relaxed hangout where we just chill, chat, and enjoy each other''s company.',
  'Social',
  'Mumbai',
  'TBD',
  'TBD',
  'Location TBD',
  150,
  10,
  10,
  'approved',
  false,
  true,
  false,
  4,
  10,
  true, -- is_curated
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop&crop=center',
  NOW(),
  NOW()
);

-- Verify events were created
SELECT 
  '✅ Curated events created!' as status,
  COUNT(*) as total_events,
  COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_events
FROM events
WHERE title LIKE '%🥪%' 
   OR title LIKE '%🎤%'
   OR title LIKE '%🏃%'
   OR title LIKE '%🚴%'
   OR title LIKE '%🎲%'
   OR title LIKE '%🍽️%'
   OR title LIKE '%🏆%'
   OR title LIKE '%🎵%'
   OR title LIKE '%📸%'
   OR title LIKE '%🌊%'
   OR title LIKE '%🎮%'
   OR title LIKE '%😌%';

-- Show all curated events
SELECT 
  id,
  title,
  category,
  city,
  status,
  total_spots,
  spots_left,
  created_at
FROM events
WHERE status = 'approved'
ORDER BY created_at DESC;
