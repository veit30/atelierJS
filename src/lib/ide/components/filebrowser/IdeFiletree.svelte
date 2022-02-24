<script lang="ts" context="module">
	import type { IFile } from '../../types';

	function sorter(a, b) {
		if (a.type === 'directory' && b.type !== 'directory') return -1;
		if (a.type !== 'directory' && b.type === 'directory') return 1;
		return a.name == b.name ? 0 : a.name < b.name ? -1 : 1;
	}

	function flatten(arr) {
		return arr.map((item) => {
			if (item.type === 'file') return item;
			item.children = flatten(item.children);

			if (item.children.length === 1 && item.children[0].type === 'directory') {
				return {
					...item,
					...item.children[0],
					path: item.children[0].path,
					basepath: item.basepath,
					name: item.name + '/' + item.children[0].name
				};
			}
			return item;
		});
	}

	function parse(files: IFile[]) {
		const root = [];

		files.forEach(({ path }) => {
			let current = root;
			const parts = path.split('/');
			if (parts[0] == '') parts.shift();
			const filename = parts.pop();

			parts.forEach((part, i) => {
				let folder = current.find((f) => f.name === part && f.type === 'directory');
				if (!folder) {
					folder = {
						name: part,
						type: 'directory',
						children: [],
						basepath: joinPaths('/', ...parts.slice(0, i)),
						path: joinPaths('/', ...parts.slice(0, i + 1))
					};
					current.push(folder);
				}
				current = folder.children;
			});

			current.push({
				name: filename,
				type: 'file',
				basepath: joinPaths('/', ...parts),
				path
			});
		});

		return flatten(root.sort(sorter));
	}
</script>

<script lang="ts">
	import { focus, joinPaths } from '$lib/ide/helper';
	import { getIDEContext } from '../../context';
	import Icon, { ICON } from '$lib/icon';
	import IdeFiletreeEntry from './IdeFiletreeEntry.svelte';

	let showNewFileForm = false;
	let newFilePath = '';
	const { events, files, focusedPath } = getIDEContext();

	$: tree = parse($files);

	function handleNewFile() {
		if (!newFilePath) return;
		events.dispatch('file:add', {
			path: joinPaths($focusedPath, newFilePath),
			content: ''
		});
		newFilePath = '';
		showNewFileForm = false;
	}
</script>

<div class="flex-grow flex flex-col gap-2 py-2">
	<ul on:click={() => ($focusedPath = '/')}>
		{#each tree as item}
			<IdeFiletreeEntry {item} />
		{/each}
	</ul>

	{#if showNewFileForm}
		<form on:submit|preventDefault={handleNewFile}>
			<input
				type="text"
				use:focus
				on:blur={() => ((showNewFileForm = false), (newFilePath = ''))}
				class="w-full bg-neutral-900/80 outline-none px-2 py-1"
				bind:value={newFilePath}
			/>
		</form>
	{/if}

	<button
		title="New File"
		class="text-slate-400 p-2 flex flex-col items-center justify-center w-full bg-neutral-700 hover:bg-neutral-600"
		on:click={() => (showNewFileForm = true)}
	>
		<Icon name={ICON.NEW_FILE} size="24px" />
		New File
	</button>
</div>
