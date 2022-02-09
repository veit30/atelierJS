<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type monaco from 'monaco-editor';

	import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
	import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
	import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

	export let code: string;

	const dispatch = createEventDispatcher();

	let targetEl: HTMLDivElement;
	let Monaco: typeof monaco;
	let editor: monaco.editor.IStandaloneCodeEditor;

	onMount(async () => {
		// @ts-ignore
		self.MonacoEnvironment = {
			getWorker: function (_moduleId: any, label: string) {
				if (label === 'json') {
					return new jsonWorker();
				}
				if (label === 'typescript' || label === 'javascript') {
					return new tsWorker();
				}
				return new editorWorker();
			}
		};

		Monaco = await import('monaco-editor');

		editor = Monaco.editor.create(targetEl, {
			language: 'javascript',
			theme: 'vs-dark',
			value: code,
			automaticLayout: true
		});

		const saveBinding = editor.addCommand(Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.KeyS, function () {
			code = editor.getValue();
			dispatch('save');
		});

		const reloadBinding = editor.addCommand(
			Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.KeyR,
			function () {
				dispatch('reload');
			}
		);

		return () => {
			editor.dispose();
		};
	});
</script>

<div class="h-full" bind:this={targetEl} />
