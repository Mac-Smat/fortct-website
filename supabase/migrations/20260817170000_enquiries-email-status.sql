-- Phase 8b: email notification statuses for enquiries (Brevo channel)
alter table public.enquiries
  add column email_notification_status text not null default 'pending'
    check (email_notification_status in ('pending', 'sent', 'failed')),
  add column email_customer_confirmation_status text not null default 'not_attempted'
    check (email_customer_confirmation_status in ('not_attempted', 'sent', 'failed'));
