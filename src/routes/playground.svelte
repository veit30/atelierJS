<script lang="ts">
	import { run } from '$lib/compiler';
	import Artwork1 from '$lib/examples/artwork1';
	import { createIframeSourceCode } from '$lib/helper';
	import { SourceMapConsumer } from 'source-map';
	import IDE, { type IdeInstance } from '$lib/ide';
	import Icon, { ICON } from '$lib/icon';

	let HEIGHT = 800;
	let WIDTH = 800;

	let ide: IdeInstance;
	let removeEventListener: Function;
	let iframe: HTMLIFrameElement;
	let files = [
		{ path: '/globals.json', content: '' },
		{ path: '/main.js', content: Artwork1 },
		{ path: '/very/deep/folder/test.js', content: '' }
	];

	async function compileAndRun() {
		const fileMap = new Map(files.map((f) => [f.path, f.content]));
		const { error, code, map } = await run(fileMap);

		if (error) {
			ide.console.error(`${error}`);
			return;
		}

		async function handleIframeEvent(e: MessageEvent) {
			if (e.source !== iframe?.contentWindow) return;
			const { type, data } = e.data;

			switch (type) {
				case 'error':
					await SourceMapConsumer.with(map!, null, (consumer) => {
						const pos = consumer.originalPositionFor({
							column: data.column,
							line: data.line
						});
						ide.console.error(`${data.error} at ${pos.source} ${pos.line}:${pos.column}`);
					});
					break;
				case 'console.log':
					ide.console.log(`${data}`);
					break;
				case 'console.error':
					ide.console.error(`${data}`);
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
				<Icon name={ICON.PLAY} size="24px" />
				Run
			</button>
		</div>
		<IDE
			bind:ide
			bind:files
			on:openfile={({ detail: file }) => console.log('openfile', file)}
			on:closefile={() => console.log('closefile')}
			on:addfile={({ detail: file }) => console.log('addfile', file)}
			on:removefile={({ detail: file }) => console.log('removefile', file)}
			on:renamefile={({ detail: file }) => console.log('renamefile', file)}
			on:filechange={({ detail: file }) => console.log('filechange', file)}
		/>
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
