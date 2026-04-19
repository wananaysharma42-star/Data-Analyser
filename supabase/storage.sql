insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('datasets', 'datasets', false, 52428800, array['text/csv'])
on conflict (id) do nothing;

create policy "Users can view their own dataset files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'datasets'
  and owner_id = (select auth.uid())
);

create policy "Users can upload dataset files to their folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'datasets'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "Users can update their own dataset files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'datasets'
  and owner_id = (select auth.uid())
)
with check (
  bucket_id = 'datasets'
  and owner_id = (select auth.uid())
);

create policy "Users can delete their own dataset files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'datasets'
  and owner_id = (select auth.uid())
);
