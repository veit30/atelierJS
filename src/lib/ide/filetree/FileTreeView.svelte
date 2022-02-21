<script lang="ts">
	import type { IContext, IFile, IModel } from '../types';
	import { getContext } from 'svelte';
	import { KEY } from '../context';
	import FileTreeFolder from './FileTreeFolder.svelte';
	import { getExtension, getFilename } from '../helper';
	import FileIcon from './FileIcon.svelte';

	const context = getContext<IContext>(KEY);

	$: tree = parse($context.files);

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
						path: '/' + parts.slice(0, i + 1).join('/')
					};
					current.push(folder);
				}
				current = folder.children;
			});

			current.push({
				name: filename,
				type: 'file',
				path
			});
		});

		return root;
	}

	let newFile;
	function handleNewFile() {
		window.addEventListener('click', () => (newFile = false), { once: true });
	}
</script>

<div class="flex gap-2 justify-end">
	<button title="New Folder">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="28"
			height="28"
			viewBox="0 0 64 64"
			fill="none"
			stroke-width="1px"
			stroke="currentColor"
		>
			<path d="M28 20l-4-8H8v40h48V20H28z" />
		</svg>
		<!-- <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" stroke="currentColor" stroke-linecap="square" aria-labelledby="folderAddIconTitle" color="currentColor" viewBox="0 0 24 24"><path d="M3 5H9L10 7H21V19H3V5zM15 13H9M12 10V16"/></svg> -->
	</button>
	<button title="New File" on:click={handleNewFile}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="28"
			height="28"
			viewBox="0 0 64 64"
			fill="none"
			stroke-width="1px"
			stroke="currentColor"
		>
			<path d="M44 8v8h8" />
			<path d="M52 16l-8-8H12v48h40V16z" />
			<path d="M24 40l-4-8 4-8M40 40l4-8-4-8M34 20l-4 24" />
		</svg>
		<!-- <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" stroke="currentColor" stroke-linecap="square" aria-labelledby="fileIconTitle" color="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" d="M13 3v6h6"/><path d="M13 3l6 6v12H5V3z"/></svg> -->
	</button>
</div>

<FileTreeFolder items={tree} />

<!-- 
<ul class="flex flex-col">
    {#each models as model}
        <li class="px-2 flex justify-between items-center group relative">
            <button class="flex items-center max-w-full" on:click={() => context.openFile(model)}>
                <FileIcon extension={getExtension(model.uri.path)}/>
                <button class="flex max-w-full pr-2">
                    <span class="pl-1 truncate">
                        {getFilename(model.uri.path)}
                    </span>
                    <span class="min-w-max">
                        {getExtension(model.uri.path)}
                    </span>
                </button>
            </button>
            <span class="absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-[#252526] bg-opacity-75 p-1">
                <button title="Rename file" class="pr-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21 21 21"/>
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 13.5L14.5 3.5C15.3284 2.67157 16.6716 2.67157 17.5 3.5C18.3284 4.32843 18.3284 5.67157 17.5 6.5L7.5 16.5L3.5 17.5L4.5 13.5Z"/>
                    </svg>
                </button>
                <button title="Delete file">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6H21M5 6V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V6M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6M14 11V17M10 11V17"/>
                    </svg>
                </button>
            </span>
        </li>
    {/each}
</ul> -->
