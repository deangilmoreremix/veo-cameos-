-- ============================================================================
-- FIX: Add User Profile Creation Trigger
-- ============================================================================
-- This SQL installs a trigger that automatically creates a user profile
-- when someone signs up through Supabase Auth.
--
-- INSTRUCTIONS:
-- 1. Go to https://supabase.com/dashboard/project/fojsukqhfpnwnsptfsae
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Copy this entire file
-- 4. Paste into the SQL Editor
-- 5. Click "Run" (or press Cmd/Ctrl + Enter)
-- ============================================================================

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username, credits)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    30
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verify the trigger was created
SELECT
  'Trigger installed successfully!' as status,
  tgname as trigger_name,
  tgtype as trigger_type
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
