<script lang="ts">
	import type { IContext, Uri } from '../types';
	import { getContext, onMount } from 'svelte';
	import { KEY } from '../context';
	import { equalsUri, getBasename } from '../helper';

	const context = getContext<IContext>(KEY);

	let currentUri: Uri;
	let openModelsUri: Uri[] = [];
	let history: Uri[] = [];

	function openModel(uri: Uri) {
		const newModel = $context.models[uri.toString()];
		$context.editor.setModel(newModel);
	}
	function closeModel(uri: Uri) {
		history.pop();
		openModelsUri = openModelsUri.filter((m) => !equalsUri(m, uri));

		if (history.length === 0) {
			$context.editor.setModel(null);
			return;
		}
		const model = $context.models[history[history.length - 1].toString()];
		$context.editor.setModel(model);
	}
	function handlePointerDown(e: PointerEvent, uri: Uri) {
		if (e.button == 1) {
			closeModel(uri);
		}
	}

	onMount(async () => {
		const currentModel = $context.editor.getModel();
		if (currentModel) {
			currentUri = currentModel.uri;
			openModelsUri.push(currentUri);
		}
		$context.editor.onDidChangeModel((e) => {
			currentUri = e.newModelUrl;
			if (e.newModelUrl) {
				const oldIndex = history.findIndex((m) => equalsUri(m, e.newModelUrl));
				if (oldIndex != -1) {
					history.splice(oldIndex, 1);
				}
				history.push(e.newModelUrl);
				if (openModelsUri.includes(e.newModelUrl)) return;
				openModelsUri = [...openModelsUri, e.newModelUrl];
			}
		});
	});
</script>

<div>
	<ul class="flex h-8">
		{#each openModelsUri as uri}
			<li>
				<button
					on:pointerup={(e) => handlePointerDown(e, uri)}
					on:click={() => openModel(uri)}
					class="px-2 py-1 {currentUri == uri ? 'bg-[#1e1e1e]' : 'bg-[#2d2d2d]'}"
				>
					{getBasename(uri.path)}
					<span class="p-1" on:click|preventDefault|stopPropagation={() => closeModel(uri)}
						>&times;</span
					>
				</button>
			</li>
		{/each}
	</ul>
</div>
