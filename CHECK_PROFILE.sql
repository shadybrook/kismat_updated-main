-- Check if profile exists for this email
SELECT 
  id,
  email,
  auth_user_id,
  name,
  personality_answers,
  created_at
FROM profiles 
WHERE email = 'frozenpizza19@gmail.com';

-- Check if user exists in auth.users
SELECT 
  id as auth_user_id,
  email,
  created_at
FROM auth.users 
WHERE email = 'frozenpizza19@gmail.com';

-- Check all profiles (to see what's in the database)
SELECT 
  email,
  auth_user_id,
  name,
  jsonb_object_keys(personality_answers) as has_personality_answers
FROM profiles 
LIMIT 10;
