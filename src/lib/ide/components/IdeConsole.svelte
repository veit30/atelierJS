<script lang="ts">
	import type { IConsoleEntry } from '../types';
	import { onMount, tick } from 'svelte';
	import { getIDEContext } from '../context';
	import Icon, { ICON } from '$lib/icon';

	const context = getIDEContext();
	export let consoleHeight = 300;
	export let output: IConsoleEntry[] = [];

	let visible = true;

	function handleConsoleLog({ detail: data }: CustomEvent<IConsoleEntry>) {
		output = [data, ...output];
	}

	function handleConsoleClear() {
		output = [];
	}

	async function collapseConsole() {
		visible = !visible;
		await tick();
		context.events.dispatch('editor:layout');
	}

	function handlePointerDown(e: PointerEvent) {
		let startY = e.clientY;
		let startHeight = consoleHeight;

		async function handleMove(e: PointerEvent) {
			let newHeight = startHeight + (startY - e.clientY);

			if (newHeight <= 20 || newHeight >= 600) return;
			consoleHeight = newHeight;
			await tick();
			context.events.dispatch('editor:layout');
		}

		window.addEventListener('pointermove', handleMove);

		window.addEventListener(
			'pointerup',
			() => {
				window.removeEventListener('pointermove', handleMove);
			},
			{ once: true }
		);
	}

	onMount(() => {
		context.events.addEventListener('console:log', handleConsoleLog);
		context.events.addEventListener('console:clear', handleConsoleClear);

		return () => {
			context.events.removeEventListener('console:log', handleConsoleLog);
			context.events.removeEventListener('console:clear', handleConsoleClear);
		};
	});
</script>

<div>
	<div class="resizer--horizontal" on:pointerdown={handlePointerDown} />
	<div class="flex justify-between items-center bg-[#252526] text-base">
		<div class="px-2 py-[2px]">Console</div>
		<div class="flex items-center">
			<button class="px-2 py-[2px]" on:click={handleConsoleClear}>Clear</button>
			<button class="px-2 py-[2px]" title="collapse" on:click={collapseConsole}>
				<Icon
					name={ICON.CHEVRON_DOWN}
					class="transform {visible ? '' : 'rotate-180'}"
					size="24px"
				/>
			</button>
		</div>
	</div>
	{#if visible}
		<div
			class="bg-[#2d2d2e] font-mono text-sm flex flex-col-reverse overflow-y-auto"
			style="height: {consoleHeight}px"
		>
			<div class="mb-auto" />
			{#each output as { message, type }}
				<div class="px-2" class:text-red-500={type === 'error'}>
					{message}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style lang="postcss">
	.resizer--horizontal {
		@apply cursor-row-resize h-[10px] border-y-[5px] border-solid border-[#252526] w-full;
		margin: -5px 0;
		opacity: 0.02;
		z-index: 9999;
		box-sizing: border-box;
	}
</style>
