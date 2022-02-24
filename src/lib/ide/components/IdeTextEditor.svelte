<script lang="ts" context="module">
	import type IMonaco from 'monaco-editor';

	let monacoReady = false;
	let monaco: typeof IMonaco;
	let URI: typeof IMonaco.Uri;
	const refs = new Map<IMonaco.Uri, number>();

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

	async function setupMonaco() {
		if (monacoReady) return;

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
		monaco = await import('monaco-editor');
		URI = monaco.Uri;
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

	const { events, files } = getIDEContext();

	const uris = new Set<IMonaco.Uri>();
	let editor: IMonaco.editor.IStandaloneCodeEditor;
	let targetEl: HTMLDivElement;

	function handleAddFile({ detail: file }: CustomEvent<IFile>) {
		const uri = URI.parse(file.path);
		createModel(uri, file.content);
		uris.add(uri);
	}
	function handleDeleteFile({ detail: file }: CustomEvent<IFile>) {
		const uri = URI.parse(file.path);
		disposeModel(uri, true);
		uris.delete(uri);
	}
	function handleOpenFile({ detail: file }: CustomEvent<IFile>) {
		let model = monaco.editor.getModel(URI.parse(file.path));
		if (!model) return;
		editor.setModel(model);
	}
	function handleCloseFile({ detail: file }: CustomEvent<IFile>) {
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
			disposeAble.dispose();
			extraLibs.delete(lib.path);
		}
	}
	function handleLayout() {
		editor.layout({ height: 0, width: 0 });
		editor.layout();
	}

	onMount(async () => {
		await setupMonaco();

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
			theme: 'vs-dark',
			model: null,
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
				events.dispatch('file:open', { path: e.newModelUrl.path });
				const model = editor.getModel();
				disposeChangeContentListener = model.onDidChangeContent(() => {
					events.dispatch('file:change', {
						path: model.uri.path,
						content: model.getValue()
					});
				});
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

		events.addEventListener('file:add', handleAddFile);
		events.addEventListener('file:delete', handleDeleteFile);
		events.addEventListener('file:open', handleOpenFile);
		events.addEventListener('file:close', handleCloseFile);
		events.addEventListener('editor:add_extra_lib', handleAddExtraLib);
		events.addEventListener('editor:remove_extra_lib', handleRemoveExtraLib);
		events.addEventListener('editor:layout', handleLayout);

		window.addEventListener('resize', handleLayout);
		handleLayout();

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
