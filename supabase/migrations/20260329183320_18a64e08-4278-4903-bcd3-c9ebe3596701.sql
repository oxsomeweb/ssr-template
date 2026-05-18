
-- Create a public bucket for site images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('site-images', 'site-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']);

-- Allow public read access
CREATE POLICY "Public read access for site images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'site-images');
