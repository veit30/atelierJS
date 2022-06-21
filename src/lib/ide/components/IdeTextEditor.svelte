<script lang="ts" context="module">
	import type IMonaco from 'monaco-editor';
	import { loadWASM } from 'onigasm';
	import { Registry } from 'monaco-textmate';
	import { wireTmGrammars } from 'monaco-editor-textmate';

	let monacoReady = false;
	let monaco: typeof IMonaco;
	let URI: typeof IMonaco.Uri;
	const refs = new Map<IMonaco.Uri, number>();
	let registry: Registry;
	let grammars: Map<any, any>;

	//TODO: fix ts errors
	function createModel(uri: IMonaco.Uri, value: string): IMonaco.editor.ITextModel {
		const existingModel = monaco.editor.getModel(uri);
		if (refs.has(uri) && existingModel) {
			const count = refs.get(uri) + 1;
			refs.set(uri, count);
			return monaco.editor.getModel(uri);
		}
		refs.set(uri, 1);
		return existingModel ?? monaco.editor.createModel(value, null, uri);
	}

	function disposeModel(uri: IMonaco.Uri, force = false) {
		if (refs.has(uri)) {
			const count = refs.get(uri) - 1;
			if (count > 0 && !force) {
				refs.set(uri, count);
				return;
			}
			refs.delete(uri);
		}
		const existingModel = monaco.editor.getModel(uri);
		if (existingModel) {
			existingModel.dispose();
		}
	}

	async function loadTokenizer() {
		await loadWASM(`/lib/onigasm.wasm`);

		//TODO: get grammars here: https://github.com/microsoft/vscode/tree/94c9ea46838a9a619aeafb7e8afd1170c967bb55/extensions

		registry = new Registry({
			getGrammarDefinition: async (scopeName) => {
				switch (scopeName) {
					case 'source.ts':
						return {
							format: 'json',
							content: await (
								await fetch(
									`https://raw.githubusercontent.com/microsoft/vscode/main/extensions/typescript-basics/syntaxes/TypeScript.tmLanguage.json`
								)
							).text()
						};
					case 'source.js':
						return {
							format: 'json',
							content: await (
								await fetch(
									`https://raw.githubusercontent.com/microsoft/vscode/main/extensions/javascript/syntaxes/JavaScript.tmLanguage.json`
								)
							).text()
						};
					case 'source.json':
						return {
							format: 'json',
							content: await (
								await fetch(
									`https://raw.githubusercontent.com/microsoft/vscode/main/extensions/json/syntaxes/JSON.tmLanguage.json`
								)
							).text()
						};
					case 'text.html.basic':
						return {
							format: 'json',
							content: await (
								await fetch(
									`https://raw.githubusercontent.com/microsoft/vscode/main/extensions/json/syntaxes/JSON.tmLanguage.json`
								)
							).text()
						};
					case 'source.css':
						return {
							format: 'json',
							content: await (
								await fetch(
									`https://raw.githubusercontent.com/microsoft/vscode/main/extensions/css/syntaxes/css.tmLanguage.json`
								)
							).text()
						};
					case 'text.html.markdown':
					default:
						return {
							format: 'json',
							content: `{}`
						};
				}
			}
		});

		// map of monaco "language id's" to TextMate scopeNames
		grammars = new Map();
		grammars.set('css', 'source.css');
		grammars.set('html', 'text.html.basic');
		grammars.set('json', 'source.json');
		grammars.set('typescript', 'source.ts');
		grammars.set('javascript', 'source.js');
		grammars.set('markdown', 'text.html.markdown');
	}

	async function setupMonaco() {
		if (monacoReady) return;

		// @ts-ignore
		self.MonacoEnvironment = {
			getWorker: function (_moduleId: any, label: string) {
				console.log('getting worker', label);

				if (label === 'json') {
					return new jsonWorker();
				}
				if (label === 'typescript' || label === 'javascript') {
					return new tsWorker();
				}
				return new editorWorker();
			}
		};
		monaco = await import('monaco-editor');
		URI = monaco.Uri;

		monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
		monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
			// allowJs: true,
			target: monaco.languages.typescript.ScriptTarget.ESNext
			// noLib: true
		});
		monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
			allowJs: true,
			// allowNonTsExtensions: true,
			target: monaco.languages.typescript.ScriptTarget.ESNext
			// noLib: true
		});

		// set lib
		{
			const content = await fetch('/types/lib.es5.d.ts').then((res) => res.text());
			monaco.languages.typescript.javascriptDefaults.addExtraLib(content, 'lib.es5.d.ts');
		}

		await loadTokenizer();
		monacoReady = true;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
	import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
	import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
	import { getIDEContext } from '../context';
	import type { IFile } from '../types';
	import { text } from 'svelte/internal';
	import AtlierJsDark from '$theme/atelierjs-dark.json';
	import type { IDisposable } from 'monaco-editor';

	const { events, files } = getIDEContext();

	const uris = new Set<IMonaco.Uri>();
	let editor: IMonaco.editor.IStandaloneCodeEditor;
	let targetEl: HTMLDivElement;

	function handleAddFile({ detail: file }: CustomEvent<IFile>) {
		const uri = URI.parse(file.path);
		createModel(uri, file.content);
		uris.add(uri);
	}
	//TODO: check for correct typing
	function handleDeleteFile({ detail: file }: CustomEvent<Pick<IFile, 'path'>>) {
		const uri = URI.parse(file.path);
		disposeModel(uri, true);
		uris.delete(uri);
	}
	function handleOpenFile({ detail: file }: CustomEvent<Pick<IFile, 'path'>>) {
		let model = monaco.editor.getModel(URI.parse(file.path));
		if (!model) return;
		editor.setModel(model);
	}
	function handleCloseFile({ detail: file }: CustomEvent<Pick<IFile, 'path'>>) {
		editor.setModel(null);
	}

	const extraLibs = new Map<string, IMonaco.IDisposable>();

	function handleAddExtraLib(event: CustomEvent<IFile>) {
		handleRemoveExtraLib(event);
		const lib = event.detail;
		const disposeAble = monaco.languages.typescript.javascriptDefaults.addExtraLib(
			lib.content,
			lib.path
		);
		extraLibs.set(lib.path, disposeAble);
	}
	function handleRemoveExtraLib({ detail: lib }: CustomEvent<IFile>) {
		if (extraLibs.has(lib.path)) {
			const disposeAble = extraLibs.get(lib.path);
			disposeAble?.dispose();
			extraLibs.delete(lib.path);
		}
	}
	function handleLayout() {
		editor.layout({ height: 0, width: 0 });
		editor.layout();
	}

	onMount(async () => {
		await setupMonaco();

		// TODO: define monaco theme
		monaco.editor.defineTheme('atelier-dark', AtlierJsDark);

		monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
		monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
			// allowJs: true,
			target: monaco.languages.typescript.ScriptTarget.ESNext
			// noLib: true
		});
		monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
			allowJs: true,
			// allowNonTsExtensions: true,
			target: monaco.languages.typescript.ScriptTarget.ESNext
			// noLib: true
		});

		{
			const content = await fetch('/types/lib.es5.d.ts').then((res) => res.text());
			monaco.languages.typescript.javascriptDefaults.addExtraLib(content, 'lib.es5.d.ts');
		}

		$files.forEach((file) => {
			const uri = URI.parse(file.path);
			createModel(uri, file.content);
			uris.add(uri);
		});

		editor = monaco.editor.create(targetEl, {
			theme: 'atelier-dark',
			model: null,
			automaticLayout: false,
			minimap: {
				enabled: false
			}
		});

		let disposeChangeContentListener: IDisposable | null;
		editor.onDidChangeModel((e) => {
			if (typeof disposeChangeContentListener === 'function') {
				//TODO: fix typescript errors
				//@ts-ignore
				disposeChangeContentListener();
				disposeChangeContentListener = null;
			}
			if (e.newModelUrl) {
				events.dispatch('file:opened', { path: e.newModelUrl.path });
				const model = editor.getModel();
				disposeChangeContentListener =
					model?.onDidChangeContent(() => {
						events.dispatch('file:change', {
							path: model.uri.path,
							content: model.getValue()
						});
					}) ?? null;
			}
		});

		const model = monaco.editor.getModel(URI.parse($files[0].path));
		editor.setModel(model);

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

		await wireTmGrammars(monaco, registry, grammars, editor);

		events.addEventListener('file:add', handleAddFile);
		events.addEventListener('file:delete', handleDeleteFile);
		events.addEventListener('file:open', handleOpenFile);
		events.addEventListener('file:close', handleCloseFile);
		events.addEventListener('editor:add_extra_lib', handleAddExtraLib);
		events.addEventListener('editor:remove_extra_lib', handleRemoveExtraLib);
		events.addEventListener('editor:layout', handleLayout);

		window.addEventListener('resize', handleLayout);
		handleLayout();

		setTimeout(async () => {
			const content = await fetch('/types/global.d.ts').then((res) => res.text());

			events.dispatch('editor:add_extra_lib', {
				path: '/globals.d.ts',
				content: content
			});
		}, 0);

		return () => {
			events.removeEventListener('file:add', handleAddFile);
			events.removeEventListener('file:delete', handleDeleteFile);
			events.removeEventListener('file:open', handleOpenFile);
			events.removeEventListener('file:close', handleCloseFile);
			events.removeEventListener('editor:add_extra_lib', handleAddExtraLib);
			events.removeEventListener('editor:remove_extra_lib', handleRemoveExtraLib);
			events.removeEventListener('editor:layout', handleLayout);

			window.removeEventListener('resize', handleLayout);
			uris.forEach((uri) => {
				disposeModel(uri);
			});
			extraLibs.forEach((lib) => {
				lib.dispose();
			});
			editor.dispose();
		};
	});
</script>

<div class="flex-grow overflow-hidden max-h-full" bind:this={targetEl} />
