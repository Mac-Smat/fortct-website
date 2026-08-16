-- FortCT Services — Product Image Storage (Phase 3)
-- Public bucket for catalogue images: services/{product_id}/...
-- Uploads/deletes remain locked (no write policies) until the admin auth phase.
--
-- NOTE: the read policy matches the product folder via storage.objects.path_tokens
-- (a generated column). Do NOT reference storage.objects.name inside a subquery
-- whose FROM table has a `name` column — unqualified `name` resolves to the inner
-- table and the policy silently matches nothing.

-- ============ 1. BUCKET (idempotent) ============
-- public = true  → images served via public URLs, no auth required to view
-- file_size_limit = 5 MB (5242880 bytes) → quality vs. web performance balance
-- allowed_mime_types = image/jpeg, image/png, image/webp only
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'services',
  'services',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- ============ 2. READ POLICY (defense in depth) ============
-- Public (anon + authenticated) may read/list ONLY images inside folders of
-- PUBLISHED products: services/{product_id}/...
-- Hidden products' images are not exposed through the object API.
create policy "Public read images of published products"
on storage.objects
for select
to anon, authenticated
using (
  bucket_id = 'services'
  and exists (
    select 1
    from public.products pr
    where pr.status = 'published'
      and pr.id::text = path_tokens[1]
  )
);

-- ============ 3. WRITE ACCESS ============
-- Intentionally NO insert/update/delete policies for anon or authenticated.
-- All uploads, replacements, renames and deletes are blocked by RLS.
-- Additionally, the storage service blocks direct SQL deletion of objects
-- (storage.protect_delete trigger) — deletes must go through the Storage API.
-- Admin write policies will be added in the authentication phase.