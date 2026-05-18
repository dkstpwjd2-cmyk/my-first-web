create table post_reactions (
  id uuid default gen_random_uuid() primary key,
  post_id text not null,
  user_id uuid references profiles(id) on delete cascade not null,
  reaction text not null check (reaction in ('like', 'dislike')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (post_id, user_id)
);

create index post_reactions_post_id_idx on post_reactions(post_id);

alter table post_reactions enable row level security;

create policy "Anyone can read post reactions"
on post_reactions
for select
using (true);

create policy "Authenticated users can create their own reactions"
on post_reactions
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Authenticated users can update their own reactions"
on post_reactions
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Authenticated users can delete their own reactions"
on post_reactions
for delete
to authenticated
using (auth.uid() = user_id);
