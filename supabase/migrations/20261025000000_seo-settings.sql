-- Phase: SEO settings (admin-managed)
-- Stores per-page SEO metadata and per-product SEO overrides.
-- Public read access; write access restricted to admins via public.is_admin().

create table public.seo_settings (
  page_key        text primary key,
  title           text,
  meta_description text,
  og_image_url    text,
  updated_at      timestamptz not null default now()
);

create table public.product_seo (
  product_id      uuid primary key references public.products (id) on delete cascade,
  meta_title      text,
  meta_description text,
  updated_at      timestamptz not null default now()
);

-- Row level security
alter table public.seo_settings enable row level security;
alter table public.product_seo enable row level security;

-- Public read (needed by the public site to override default metadata)
create policy "Public read seo settings"
  on public.seo_settings
  for select to anon, authenticated
  using (true);

create policy "Public read product seo"
  on public.product_seo
  for select to anon, authenticated
  using (true);

-- Admin write access (mirrors the admin-access migration pattern)
create policy "Admin manage seo settings"
  on public.seo_settings
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin manage product seo"
  on public.product_seo
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Data API exposure
grant select on public.seo_settings to anon, authenticated;
grant select on public.product_seo to anon, authenticated;
