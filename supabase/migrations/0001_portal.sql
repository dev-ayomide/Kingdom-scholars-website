-- KSPS parent portal schema.
-- Run in the Supabase SQL editor (or `supabase db push`).
-- Also: in Supabase Dashboard > Authentication > Providers > Email, DISABLE
-- "Allow new users to sign up" - accounts are created by admin only.

create type public.user_role as enum ('parent', 'teacher', 'admin');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'parent',
  full_name text not null default '',
  created_at timestamptz not null default now()
);

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table public.students (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  admission_no text not null unique,
  class_id uuid not null references public.classes (id) on delete restrict,
  created_at timestamptz not null default now()
);

create table public.teacher_classes (
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  class_id uuid not null references public.classes (id) on delete cascade,
  primary key (teacher_id, class_id)
);

create table public.parent_students (
  parent_id uuid not null references public.profiles (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  primary key (parent_id, student_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  term smallint not null check (term in (1, 2, 3)),
  session text not null check (session ~ '^[0-9]{4}-[0-9]{4}$'),
  file_path text not null,
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (student_id, session, term)
);

create index on public.students (class_id);
create index on public.parent_students (student_id);
create index on public.reports (student_id);

-- ---------------------------------------------------------------- helpers
-- security definer so policies can consult these tables without recursing
-- into their own RLS.
create function public.app_role() returns public.user_role
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create function public.teaches_student(sid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.students s
    join public.teacher_classes tc on tc.class_id = s.class_id
    where s.id = sid and tc.teacher_id = auth.uid()
  )
$$;

create function public.is_parent_of(sid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.parent_students
    where student_id = sid and parent_id = auth.uid()
  )
$$;

-- ---------------------------------------------------------------- RLS
alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.students enable row level security;
alter table public.teacher_classes enable row level security;
alter table public.parent_students enable row level security;
alter table public.reports enable row level security;

-- profiles: read own, admin reads/writes all. Nobody edits their own role.
create policy profiles_select on public.profiles for select to authenticated
  using (id = auth.uid() or public.app_role() = 'admin');
create policy profiles_admin_write on public.profiles for all to authenticated
  using (public.app_role() = 'admin') with check (public.app_role() = 'admin');

-- classes: any signed-in user can read; admin writes
create policy classes_select on public.classes for select to authenticated using (true);
create policy classes_admin_write on public.classes for all to authenticated
  using (public.app_role() = 'admin') with check (public.app_role() = 'admin');

-- students
create policy students_select on public.students for select to authenticated
  using (public.app_role() = 'admin' or public.teaches_student(id) or public.is_parent_of(id));
create policy students_admin_write on public.students for all to authenticated
  using (public.app_role() = 'admin') with check (public.app_role() = 'admin');

-- teacher_classes
create policy teacher_classes_select on public.teacher_classes for select to authenticated
  using (teacher_id = auth.uid() or public.app_role() = 'admin');
create policy teacher_classes_admin_write on public.teacher_classes for all to authenticated
  using (public.app_role() = 'admin') with check (public.app_role() = 'admin');

-- parent_students
create policy parent_students_select on public.parent_students for select to authenticated
  using (parent_id = auth.uid() or public.app_role() = 'admin');
create policy parent_students_admin_write on public.parent_students for all to authenticated
  using (public.app_role() = 'admin') with check (public.app_role() = 'admin');

-- reports
create policy reports_select on public.reports for select to authenticated
  using (public.app_role() = 'admin' or public.teaches_student(student_id) or public.is_parent_of(student_id));
create policy reports_staff_insert on public.reports for insert to authenticated
  with check (
    (public.app_role() = 'admin' or public.teaches_student(student_id))
    and uploaded_by = auth.uid()
  );
create policy reports_staff_update on public.reports for update to authenticated
  using (public.app_role() = 'admin' or public.teaches_student(student_id))
  with check (public.app_role() = 'admin' or public.teaches_student(student_id));
create policy reports_staff_delete on public.reports for delete to authenticated
  using (public.app_role() = 'admin' or public.teaches_student(student_id));

-- ---------------------------------------------------------------- storage
-- Private bucket, PDFs only, 5 MB cap. Object path: {student_id}/{session}-T{term}.pdf
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('report-sheets', 'report-sheets', false, 5242880, array['application/pdf'])
on conflict (id) do nothing;

create policy report_files_select on storage.objects for select to authenticated
  using (
    bucket_id = 'report-sheets'
    and (
      public.app_role() = 'admin'
      or public.teaches_student(((storage.foldername(name))[1])::uuid)
      or public.is_parent_of(((storage.foldername(name))[1])::uuid)
    )
  );
create policy report_files_insert on storage.objects for insert to authenticated
  with check (
    bucket_id = 'report-sheets'
    and (public.app_role() = 'admin' or public.teaches_student(((storage.foldername(name))[1])::uuid))
  );
create policy report_files_update on storage.objects for update to authenticated
  using (
    bucket_id = 'report-sheets'
    and (public.app_role() = 'admin' or public.teaches_student(((storage.foldername(name))[1])::uuid))
  );
create policy report_files_delete on storage.objects for delete to authenticated
  using (
    bucket_id = 'report-sheets'
    and (public.app_role() = 'admin' or public.teaches_student(((storage.foldername(name))[1])::uuid))
  );

-- ---------------------------------------------------------------- first admin
-- After creating your first user in Dashboard > Authentication > Users, run:
--   insert into public.profiles (id, role, full_name)
--   values ('<that user uuid>', 'admin', 'School Admin');
