-- Explicitly deny anon and authenticated access to fedex-test-labels bucket.
-- service_role bypasses RLS, so edge functions keep working.

DROP POLICY IF EXISTS "fedex_test_labels_deny_anon_select" ON storage.objects;
DROP POLICY IF EXISTS "fedex_test_labels_deny_anon_insert" ON storage.objects;
DROP POLICY IF EXISTS "fedex_test_labels_deny_anon_update" ON storage.objects;
DROP POLICY IF EXISTS "fedex_test_labels_deny_anon_delete" ON storage.objects;
DROP POLICY IF EXISTS "fedex_test_labels_deny_auth_select" ON storage.objects;
DROP POLICY IF EXISTS "fedex_test_labels_deny_auth_insert" ON storage.objects;
DROP POLICY IF EXISTS "fedex_test_labels_deny_auth_update" ON storage.objects;
DROP POLICY IF EXISTS "fedex_test_labels_deny_auth_delete" ON storage.objects;

CREATE POLICY "fedex_test_labels_deny_anon_select"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id <> 'fedex-test-labels');

CREATE POLICY "fedex_test_labels_deny_anon_insert"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (bucket_id <> 'fedex-test-labels');

CREATE POLICY "fedex_test_labels_deny_anon_update"
  ON storage.objects FOR UPDATE TO anon
  USING (bucket_id <> 'fedex-test-labels')
  WITH CHECK (bucket_id <> 'fedex-test-labels');

CREATE POLICY "fedex_test_labels_deny_anon_delete"
  ON storage.objects FOR DELETE TO anon
  USING (bucket_id <> 'fedex-test-labels');

CREATE POLICY "fedex_test_labels_deny_auth_select"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id <> 'fedex-test-labels');

CREATE POLICY "fedex_test_labels_deny_auth_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id <> 'fedex-test-labels');

CREATE POLICY "fedex_test_labels_deny_auth_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id <> 'fedex-test-labels')
  WITH CHECK (bucket_id <> 'fedex-test-labels');

CREATE POLICY "fedex_test_labels_deny_auth_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id <> 'fedex-test-labels');
