-- avatars Storage 버킷 생성 (공개 읽기)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 읽기: 누구나
create policy "avatar images are publicly accessible"
on storage.objects for select
to public
using (bucket_id = 'avatars');

-- 업로드: 본인 폴더(userId/)에만
create policy "users can upload own avatar"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 교체: 본인 폴더만
create policy "users can update own avatar"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 삭제: 본인 폴더만
create policy "users can delete own avatar"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);
