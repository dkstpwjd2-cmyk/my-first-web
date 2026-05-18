-- profiles RLS
alter table public.profiles enable row level security;

create policy "profiles are readable by everyone"
on public.profiles for select
to anon, authenticated
using (true);

create policy "users can insert own profile"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

create policy "users can update own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- posts RLS
alter table public.posts enable row level security;

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
