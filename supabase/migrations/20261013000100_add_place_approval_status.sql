-- Guest-submitted places stay invisible until an admin approves them.
ALTER TABLE public.places
  ADD COLUMN IF NOT EXISTS approval_status TEXT NOT NULL DEFAULT 'approved'
  CHECK (approval_status IN ('pending', 'approved', 'rejected'));

UPDATE public.places
SET approval_status = 'approved'
WHERE approval_status IS NULL;

CREATE INDEX IF NOT EXISTS idx_places_approval_status
  ON public.places (approval_status);

-- Direct Supabase reads must obey the same public-visibility rule as the API.
DROP POLICY IF EXISTS "Public read places" ON public.places;
CREATE POLICY "Public read approved places" ON public.places
  FOR SELECT USING (approval_status = 'approved');
