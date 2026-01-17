-- 1. Create a public view for profiles that excludes phone numbers
CREATE VIEW public.profiles_public
WITH (security_invoker=on) AS
SELECT 
  id,
  user_id,
  full_name,
  avatar_url,
  bio,
  location,
  created_at,
  updated_at
FROM public.profiles;

-- 2. Drop the overly permissive SELECT policy on profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- 3. Create new RLS policies for profiles - users can only see their own full profile
CREATE POLICY "Users can view their own full profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

-- 4. Add input validation constraints to profiles
ALTER TABLE public.profiles
ADD CONSTRAINT bio_length CHECK (bio IS NULL OR length(bio) <= 1000),
ADD CONSTRAINT full_name_length CHECK (length(full_name) <= 100),
ADD CONSTRAINT location_length CHECK (location IS NULL OR length(location) <= 200),
ADD CONSTRAINT phone_format CHECK (phone IS NULL OR length(phone) <= 20);

-- 5. Add input validation constraints to skills
ALTER TABLE public.skills
ADD CONSTRAINT title_length CHECK (length(title) <= 100),
ADD CONSTRAINT description_length CHECK (length(description) <= 1000);

-- 6. Add input validation constraints to reviews
ALTER TABLE public.reviews
ADD CONSTRAINT comment_length CHECK (comment IS NULL OR length(comment) <= 500);

-- 7. Add input validation constraints to messages
ALTER TABLE public.messages
ADD CONSTRAINT content_length CHECK (length(content) <= 2000);

-- 8. Add input validation constraints to exchange_requests
ALTER TABLE public.exchange_requests
ADD CONSTRAINT message_length CHECK (length(message) <= 1000);

-- 9. Update handle_new_user function with input validation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  safe_name TEXT;
BEGIN
  -- Validate and sanitize full_name
  safe_name := COALESCE(
    NULLIF(TRIM(new.raw_user_meta_data ->> 'full_name'), ''),
    'User'
  );
  
  -- Limit length to prevent abuse
  safe_name := LEFT(safe_name, 100);
  
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (new.id, safe_name);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 10. Allow users to update their own reviews within 24 hours
CREATE POLICY "Users can update their own reviews within 24 hours"
ON public.reviews FOR UPDATE
USING (
  auth.uid() = reviewer_id 
  AND created_at > (now() - interval '24 hours')
);

-- 11. Allow users to delete their own reviews within 24 hours
CREATE POLICY "Users can delete their own reviews within 24 hours"
ON public.reviews FOR DELETE
USING (
  auth.uid() = reviewer_id 
  AND created_at > (now() - interval '24 hours')
);