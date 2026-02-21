
-- Add verified_provider column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified_provider boolean NOT NULL DEFAULT false;

-- Add is_featured column to skills for monetization (featured listings)
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

-- Create a function to auto-verify providers after 5+ completed exchanges
CREATE OR REPLACE FUNCTION public.check_and_verify_provider()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  completed_count integer;
  provider uuid;
BEGIN
  -- Only trigger on status change to 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- Check provider's completed exchanges
    provider := NEW.provider_id;
    SELECT COUNT(*) INTO completed_count
    FROM public.exchange_requests
    WHERE provider_id = provider AND status = 'completed';
    
    -- Auto-verify after 5 completed exchanges
    IF completed_count >= 5 THEN
      UPDATE public.profiles SET is_verified_provider = true WHERE user_id = provider;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS auto_verify_provider ON public.exchange_requests;
CREATE TRIGGER auto_verify_provider
AFTER UPDATE ON public.exchange_requests
FOR EACH ROW
EXECUTE FUNCTION public.check_and_verify_provider();
