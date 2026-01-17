-- Drop the restrictive policy and create a new one that allows viewing all profiles
-- but we'll rely on the application to only select non-sensitive columns for other users
DROP POLICY IF EXISTS "Users can view their own full profile" ON public.profiles;

-- Create policy: Users can view all profiles (but app should only select non-sensitive cols for others)
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);