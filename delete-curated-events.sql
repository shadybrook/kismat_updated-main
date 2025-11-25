-- ============================================
-- Delete Existing Curated Events
-- Run this FIRST to clean up duplicates
-- ============================================

DELETE FROM events
WHERE title IN (
  'Paddle Pickle 🥪',
  'Karaoke Nights 🎤',
  'Run Clubs / Morning Runs 🏃',
  'Cycling 🚴',
  'Board Game Nights 🎲',
  'Dinners 🍽️',
  'Sport Screenings 🏆',
  'Concerts 🎵',
  'Cafe Hopping 📸',
  'Beach Clean Up Events 🌊',
  'Arcade Night 🎮',
  'Meet and Do Nothing 😌'
);

-- Verify deletion
SELECT 
  '✅ Curated events deleted!' as status,
  COUNT(*) as remaining_events
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
