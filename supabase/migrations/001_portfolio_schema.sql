-- Portfolio + admin : executer dans Supabase > SQL Editor (ordre unique).
-- Ensuite : Storage > creer le bucket "portfolio-media" en PUBLIC si l'INSERT ci-dessous echoue.

-- Profils lies a auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Helper admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Inscription : profil par defaut
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role) values (new.id, 'user');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Projets
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  description text not null,
  stack text[] not null default '{}',
  role text not null,
  outcome text not null,
  github text,
  demo text,
  spotlight boolean not null default false,
  in_progress boolean not null default false,
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_published_idx on public.projects (published, sort_order);
create index if not exists projects_spotlight_idx on public.projects (spotlight desc);

alter table public.projects enable row level security;

create policy "projects_public_read" on public.projects
  for select using (published = true);

create policy "projects_admin_all" on public.projects
  for all using (public.is_admin()) with check (public.is_admin());

-- Medias : src = URL https complete OU chemin dans le bucket portfolio-media (ex: projects/<uuid>/file.mp4)
create table if not exists public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  type text not null check (type in ('image', 'video')),
  src text not null,
  alt text not null default '',
  poster text,
  sort_order int not null default 0
);

create index if not exists project_media_project_idx on public.project_media (project_id, sort_order);

alter table public.project_media enable row level security;

create policy "project_media_public_read" on public.project_media
  for select using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.published = true
    )
  );

create policy "project_media_admin_all" on public.project_media
  for all using (public.is_admin()) with check (public.is_admin());

-- Bucket stockage (ignorer si deja cree via l'interface)
insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do nothing;

-- Lecture publique des fichiers du portfolio
create policy "portfolio_media_public_read" on storage.objects
  for select using (bucket_id = 'portfolio-media');

create policy "portfolio_media_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'portfolio-media' and public.is_admin());

create policy "portfolio_media_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'portfolio-media' and public.is_admin())
  with check (bucket_id = 'portfolio-media' and public.is_admin());

create policy "portfolio_media_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'portfolio-media' and public.is_admin());

-- Promouvoir ton compte en admin (remplacer l'email apres premiere inscription)
-- update public.profiles set role = 'admin'
-- where id = (select id from auth.users where email = 'ton@email.com' limit 1);
