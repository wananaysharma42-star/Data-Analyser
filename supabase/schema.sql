create extension if not exists pgcrypto;

create table if not exists public.datasets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  file_path text,
  row_count integer not null default 0,
  column_count integer not null default 0,
  columns jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  dataset_name text not null,
  snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.datasets enable row level security;
alter table public.projects enable row level security;

create policy "Users can view their own datasets"
on public.datasets
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own datasets"
on public.datasets
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own datasets"
on public.datasets
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own datasets"
on public.datasets
for delete
to authenticated
using (auth.uid() = user_id);

create policy "Users can view their own projects"
on public.projects
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own projects"
on public.projects
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own projects"
on public.projects
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own projects"
on public.projects
for delete
to authenticated
using (auth.uid() = user_id);

create or replace function public.touch_project_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_project_updated_at on public.projects;

create trigger set_project_updated_at
before update on public.projects
for each row
execute function public.touch_project_updated_at();

-- Run supabase/storage.sql as well to create the "datasets" bucket
-- and apply per-user storage policies for CSV uploads.
