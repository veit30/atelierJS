<script lang="ts">
	import { browser } from '$app/env';
	import Icon, { ICON } from '$lib/icon';
	import { getIDEContext } from '$lib/ide/context';
	import { getExtension, getFilename, joinPaths, focus } from '$lib/ide/helper';
	import ContextMenu from '../ContextMenu.svelte';
	import FileTreeContextMenu from './FileTreeContextMenu.svelte';
	import IdeFileIcon from './IdeFileIcon.svelte';

	const { files, events, focusedPath } = getIDEContext();

	export let depth = 0.5;
	export let item;
	let isFile = item.type === 'file';
	let open = false;

	let editingPos = { start: 0, end: item.name.length };
	let editing = false;

	function handleOpenFile(path) {
		events.dispatch('file:open', { path });
	}

	function handleDelete() {
		if (isFile) {
			events.dispatch('file:delete', { path: item.path });
		} else {
			const toDelete = $files.filter((f) => f.path.startsWith(item.path));
			toDelete.forEach((f) => {
				events.dispatch('file:delete', { path: f.path });
			});
		}
	}

	function getPartPath(i) {
		return joinPaths(item.basepath, ...item.name.split('/').slice(0, i + 1));
	}

	function renameFile(oldPath: string, newPath: string) {
		const oldFile = $files.find((f) => f.path === oldPath);
		if (oldFile) {
			events.dispatch('file:delete', { path: oldFile.path });
			events.dispatch('file:add', { path: newPath, content: oldFile.content });
		}
	}
	function handleEditKeyup(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleEditSubmit(e);
		}
	}
	function handleEditSubmit(e: Event) {
		if (!editing) return;
		editing = false;
		const target = e.target as HTMLInputElement;
		if (!target.value || target.value === item.name) return;

		if (isFile) {
			renameFile(item.path, joinPaths(item.basepath, target.value));
		} else {
			const oldPath = item.path;
			const newPath = joinPaths(item.basepath, target.value);

			const toRename = $files.filter((f) => f.path.startsWith(oldPath));
			toRename.forEach((f) => {
				renameFile(f.path, joinPaths(newPath, f.path.substring(oldPath.length)));
			});
		}
		item.name = target.value;
	}

	function setPos(node: HTMLInputElement) {
		node.selectionStart = editingPos.start;
		node.selectionEnd = editingPos.end;
	}
	function setEditingPos(i: number, part: string) {
		const end = item.name
			.split('/')
			.slice(0, i + 1)
			.join('/').length;
		editingPos = { start: end - part.length, end };
	}
</script>

<ContextMenu let:open={openContextMenu}>
	<FileTreeContextMenu
		slot="contextmenu"
		actions={[
			{ label: 'rename', handler: () => (editing = true) },
			{ label: 'delete', handler: handleDelete }
		]}
	/>
	<li on:contextmenu={(e) => !editing && openContextMenu(e)}>
		{#if item.type === 'file'}
			<button
				style="padding-left:{depth + 1}rem"
				class="relative group flex items-center w-full max-w-full group {$focusedPath === item.path
					? 'bg-neutral-700'
					: 'hover:hover:bg-[#2a2d2e]'}"
				on:click|stopPropagation={() => handleOpenFile(item.path)}
				on:focus|stopPropagation={() => focusedPath.set(item.path)}
			>
				<IdeFileIcon extension={getExtension(item.name)} />
				{#if editing}
					<input
						use:focus
						type="text"
						value={item.name}
						class="bg-blue-600/10 outline-none max-w-min ring-1 ring-blue-600"
						on:keyup={handleEditKeyup}
						on:blur={handleEditSubmit}
					/>
				{:else}
					<div class="flex max-w-full pr-2">
						<span class="pl-1 truncate">
							{getFilename(item.name)}
						</span>
						<span class="min-w-max">
							{getExtension(item.name)}
						</span>
					</div>
				{/if}
				{#if browser}
					<button
						class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
						on:click|stopPropagation={openContextMenu}
					>
						<Icon name={ICON.MORE} size="16px" />
					</button>
				{/if}
			</button>
		{:else}
			<button
				style="padding-left:{depth}rem"
				class="relative group flex items-center w-full max-w-full hover:hover:bg-[#2a2d2e] group"
				on:click|stopPropagation={() => (editing || (open = !open), focusedPath.set(item.path))}
				on:contextmenu={(e) =>
					e.defaultPrevented || (editingPos = { start: 0, end: item.name.length })}
			>
				<div class="flex items-center max-w-full">
					<Icon name={ICON.CHEVRON_RIGHT} class={open ? 'rotate-90' : ''} size="16px" />
					<Icon name={ICON.FOLDER} class="pr-1 text-neutral-400" size="16px" />
					{#if editing}
						<input
							use:setPos
							use:focus
							type="text"
							value={item.name}
							class="bg-blue-600/10 outline-none max-w-min ring-1 ring-blue-600"
							on:keyup={handleEditKeyup}
							on:blur={handleEditSubmit}
						/>
					{:else}
						{#each item.name.split('/') as part, i}
							{#if i > 0}
								<span class="text-sm">/</span>
							{/if}
							<span
								class:underline={$focusedPath === getPartPath(i)}
								on:contextmenu|preventDefault={() => setEditingPos(i, part)}
								on:click|stopPropagation={() => {
									focusedPath.set(getPartPath(i));
									open = item.name.endsWith(part) && !open;
								}}>{part}</span
							>
						{/each}
					{/if}
				</div>
				{#if browser}
					<button
						class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
						on:click|stopPropagation={openContextMenu}
					>
						<Icon name={ICON.MORE} size="16px" />
					</button>
				{/if}
			</button>
			{#if open}
				<ul>
					{#each item.children as item}
						<svelte:self {item} depth={depth + 1} />
					{/each}
				</ul>
			{/if}
		{/if}
	</li>
</ContextMenu>
