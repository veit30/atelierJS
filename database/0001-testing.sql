-- policy select public artworks
bucket_id = 'artworks' AND (
  select count(*) from public.artworks
  where title = (storage.foldername(name))[2] and visibility = 'public';
)