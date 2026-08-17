-- Replaces the Phase-7 stop-gap contact_messages table (empty, anon-insert-only)
-- with a full enquiry pipeline table. Inserts happen ONLY through the
-- submit-enquiry Edge Function (service role, RLS bypassed), so no anon
-- insert policy exists. Admins (is_admin()) can read and update statuses;
-- rows are never deleted (lead retention).

drop table if exists public.contact_messages;

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  whatsapp_number text not null,
  email text,
  service_id uuid references public.categories(id) on delete set null,
  service_name_snapshot text,
  message text not null,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'quoted', 'completed', 'closed')),
  source text not null default 'fortct-website',
  whatsapp_notification_status text not null default 'pending'
    check (whatsapp_notification_status in ('pending', 'sent', 'failed')),
  whatsapp_customer_confirmation_status text not null default 'not_attempted'
    check (whatsapp_customer_confirmation_status in ('not_attempted', 'sent', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index enquiries_status_idx on public.enquiries (status);
create index enquiries_created_at_idx on public.enquiries (created_at desc);
create index enquiries_whatsapp_number_idx on public.enquiries (whatsapp_number);

alter table public.enquiries enable row level security;

create policy "Admin read enquiries"
  on public.enquiries
  for select
  to authenticated
  using (is_admin());

create policy "Admin update enquiries"
  on public.enquiries
  for update
  to authenticated
  using (is_admin())
  with check (is_admin());