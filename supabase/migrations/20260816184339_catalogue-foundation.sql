-- FortCT Services Catalogue — Foundation
-- Schema-only: categories, products, product_images
-- No seed data. No storage bucket (next phase).

create extension if not exists moddatetime with schema extensions;

-- ================= categories =================
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  status      text not null default 'published'
              check (status in ('published', 'hidden')),
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ================= products =================
create table public.products (
  id            uuid primary key default gen_random_uuid(),
  category_id   uuid not null
                references public.categories (id)
                on delete restrict,
  name          text not null,
  slug          text not null unique,
  description   text,
  price         numeric(14,2)
                check (price is null or price >= 0),
  pricing_type  text not null default 'custom_quote'
                check (pricing_type in ('fixed', 'starting_from', 'per_unit', 'custom_quote')),
  pricing_unit  text,
  status        text not null default 'published'
                check (status in ('published', 'hidden')),
  featured      boolean not null default false,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint products_pricing_consistency check (
    (pricing_type = 'custom_quote' and price is null) or
    (pricing_type <> 'custom_quote' and price is not null)
  )
);

-- ================= product_images =================
create table public.product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null
              references public.products (id)
              on delete cascade,
  image_url   text not null,
  alt_text    text,
  sort_order  integer not null default 0,
  is_primary  boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ================= updated_at triggers =================
create trigger handle_updated_at
  before update on public.categories
  for each row execute procedure extensions.moddatetime (updated_at);

create trigger handle_updated_at
  before update on public.products
  for each row execute procedure extensions.moddatetime (updated_at);

-- ================= indexes =================
create index products_category_id_idx
  on public.products (category_id);

create index products_status_sort_order_idx
  on public.products (status, sort_order);

create index product_images_product_id_idx
  on public.product_images (product_id);

create unique index product_images_one_primary_idx
  on public.product_images (product_id)
  where is_primary;

-- ================= RLS =================
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;

create policy "Public read published categories"
  on public.categories
  for select to anon, authenticated
  using (status = 'published');

create policy "Public read published products"
  on public.products
  for select to anon, authenticated
  using (status = 'published');

create policy "Public read images of published products"
  on public.product_images
  for select to anon, authenticated
  using (exists (
    select 1 from public.products p
    where p.id = product_id and p.status = 'published'
  ));

-- ================= Data API exposure =================
grant select on public.categories to anon, authenticated;
grant select on public.products to anon, authenticated;
grant select on public.product_images to anon, authenticated;