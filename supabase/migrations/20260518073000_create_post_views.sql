create table if not exists public.post_views (
  post_id text primary key,
  view_count bigint not null default 0 check (view_count >= 0),
  updated_at timestamptz not null default now()
);

alter table public.post_views enable row level security;

create policy "post views are readable"
on public.post_views
for select
to anon, authenticated
using (true);

create or replace function public.increment_post_view(p_post_id text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  next_count bigint;
begin
  if p_post_id is null or length(trim(p_post_id)) = 0 then
    raise exception 'post_id is required';
  end if;

  insert into public.post_views (post_id, view_count, updated_at)
  values (p_post_id, 1, now())
  on conflict (post_id)
  do update
    set view_count = public.post_views.view_count + 1,
        updated_at = now()
  returning view_count into next_count;

  return next_count;
end;
$$;

grant execute on function public.increment_post_view(text) to anon, authenticated;
