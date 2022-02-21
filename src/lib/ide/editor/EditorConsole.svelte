<script lang="ts">
	import type { ConsoleEntry, IContext } from '../types';
	import { getContext, tick } from 'svelte';
	import { KEY } from '../context';
	import { consoleOutput } from './state';

	const context = getContext<IContext>(KEY);
	export let consoleHeight = 300;
	export let output: ConsoleEntry[] = [];

	let visible = true;

	$consoleOutput = [];

	function clearConsole() {
		output = [];
	}

	async function collapseConsole() {
		visible = !visible;

		if (!$context.editor) return;
		if (visible) {
			const { height, width } = $context.editor.getLayoutInfo();
			$context.editor.layout({ height: height - consoleHeight, width });
		} else {
			await tick();
			$context.editor.layout();
		}
	}

	function handlePointerDown(e: PointerEvent) {
		let startY = e.clientY;
		let startHeight = consoleHeight;

		function handleMove(e: PointerEvent) {
			let newHeight = startHeight + (startY - e.clientY);

			if (newHeight <= 20 || newHeight >= 600) return;
			const { height, width } = $context.editor.getLayoutInfo();
			$context.editor.layout({ height: height + consoleHeight - newHeight, width });
			consoleHeight = newHeight;
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
</script>

<div class="">
	<div class="resizer--horizontal" on:pointerdown={handlePointerDown} />
	<div class="flex justify-between items-center bg-[#252526] text-base">
		<div class="px-2 py-[2px]">Console</div>
		<div class="flex items-center">
			<button class="px-2 py-[2px]" on:click={clearConsole}>Clear</button>
			<button class="px-2 py-[2px]" title="collapse" on:click={collapseConsole}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 transform"
					class:rotate-180={!visible}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
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
