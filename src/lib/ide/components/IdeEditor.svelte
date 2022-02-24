<script lang="ts">
	import { onMount } from 'svelte';
	import { getIDEContext } from '../context';
	import { getBasename } from '../helper';
	import type { IFile } from '../types';
	import IdeTextEditor from './IdeTextEditor.svelte';

	export let showOpenFiles = false;
	const { events } = getIDEContext();
	let openFiles: IFile[] = [];
	let currentFile: IFile;

	function getComponent(filepath: string) {
		if (!filepath) return null;

		return IdeTextEditor;
	}

	function closeFile(file: IFile) {
		openFiles = openFiles.filter((f) => f.path !== file.path);
	}
	function handleFileOpen({ detail: file }: CustomEvent<IFile>) {
		currentFile = file;
		if (openFiles.find((f) => f.path === file.path)) return;
		openFiles = [...openFiles, currentFile];
	}
	function handleFileClose({ detail: file }: CustomEvent<IFile>) {
		currentFile = null;
		openFiles = openFiles.filter((f) => f.path !== file.path);
	}
	function handlePointerDown(e: PointerEvent, file: IFile) {
		if (e.button == 1) {
			e.preventDefault();
			closeFile(file);
		}
	}

	onMount(() => {
		events.addEventListener('file:open', handleFileOpen);
		events.addEventListener('file:close', handleFileClose);

		return () => {
			events.removeEventListener('file:open', handleFileOpen);
			events.removeEventListener('file:close', handleFileClose);
		};
	});
</script>

<div class="flex-grow flex flex-col">
	{#if showOpenFiles}
		<div>
			<ul class="flex h-8">
				{#each openFiles as file}
					<li>
						<button
							on:pointerup={(e) => handlePointerDown(e, file)}
							on:click={() => events.dispatch('file:open', file)}
							class="px-2 py-1 {currentFile.path == file.path ? 'bg-[#1e1e1e]' : 'bg-[#2d2d2d]'}"
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
	<svelte:component this={getComponent(currentFile?.path)} />
</div>
