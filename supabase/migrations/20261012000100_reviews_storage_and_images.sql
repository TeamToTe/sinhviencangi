-- Migration: Add images column to reviews table and configure Supabase Storage bucket for review photos

-- 1. Ensure reviews table has images array column
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- 2. Create the 'reviews' bucket in Supabase Storage if it does not already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'reviews',
    'reviews',
    true,
    5242880, -- 5MB maximum per file guardrail
    ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/gif', 'image/heic', 'image/avif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/gif', 'image/heic', 'image/avif']::text[];

-- 3. Storage Policies (RLS) for the 'reviews' bucket
-- Allow public (anon + authenticated) to view images
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access to Review Images'
    ) THEN
        CREATE POLICY "Public Access to Review Images"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'reviews');
    END IF;
END $$;

-- Allow anon and authenticated users to upload review images
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow Uploads to Review Images Bucket'
    ) THEN
        CREATE POLICY "Allow Uploads to Review Images Bucket"
        ON storage.objects FOR INSERT
        WITH CHECK (bucket_id = 'reviews');
    END IF;
END $$;
