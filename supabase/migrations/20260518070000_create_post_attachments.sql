insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-attachments',
  'post-attachments',
  true,
  5242880,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.hancom.hwp',
    'application/x-hwp',
    'application/vnd.hancom.hwpx',
    'application/x-hwpx',
    'text/plain'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table post_attachments (
  id uuid default gen_random_uuid() primary key,
  post_id text not null,
  user_id uuid references profiles(id) on delete cascade not null,
  bucket_id text not null default 'post-attachments',
  storage_path text not null unique,
  file_name text not null,
  file_type text not null,
  file_size integer not null check (file_size > 0 and file_size <= 5242880),
  created_at timestamptz default now()
);

create index post_attachments_post_id_created_at_idx
on post_attachments(post_id, created_at);

alter table post_attachments enable row level security;

create policy "Anyone can read post attachments"
on post_attachments
for select
using (true);

create policy "Authenticated users can create their own attachments"
on post_attachments
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Authenticated users can delete their own attachments"
on post_attachments
for delete
to authenticated
using (auth.uid() = user_id);

create policy "Anyone can read post attachment files"
on storage.objects
for select
using (bucket_id = 'post-attachments');

create policy "Authenticated users can upload post attachment files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'post-attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Authenticated users can delete their own post attachment files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'post-attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
);
