# Parent portal setup checklist

## 1. Supabase project (owned by the school)
1. The school creates a Supabase account with its own email, then a project (region closest to Nigeria, e.g. Europe).
2. They invite the developer: Organization > Team > Invite, role **Administrator**. Never share passwords.
3. **SQL editor:** paste and run `supabase/migrations/0001_portal.sql`.
4. **Authentication > Sign In / Providers > Email:** turn **off** "Allow new users to sign up".
5. **Authentication > Sign In / Providers > Email:** set the email OTP / link expiry to the longest allowed
   (parents may not open an invite the same hour). "Resend invite" in the admin page issues a fresh link anyway.
6. **Authentication > URL Configuration:** set Site URL to the live address (and add `http://localhost:3000` for testing).
7. **Authentication > Users > Add user:** create the first admin (tick auto-confirm), then in the SQL editor run:
   `insert into public.profiles (id, role, full_name) values ('<user uuid>', 'admin', 'School Admin');`
   Sign in with this account via the **Forgot password** page to set its password.

## 2. Keys
Project Settings > API: copy the URL, `anon` key and `service_role` key into `.env.local` (and the Vercel
environment variables). The service-role key is server-only. Do not prefix it with `NEXT_PUBLIC_`.

Also set `NEXT_PUBLIC_SITE_URL` (the public address, used in emailed links) and `RESEND_API_KEY`.

## 3. Email (Resend)
Invites, password resets and "report ready" notices are sent from `no-reply@kingdomscholars.com.ng`.
That domain must be **verified in Resend** (DNS records) or messages will be rejected / go to spam.
Until it is, Resend only delivers to the account owner's own email, which is enough for testing.

## 4. First-time data load (admin page)
1. Add classes.
2. Import students (CSV: `full_name, admission_no, class`).
3. Add teachers (they get an invite email), then assign them to classes.
4. Import parents (CSV: `parent_name, parent_email, admission_no`, one row per parent+child).

## 5. Each term
Teachers/admin open **/teacher**, then either upload per child or use "Upload many at once" with PDFs named by
admission number (`KSPS-023.pdf`). Parents are emailed once each, even with several children.
