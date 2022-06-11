/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs#typescript
// for information about these interfaces
declare namespace App {
	type AuthSession = import('@supabase/auth-helpers-svelte').Session;

	interface Locals extends Required<AuthSession> {}

	interface Platform {}

	interface Session extends AuthSession {}

	interface Stuff {}
}
