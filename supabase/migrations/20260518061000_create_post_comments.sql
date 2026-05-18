create table post_comments (
  id uuid default gen_random_uuid() primary key,
  post_id text not null,
  user_id uuid references profiles(id) on delete cascade not null,
  author_name text not null default '작성자' check (char_length(author_name) between 1 and 80),
  content text not null check (char_length(btrim(content)) between 1 and 500),
  created_at timestamptz default now()
);

create index post_comments_post_id_created_at_idx
on post_comments(post_id, created_at);

create index post_comments_user_id_idx on post_comments(user_id);

alter table post_comments enable row level security;

create policy "Anyone can read post comments"
on post_comments
for select
using (true);

create policy "Authenticated users can create their own comments"
on post_comments
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Authenticated users can delete their own comments"
on post_comments
for delete
to authenticated
using (auth.uid() = user_id);
