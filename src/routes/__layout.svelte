<script lang="ts" context="module">
	export { load } from '$lib/svuick';
</script>

<script lang="ts">
	import { Svuick } from '$lib/svuick';
	import IconProvider from '$lib/icon/IconProvider.svelte';
	import { session } from '$app/stores';
	import '../app.css';
	import { auth } from '@svuick/supabase/app';
</script>

<Svuick />
<IconProvider />

<div class="min-h-screen flex flex-col">
	<header class="flex justify-between items-center p-4">
		<h1 class="text-3xl text-center">
			<a href="/"> atelierJS </a>
		</h1>
		<nav class="flex gap-4">
			<a href="/">Home</a>
			{#if $session.supabase.user}
				<a href="/profile">{$session.supabase.user.email}</a>
				<a on:click|preventDefault={() => auth.signOut()} href="/logout">Log out</a>
			{:else}
				<a href="/signin">Sign in</a>
				<a href="/signup">Sign up</a>
			{/if}
		</nav>
	</header>

	<main class="flex-grow flex flex-col">
		<slot />
	</main>
</div>
