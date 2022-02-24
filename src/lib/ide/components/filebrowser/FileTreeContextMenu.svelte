<script lang="ts" context="module">
	interface IFileTreeContextMenuAction {
		label: string;
		handler?: () => void;
		icon?: typeof SvelteComponent | string;
	}

	export type FileTreeContextMenuAction = IFileTreeContextMenuAction | 'seperator';
</script>

<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	export let actions: FileTreeContextMenuAction[] = [];
</script>

<div class="bg-[#3c3c3c] shadow-neutral-900 shadow py-2 flex flex-col">
	{#each actions as action}
		{#if action === 'seperator'}
			<hr class="border-neutral-500 m-2" />
		{:else}
			<button on:click={action.handler}>
				<span>{action.label}</span>
				{#if typeof action.icon === 'string'}
					{@html action.icon}
				{:else if action.icon}
					<svelte:component this={action.icon} />
				{/if}
			</button>
		{/if}
	{/each}
</div>

<style lang="postcss">
	button {
		@apply flex gap-2 justify-between items-center px-4 py-1 text-white hover:bg-[#094771] disabled:text-neutral-500;
	}
</style>
