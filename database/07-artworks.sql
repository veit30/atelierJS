create type public.artwork_visibility as enum (
    'private', 'public'
);

create table public.artworks (
    id shortkey NOT NULL UNIQUE PRIMARY KEY,
    owner uuid references auth.users (id) on delete cascade NOT NULL,
    title varchar(255) NULL,
    description text NULL,
    visibility artwork_visibility default 'private',
    config jsonb NULL
);
create trigger trigger_artworks_genid before insert on public.artworks for each row execute procedure shortkey_generate();

create table public.renders (
    id shortkey NOT NULL UNIQUE PRIMARY KEY,
    title varchar(255) NULL,
    description text NULL,
    path text NULL,
    artwork_id shortkey references public.artworks (id) on delete cascade NOT NULL
);
create trigger trigger_renders_genid before insert on public.renders for each row execute procedure shortkey_generate();

alter table public.artworks enable row level security;
create policy "Allow artwork owner access" on public.artworks for all using ( (auth.uid() = owner ));
create policy "Allow artwork public read access" on public.artworks for select using ( visibility = 'public' );

alter table public.renders enable row level security;
create policy "Allow renders owner access" on public.renders for all using ( (
    auth.uid() in (
        select owner from artworks
        where id = artwork_id
    )
));
create policy "Allow renders public read access" on public.renders for select using ( visibility = 'public' );