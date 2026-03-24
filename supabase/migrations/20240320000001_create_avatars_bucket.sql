-- Drop existing policies if they exist
drop policy if exists "Avatar upload policy" on storage.objects;
drop policy if exists "Avatar update policy" on storage.objects;
drop policy if exists "Avatar read policy" on storage.objects;
drop policy if exists "Avatar delete policy" on storage.objects;

-- Create avatars storage bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Enable RLS
alter table storage.objects enable row level security;

-- Create storage policy to allow authenticated users to upload avatar
create policy "Avatar upload policy"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
);

-- Create storage policy to allow authenticated users to update their own avatar
create policy "Avatar update policy"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
);

-- Create storage policy to allow public read access to avatars
create policy "Avatar read policy"
on storage.objects
for select
to public
using (bucket_id = 'avatars');

-- Create storage policy to allow users to delete their own avatars
create policy "Avatar delete policy"
on storage.objects
for delete
to authenticated
using (bucket_id = 'avatars'); 