import { register } from '@svuick/core/hooks';
import cookie from '@svuick/cookie/hooks';
import supabase from '@svuick/supabase/hooks';

register(cookie);
register(supabase, {
	supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
	supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string
});

export { handle, getSession } from '@svuick/core/hooks';
