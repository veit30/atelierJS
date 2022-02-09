<script context="module" lang="ts">
	import type { Artwork } from '$lib/types/Artworks';
	import type { Load } from '@sveltejs/kit';

	export const prerender = true;

	export const load: Load = async function ({ stuff: { supabase } }) {
		const { error, data } = await supabase
			.from<Artwork>('artworks')
			.select('title, description')
			.eq('visibility', 'public');

		if (error) {
			console.log(error);
		}

		return {
			props: {
				artworks: data
			}
		};
	};
</script>

<script lang="ts">
	import { session } from '$app/stores';
	import { supabase } from '@svuick/supabase/app';

	export let artworks: Artwork[];
</script>

<svelte:head>
	<title>Home | atelierJS</title>
</svelte:head>

<section class="flex flex-col p-4">
	{#each artworks as artwork}
		<div class="bg-neutral-300 p-4 rounded">
			<h3 class="text-xl">{artwork.title}</h3>
			<div>{artwork.description}</div>
		</div>
	{/each}
</section>
