<script lang="ts" context="module">
	import { writable } from 'svelte/store';
	const currentFocusPath = writable<string>('/');

	const openState = writable({});
</script>

<script lang="ts">
	import FileIcon from './FileIcon.svelte';
	import { getContext } from 'svelte';
	import { KEY } from '../context';
	import { getExtension, getFilename } from '../helper';
	import type { IContext } from '../types';

	import type { ITreeFile, ITreeFolder } from './types';

	const context = getContext<IContext>(KEY);
	export let items: ITreeFolder['children'];
</script>

<ul class="flex flex-col">
	{#each items as item}
		{#if item.type === 'directory'}
			<li on:click|stopPropagation={() => ($currentFocusPath = item.path)}>
				<button
					class="flex items-center"
					on:click={() => ($openState[item.path] = !$openState[item.path])}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						class:rotate-90={$openState[item.path]}
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
					<span>
						{item.name}
					</span>
				</button>
				{#if $openState[item.path]}
					<div class="ml-2">
						<svelte:self items={item.children} />
					</div>
				{/if}
			</li>
		{:else}
			<li>
				<button class="flex items-center max-w-full" on:click={() => context.openFile(item.path)}>
					<FileIcon extension={getExtension(item.name)} />
					<button class="flex max-w-full pr-2">
						<span class="pl-1 truncate">
							{getFilename(item.name)}
						</span>
						<span class="min-w-max">
							{getExtension(item.name)}
						</span>
					</button>
				</button>
				<span
					class="absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-[#252526] bg-opacity-75 p-1"
				>
					<button title="Rename file" class="pr-1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 21 21 21"
							/>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4.5 13.5L14.5 3.5C15.3284 2.67157 16.6716 2.67157 17.5 3.5C18.3284 4.32843 18.3284 5.67157 17.5 6.5L7.5 16.5L3.5 17.5L4.5 13.5Z"
							/>
						</svg>
					</button>
					<button title="Delete file">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 6H21M5 6V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V6M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6M14 11V17M10 11V17"
							/>
						</svg>
					</button>
				</span>
			</li>
		{/if}
	{/each}
</ul>
