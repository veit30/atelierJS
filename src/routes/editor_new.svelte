<script lang="ts">
	import Artwork1 from '$lib/examples/artwork1';
	import { run } from '$lib/compiler';
	import { createIframeSourceCode } from '$lib/helper';
	import { SourceMapConsumer } from 'source-map';

	import IDE from '$lib/ide/index';
	import { onMount } from 'svelte';
	import type { ConsoleEntry } from '$lib/ide/types';

	let removeEventListener: Function;
	let HEIGHT = 800;
	let WIDTH = 800;

	let consoleOutput: ConsoleEntry[] = [];
	let iframe: HTMLIFrameElement;
	let files = [
		{ path: '/main.js', content: Artwork1 },
		{ path: '/some/very/deep/folder/test.js', content: '' }
	];

	let currentFile = '/main.js';

	onMount(() => {
		//@ts-ignore
		SourceMapConsumer.initialize({
			'lib/mappings.wasm': 'https://unpkg.com/source-map@0.7.3/lib/mappings.wasm'
		});
		return removeEventListener;
	});

	async function compileAndRun() {
		const fileMap = new Map(files.map((f) => [f.path, f.content]));
		const { error, code, map } = await run(fileMap);

		//TODO: error handling
		if (error) {
			console.log(error);
			return;
		}

		// const errors = await SourceMapConsumer.with(map, null, consumer => {
		//     console.log(
		//         consumer.originalPositionFor({
		//             line: 2,
		//             column: 2
		//         })
		//     );
		//     { source: 'http://example.com/www/js/two.js',
		//       line: 2,
		//       column: 10,
		//       name: 'n' }

		//     console.log(
		//         consumer.generatedPositionFor({
		//             source: "/main.js",
		//             line: 2,
		//             column: 10
		//         })
		//     );
		//     { line: 2, column: 28 }
		//     return null;
		// });

		//TODO: handle messages from iframe
		async function handleIframeEvent(e: MessageEvent) {
			if (e.source !== iframe?.contentWindow) return;

			const { type, data } = e.data;

			switch (type) {
				case 'error':
					const error = await SourceMapConsumer.with(map, null, (consumer) => {
						const pos = consumer.originalPositionFor({
							column: data.column,
							line: data.line
						});

						consoleOutput = [
							{
								type: 'error',
								message: `${data.error} at ${pos.source} ${pos.line}:${pos.column}`
							},
							...consoleOutput
						];
					});
					break;
				case 'console.log':
					consoleOutput = [{ type: 'info', message: data }, ...consoleOutput];
					break;
				case 'console.error':
					consoleOutput = [{ type: 'error', message: data }, ...consoleOutput];
					break;
				default:
					break;
			}
		}

		if (removeEventListener) removeEventListener();

		window.addEventListener('message', handleIframeEvent);
		removeEventListener = () => window.removeEventListener('message', handleIframeEvent);

		iframe.src = createIframeSourceCode({
			title: 'My Awesome Project',
			body:
				`<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js" crossorigin=""></script` +
				'>',
			script: code,
			map: map.toUrl(),
			params: {
				WIDTH,
				HEIGHT
			}
		});
	}
</script>

<div class="flex-grow grid grid-cols-2 bg-[#252526] text-white">
	<div class="flex flex-col bg-[#333333] border-r-2 border-r-[#414141]">
		<div class="ml-auto py-1 px-2">
			<button
				class="flex gap-2 bg-green-900 hover:bg-green-800 transition-colors px-2 py-1 rounded font-medium"
				on:click={compileAndRun}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 21V3L19 12L5 21Z"
					/>
				</svg>
				Run
			</button>
		</div>
		<IDE bind:files bind:currentFile bind:consoleOutput />
	</div>
	<div class="grid place-items-center">
		<iframe
			class="overflow-hidden"
			width={WIDTH}
			height={HEIGHT}
			bind:this={iframe}
			title="Code runner"
			frameborder="0"
		/>
	</div>
</div>
