# Doctor website — Supabase setup

The public website uses Supabase project `mehedi8895's Project` (project ref: `mrqaqppvqvytcromdigt`). The database migration creates `doctor_appointments`, `doctor_admins`, and `doctor_ratings` with Row Level Security.

## Admin setup is still required

The project currently has no Supabase Auth users, so an existing login has not been found in this selected project. The Admin page uses Supabase Auth email/password; an account from another website/project will not automatically work here.

1. Open Supabase Dashboard for project `mrqaqppvqvytcromdigt`.
2. Go to Authentication → Users and create/invite the doctor's admin user.
3. Copy the new user's UUID.
4. Open SQL Editor and run the SQL in `admin-setup.sql`, replacing `YOUR_AUTH_USER_UUID` with the copied UUID.
5. Admin login page: `/admin.html`.

Do not expose a service-role key or store any password in frontend code. The browser only uses the project's publishable key. Admin data access is checked by RLS and membership in `doctor_admins`.

## What works

- Appointment form writes to `doctor_appointments`.
- Admin dashboard lists requests and updates pending/approved/rejected/completed status.
- Visitors can submit 1–5 star ratings; ratings remain pending until an admin publishes them.
- Only published ratings appear on the public page.

The site has not been deployed or tested in a live browser as requested; deploy from GitHub yourself and then test with a created admin account.


## Logo management (added)
The admin dashboard includes a logo uploader. Run the updated `admin-setup.sql` in the Supabase SQL Editor to create the `doctor_site_settings` table, public `doctor-assets` bucket, and policies. Only a user listed in `doctor_admins` can upload or change the logo.
