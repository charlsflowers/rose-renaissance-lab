-- Create storage bucket for bouquet preview cache
INSERT INTO storage.buckets (id, name, public)
VALUES ('bouquet-previews', 'bouquet-previews', true);

-- Allow public read access to cached previews
CREATE POLICY "Public read access for bouquet previews"
ON storage.objects FOR SELECT
USING (bucket_id = 'bouquet-previews');

-- Allow edge functions (service role) to insert previews
CREATE POLICY "Service role can upload previews"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'bouquet-previews');
