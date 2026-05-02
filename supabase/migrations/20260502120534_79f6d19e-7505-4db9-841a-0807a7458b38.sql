-- 1. Roles enum + table
create type public.app_role as enum ('admin', 'vet', 'farmer');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Security definer to avoid recursive RLS
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users can view their own roles"
  on public.user_roles for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Admins can manage roles"
  on public.user_roles for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 2. Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  language text not null default 'fr',
  village text,
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users view own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Vets and admins view all profiles"
  on public.profiles for select
  to authenticated
  using (public.has_role(auth.uid(), 'vet') or public.has_role(auth.uid(), 'admin'));

create policy "Users insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- 3. Vets directory
create table public.vets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  zone text,
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now()
);

alter table public.vets enable row level security;

create policy "Authenticated can view vets"
  on public.vets for select
  to authenticated
  using (true);

create policy "Admins manage vets"
  on public.vets for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 4. Reports
create type public.severity_level as enum ('low', 'moderate', 'critical');

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references auth.users(id) on delete cascade not null,
  animal_type text not null,
  animal_age text,
  symptoms text[] not null default '{}',
  notes text,
  severity severity_level not null default 'low',
  village text,
  latitude double precision,
  longitude double precision,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

create policy "Farmers view own reports"
  on public.reports for select
  to authenticated
  using (auth.uid() = farmer_id);

create policy "Vets and admins view all reports"
  on public.reports for select
  to authenticated
  using (public.has_role(auth.uid(), 'vet') or public.has_role(auth.uid(), 'admin'));

create policy "Farmers create own reports"
  on public.reports for insert
  to authenticated
  with check (auth.uid() = farmer_id);

create policy "Farmers update own reports"
  on public.reports for update
  to authenticated
  using (auth.uid() = farmer_id);

create policy "Vets and admins update reports"
  on public.reports for update
  to authenticated
  using (public.has_role(auth.uid(), 'vet') or public.has_role(auth.uid(), 'admin'));

-- 5. Auto-create profile + default farmer role on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, language)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'language', 'fr')
  );
  insert into public.user_roles (user_id, role)
  values (new.id, 'farmer');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 6. updated_at trigger for profiles
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();