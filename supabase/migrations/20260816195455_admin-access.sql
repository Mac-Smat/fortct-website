-- Phase 4: Admin access controls (mirror of applied migration 20260816195455)

-- Admin role check derived from the JWT app_metadata claim.
create or replace function public.is_admin()
returns boolean
language sql
stable security definer
set search_path to 'public'
as $function$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
$function$;

-- Admin write access to catalogue tables (public read access is untouched).
create policy "Admin manage categories" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Admin manage products" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Admin manage product images" on public.product_images
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Admin upload/manage of images in the services bucket.
create policy "Admin manage services images" on storage.objects
  for all to authenticated
  using ((bucket_id = 'services'::text) and public.is_admin())
  with check (
    (bucket_id = 'services'::text)
    and public.is_admin()
    and (
      exists (
        select 1
        from public.products p
        where (p.id)::text = objects.path_tokens[1]
      )
    )
  );