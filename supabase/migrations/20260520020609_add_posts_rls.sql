-- Ch11 posts RLS
-- This migration keeps the final posts policies in code instead of relying on
-- the Supabase SQL Editor. Existing policy names are dropped first so rerunning
-- the Ch11 practice migration does not fail with "policy already exists".

alter table public.posts enable row level security;

drop policy if exists "posts are readable by everyone" on public.posts;
drop policy if exists "authenticated users can insert own posts" on public.posts;
drop policy if exists "users can update own posts" on public.posts;
drop policy if exists "users can delete own posts" on public.posts;

create policy "posts are readable by everyone"
on public.posts for select
to anon, authenticated
using (true);

create policy "authenticated users can insert own posts"
on public.posts for insert
to authenticated
with check (auth.uid() = user_id);

create policy "users can update own posts"
on public.posts for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users can delete own posts"
on public.posts for delete
to authenticated
using (auth.uid() = user_id);
