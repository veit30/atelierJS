<script lang="ts">
	import { session } from '$app/stores';
	import { supabase } from '@svuick/supabase/app';

	import P5Iframe from '$lib/iframes/p5.svelte';
	import Editor from '$lib/Editor.svelte';
	import PlaygroundOptions from '$lib/PlaygroundOptions.svelte';
	import type { Artwork } from '$lib/types/Artworks';

	let code = '';
	let refresh: () => void;

	async function handleSave() {
		// code in supabase speichern
		const { data: newArtwork, error } = await supabase
			.from<Artwork>('artworks')
			.insert({
				owner: $session.supabase.user.id,
				title: 'Awesome stuff',
				description: 'This is just awesome lol.',
				visibility: 'public',
				config: [
					/**
					 * --- types ---
					 * number, string, boolean, seed, file
					 */
					{
						name: 'WIDTH',
						type: 'number',
						value: 800
					},
					{
						name: 'Seed',
						type: 'seed',
						value: 1236 // seed
					}
				]
			})
			.single();

		const {
			data: { Key },
			error: uploadError
		} = await supabase.storage
			.from('artworks')
			.upload(`${$session.supabase.user.id}/${newArtwork.id}/main.js`, code);
	}
</script>

<svelte:head>
	<title>Editor | atelierJS</title>
</svelte:head>

<section class="min-h-screen flex flex-col">
	<div>
		<PlaygroundOptions />
	</div>
	<div class="flex-grow grid grid-cols-2 p-4 gap-2">
		<div class="flex flex-col">
			<div class="flex-grow">
				<Editor bind:code on:save={handleSave} on:reload={refresh} />
			</div>
			<button on:click={refresh}>Run</button>
			{#if $session.supabase.user}
				<button on:click={handleSave}>Save</button>
			{/if}
		</div>
		<div class="grid place-items-center">
			<div class="rounded bg-white shadow hover:shadow-lg transition-shadow">
				<P5Iframe bind:refresh {code} />
			</div>
		</div>
	</div>
</section>
