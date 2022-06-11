import type { GetSession, Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handleUser, handleCallback } from '@supabase/auth-helpers-sveltekit';

const cookieOptions = {
	lifetime: 1 * 365 * 24 * 60 * 60
};

export const handle: Handle = sequence(
	handleCallback({ cookieOptions }),
	handleUser({ cookieOptions })
);

export const getSession: GetSession = async (event) => {
	const { user, accessToken } = event.locals;
	return {
		user,
		accessToken
	};
};
