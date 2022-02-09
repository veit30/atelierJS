import { register } from '@svuick/core/app';
import supabase from '@svuick/supabase/app';

register(supabase, {
	supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
	supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string
});

export { load, Svuick } from '@svuick/core/app';
