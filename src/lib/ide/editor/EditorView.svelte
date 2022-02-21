<script lang="ts" context="module">
	import type IMonaco from 'monaco-editor';
	export type IEditor = IMonaco.editor.IStandaloneCodeEditor;
</script>

<script lang="ts">
	import type { IFile, IContext, ConsoleEntry } from '../types';
	import { setContext } from 'svelte';
	import { KEY } from '../context';

	import { createEventDispatcher, onMount } from 'svelte';
	import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
	import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
	import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
	import { writable } from 'svelte/store';
	import FileTree from '../filetree/FileTreeView.svelte';
	import EditorConsole from './EditorConsole.svelte';

	export let consoleOutput: ConsoleEntry[];
	export let currentFile: string = undefined;
	export let files: IFile[];

	let ready = false;
	const context: IContext = {
		...writable({
			monaco: null,
			editor: null,
			models: {},
			files
		}),

		openFile(path) {
			$context.editor.setModel($context.models[$context.monaco.Uri.parse(path).toString()]);
		},
		closeFile() {
			$context.editor.setModel(null);
		},
		addFile(path, content = '') {
			const newFile: IFile = {
				path,
				content
			};
			$context.files = [...$context.files, newFile];
			$context.monaco.editor.createModel(
				newFile.content,
				null,
				$context.monaco.Uri.parse(newFile.path)
			);
		},
		removeFile(path) {
			$context.files = $context.files.filter((f) => f.path !== path);
			$context.monaco.editor.getModel($context.monaco.Uri.parse(path)).dispose();
		},
		renameFile(oldPath, newPath) {
			const value = $context.monaco.editor.getModel($context.monaco.Uri.parse(oldPath)).getValue();
			context.removeFile(oldPath);
			context.addFile(newPath, value);
		}
	};
	setContext<IContext>(KEY, context);

	$: monaco = $context.monaco;
	$: editor = $context.editor;
	$: models = $context.models;

	const dispatch = createEventDispatcher();

	let targetEl: HTMLDivElement;

	onMount(async () => {
		ready = false;
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

		$context.monaco = monaco = await import('monaco-editor');

		monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
		monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
			allowJs: true
			// 	target: Monaco.languages.typescript.ScriptTarget.ES2015,
			// 	lib: ['es6']
		});

		files.forEach(({ path, content }) => {
			const uri = monaco.Uri.parse(path);
			const existingModel = monaco.editor.getModel(uri);
			if (existingModel) {
				existingModel.setValue(content);
				$context.models[uri.toString()] = existingModel;
			} else {
				const model = monaco.editor.createModel(content, null, uri);
				$context.models[uri.toString()] = model;
			}
		});

		$context.editor = editor = monaco.editor.create(targetEl, {
			theme: 'vs-dark',
			automaticLayout: false,
			minimap: {
				enabled: false
			}
		});

		let disposeChangeContentListener;
		editor.onDidChangeModel((e) => {
			if (typeof disposeChangeContentListener === 'function') {
				disposeChangeContentListener();
				disposeChangeContentListener = null;
			}
			if (e.newModelUrl) {
				const file = files.find((f) => f.path === e.newModelUrl.path);
				const model = editor.getModel();
				disposeChangeContentListener = model.onDidChangeContent((e) => {
					file.content = model.getValue();
				});
			}
		});

		if (currentFile) {
			const uri = monaco.Uri.parse(currentFile);
			editor.setModel(models[uri.toString()]);
		}

		// editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, function () {
		//     const currentModel = editor.getModel();
		//     const content = currentModel.getValue();
		//     const file = files.find((f) => f.path === currentModel.uri.path);
		//     if (file) {
		//         file.content = content;
		//     } else {
		//         files.push({ path: currentModel.uri.path, content });
		//     }
		//     files = files;
		//     dispatch('save');
		// });

		dispatch('ready', editor);
		ready = true;

		function resize() {
			editor.layout({ width: 0, height: 0 });
			editor.layout();
		}

		window.addEventListener('resize', resize);

		return () => {
			window.removeEventListener('resize', resize);
			for (let i in models) {
				models[i].dispose();
			}
			editor.dispose();
		};
	});
</script>

<div class="wrapper flex-grow h-full flex bg-[#252526] text-white select-none">
	<aside class="p-1 flex flex-col w-[150px] gap-4">
		{#if ready}
			<FileTree />
		{/if}
	</aside>
	<div class="flex-grow flex flex-col overflow-hidden bg-[#1e1e1e]">
		<div class="flex-grow" bind:this={targetEl} />
		<EditorConsole bind:output={consoleOutput} />
	</div>
</div>
