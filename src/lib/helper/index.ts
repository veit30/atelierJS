import type { Load } from '@sveltejs/kit';

export const redirectIfNoSession: Load = async function ({ session, url }) {
	if (!session.supabase.user)
		return {
			status: 302,
			redirect: `/signin?redirectTo=${url.href.substring(url.origin.length)}`
		};
	return {};
};
export const redirectIfSession: Load = async function ({ session }) {
	if (session.supabase.user)
		return {
			status: 302,
			redirect: '/'
		};
	return {};
};
