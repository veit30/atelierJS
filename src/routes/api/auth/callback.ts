import type { RequestHandler } from './__types/callback.d';

export const post: RequestHandler = async () => {
	return {
		status: 200,
		body: {}
	};
};
