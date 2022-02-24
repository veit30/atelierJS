<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import type { IFile, IdeEvents } from './types';
	import { setIDEContext } from './context';
	import IdeFiletree from './components/filebrowser/IdeFiletree.svelte';
	import IdeTextEditor from './components/IdeTextEditor.svelte';
	import IdeConsole from './components/IdeConsole.svelte';
	import IdeVisualEditor from './components/IdeVisualEditor.svelte';
	import IdeEditor from './components/IdeEditor.svelte';
	import type { IdeInstance } from '.';

	export let files: IFile[] = [];

	export const ide: IdeInstance = {
		console: {
			log(...args) {
				args.forEach((message) => {
					context.events.dispatch('console:log', { type: 'info', message });
				});
			},
			error(...args) {
				args.forEach((message) => {
					context.events.dispatch('console:log', { type: 'error', message });
				});
			}
		}
	};

	const dispatch = createEventDispatcher<IdeEvents>();
	const events = new EventTarget();

	const context = setIDEContext({
		events: {
			addEventListener(type, cb, options) {
				events.addEventListener(type, cb, options);
			},
			removeEventListener(type, cb, options) {
				events.removeEventListener(type, cb, options);
			},
			dispatch(type, detail) {
				events.dispatchEvent(new CustomEvent(type, { detail }));
			}
		},
		focusedPath: writable('/'),
		files: writable(files)
	});

	function handleNewFile({ detail: file }: CustomEvent<IFile>) {
		const newFile = { content: '', ...file };
		context.files.set((files = [...files, newFile]));
		dispatch('newfile', newFile);
	}
	function handleDeleteFile({ detail: file }: CustomEvent<IFile>) {
		context.files.set((files = files.filter((f) => f.path !== file.path)));
		dispatch('removefile', file);
	}
	function handleChangeFile({ detail: file }: CustomEvent<IFile>) {
		const f = files.find((f) => f.path === file.path);
		if (!f) return;
		f.content = file.content;
		context.files.set((files = files));
		dispatch('changefile', f);
	}
	function handleOpenFile(e: CustomEvent<Pick<IFile, 'path'>>) {
		dispatch('openfile', e.detail);
	}
	function handleCloseFile(e: CustomEvent<Pick<IFile, 'path'>>) {
		dispatch('closefile', e.detail);
	}

	onMount(() => {
		context.events.addEventListener('file:add', handleNewFile);
		context.events.addEventListener('file:delete', handleDeleteFile);
		context.events.addEventListener('file:change', handleChangeFile);
		context.events.addEventListener('file:open', handleOpenFile);
		context.events.addEventListener('file:close', handleCloseFile);

		setTimeout(async () => {
			const content = await fetch('/types/global.d.ts').then((res) => res.text());

			context.events.dispatch('editor:add_extra_lib', {
				path: '/globals.d.ts',
				content: content
			});
		}, 1000);

		return () => {
			context.events.removeEventListener('file:add', handleNewFile);
			context.events.removeEventListener('file:delete', handleDeleteFile);
			context.events.removeEventListener('file:change', handleChangeFile);
			context.events.removeEventListener('file:open', handleOpenFile);
			context.events.removeEventListener('file:close', handleCloseFile);
		};
	});
</script>

<div class="wrapper flex-grow h-full flex bg-[#252526] text-white select-none">
	<aside class="flex flex-col w-[200px] gap-4">
		<IdeFiletree />
	</aside>
	<div class="flex-grow flex flex-col overflow-hidden bg-[#1e1e1e]">
		<!-- <IdeVisualEditor /> -->

		<IdeTextEditor />
		<IdeConsole />
	</div>
</div>
