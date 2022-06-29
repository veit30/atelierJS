<script lang="ts">
	import '../app.css';

	import IconProvider from '$lib/icon/IconProvider.svelte';
	import { session } from '$app/stores';
	import { supabase } from '$lib/db';
</script>

<IconProvider />

<div class="min-h-screen flex flex-col">
	<header class="flex justify-between items-center p-4 bg-primary text-text-primary">
		<h1 class="text-3xl text-center font-serif">
			<a href="/">atelier JS | editor</a>
		</h1>
		<nav class="flex gap-4">
			<a href="/">Home</a>
			{#if $session.user}
				<a href="/profile">{$session.user.email}</a>
				<a on:click|preventDefault={() => supabase.auth.signOut()} href="/logout">Log out</a>
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
