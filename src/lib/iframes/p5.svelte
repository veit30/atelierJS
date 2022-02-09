<script lang="ts">
	import { browser } from '$app/env';

	let height: number;
	let width: number;
	export let code: string;

	function setCode(iframe: HTMLIFrameElement) {
		const content = code;
		const script = iframe.contentDocument.createElement('script');
		script.innerHTML = content;
		iframe.contentDocument.head.append(script);
	}

	function setcode(iframe: HTMLIFrameElement) {
		if (iframe.contentDocument.readyState === 'complete') {
			setCode(iframe);
		} else {
			iframe.addEventListener('load', () => setCode(iframe));
		}
		iframe.contentWindow.addEventListener('message', (e) => {
			width = e.data.width;
			height = e.data.height;
		});

		setCode(iframe);
	}

	let i = 0;
	export const refresh = () => {
		i++;
	};
</script>

{#if browser}
	{#key i}
		<iframe use:setcode {width} {height} title="p5 iframe" src="/iframe/p5.html" frameborder="0" />
	{/key}
{/if}
