<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { getBasename } from '../helper';

	import type { IFile } from '../types';

	export let editor: typeof SvelteComponent;
	export let showOpenFiles = false;
	let openFiles: IFile[] = [];
	let currentFile: IFile;

	function openFile(file: IFile) {}
	function closeFile(file: IFile) {}
	function handlePointerDown(e: PointerEvent, file: IFile) {
		if (e.button == 1) {
			closeFile(file);
		}
	}
</script>

<div class="flex-grow flex flex-col">
	{#if showOpenFiles}
		<div>
			<ul class="flex h-8">
				{#each openFiles as file}
					<li>
						<button
							on:pointerup={(e) => handlePointerDown(e, file)}
							on:click={() => openFile(file)}
							class="px-2 py-1 {currentFile == file ? 'bg-[#1e1e1e]' : 'bg-[#2d2d2d]'}"
						>
							{getBasename(file.path)}
							<span class="p-1" on:click|preventDefault|stopPropagation={() => closeFile(file)}
								>&times;</span
							>
						</button>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
	<svelte:component this={editor} />
</div>
