<script lang="ts" context="module">
	import { withPageAuth } from '@supabase/auth-helpers-sveltekit';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ session }) =>
		withPageAuth({ redirectTo: '/', user: session.user! });
</script>

<h1>My Profile</h1>
