-- Remove permissive public policies on the bouquet-previews bucket.
-- The edge function uses the service role key (bypasses RLS) for uploads and listing,
-- and the bucket remains public so getPublicUrl() still serves images via the CDN.
DROP POLICY IF EXISTS "Service role can upload previews" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for bouquet previews" ON storage.objects;