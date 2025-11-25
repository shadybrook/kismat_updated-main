-- ============================================
-- Fix Supabase Warnings
-- Run these in Supabase SQL Editor (optional)
-- ============================================

-- Fix 1: Update the function to have proper search_path
-- This fixes the "mutable search_path" warning
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Verify the function was updated
SELECT 
  proname as function_name,
  prosecdef as security_definer,
  proconfig as config
FROM pg_proc 
WHERE proname = 'update_updated_at_column';

-- Note: The compromised password warning is just a recommendation
-- You can enable it in Supabase Dashboard → Authentication → Settings
-- → Password Protection → "Check against HaveIBeenPwned"
