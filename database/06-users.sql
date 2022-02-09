create type public.profile_visibility as enum (
    -- permissions
    'private', 'public'
);

-- USERS
create table public.users (
    id uuid references auth.users (id) on delete cascade NOT NULL UNIQUE PRIMARY KEY,
    email varchar(255) NULL UNIQUE,
    username varchar(255) NULL,
    visibility profile_visibility default 'private'
);
comment on table public.users is 'Profile for each user.';
comment on column public.users.id is 'References the supabase auth user.';

-- secure table
alter table public.users enable row level security;
create policy "Allow logged-in read access" on public.users for select using ( (auth.uid() = id) or (visibility = 'public'::profile_visibility) );
create policy "Allow individual update access" on public.users for update using ( auth.uid() = id ) with check ( auth.uid() = id );

-- send previous data on change
alter table public.users replica identity full;

-- inserts a row into public.users
create or replace function public.handle_new_user() 
returns trigger 
language plpgsql 
security definer set search_path = public
as $$
begin
    insert into public.users (id)
    values (new.id);
    return new;
end;
$$;

-- trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- add table to publication
alter publication supabase_realtime add table public.users;
