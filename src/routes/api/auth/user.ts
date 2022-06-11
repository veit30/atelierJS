import type { Session } from '@supabase/auth-helpers-svelte';
import type { RequestHandler } from './__types/user';

export const post: RequestHandler<Session> = async ({ locals }) => {
	const { user, accessToken, error } = locals;
	return {
		status: 200,
		body: {
			user,
			accessToken: accessToken,
			error
		}
	};
};
