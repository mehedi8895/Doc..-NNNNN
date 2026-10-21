-- Doctor website admin access setup
-- 1) Create the admin user in Supabase Dashboard > Authentication > Users.
-- 2) Copy that user's UUID and replace YOUR_AUTH_USER_UUID below.
-- 3) Run this in Supabase SQL Editor. Never put a password in this file.
insert into public.doctor_admins (user_id)
values ('YOUR_AUTH_USER_UUID'::uuid)
on conflict (user_id) do nothing;

-- Tables and RLS policies are already created by migration:
-- doctor_appointments, doctor_admins, doctor_ratings


-- Website logo settings: public can read the selected logo; only approved admins can change it.
create table if not exists public.doctor_site_settings (
  id integer primary key check (id = 1),
  logo_url text,
  updated_at timestamptz not null default now()
);
alter table public.doctor_site_settings enable row level security;
drop policy if exists "Public can read doctor site settings" on public.doctor_site_settings;
create policy "Public can read doctor site settings"
  on public.doctor_site_settings for select
  using (true);
drop policy if exists "Admins can manage doctor site settings" on public.doctor_site_settings;
create policy "Admins can manage doctor site settings"
  on public.doctor_site_settings for all to authenticated
  using (exists (select 1 from public.doctor_admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.doctor_admins a where a.user_id = auth.uid()));
insert into public.doctor_site_settings (id, logo_url)
values (1, null)
on conflict (id) do nothing;

-- Public bucket for the logo. Upload/update/delete is restricted to approved admins.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('doctor-assets', 'doctor-assets', true, 2097152, array['image/png','image/jpeg','image/webp','image/svg+xml'])
on conflict (id) do update set public = true, file_size_limit = 2097152,
  allowed_mime_types = array['image/png','image/jpeg','image/webp','image/svg+xml'];
drop policy if exists "Public can view doctor assets" on storage.objects;
create policy "Public can view doctor assets" on storage.objects
  for select using (bucket_id = 'doctor-assets');
drop policy if exists "Approved admins can upload doctor assets" on storage.objects;
create policy "Approved admins can upload doctor assets" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'doctor-assets' and exists (
      select 1 from public.doctor_admins a where a.user_id = auth.uid()
    )
  );
drop policy if exists "Approved admins can update doctor assets" on storage.objects;
create policy "Approved admins can update doctor assets" on storage.objects
  for update to authenticated using (
    bucket_id = 'doctor-assets' and exists (
      select 1 from public.doctor_admins a where a.user_id = auth.uid()
    )
  ) with check (
    bucket_id = 'doctor-assets' and exists (
      select 1 from public.doctor_admins a where a.user_id = auth.uid()
    )
  );
drop policy if exists "Approved admins can delete doctor assets" on storage.objects;
create policy "Approved admins can delete doctor assets" on storage.objects
  for delete to authenticated using (
    bucket_id = 'doctor-assets' and exists (
      select 1 from public.doctor_admins a where a.user_id = auth.uid()
    )
  );
