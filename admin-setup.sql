-- Doctor website admin access setup
-- 1) Create the admin user in Supabase Dashboard > Authentication > Users.
-- 2) Copy that user's UUID and replace YOUR_AUTH_USER_UUID below.
-- 3) Run this in Supabase SQL Editor. Never put a password in this file.
insert into public.doctor_admins (user_id)
values ('YOUR_AUTH_USER_UUID'::uuid)
on conflict (user_id) do nothing;

-- Tables and RLS policies are already created by migration:
-- doctor_appointments, doctor_admins, doctor_ratings
