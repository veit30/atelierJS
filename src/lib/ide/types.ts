import type { SourceMap } from 'rollup';
import type { Writable } from 'svelte/store';
import type IMonaco from 'monaco-editor';

export type Uri = IMonaco.Uri;
export type IModel = IMonaco.editor.ITextModel;

export type IContext = Writable<{
	monaco: typeof IMonaco;
	editor: IMonaco.editor.IStandaloneCodeEditor;
	models: Record<string, IMonaco.editor.ITextModel>;
	files: IFile[];
}> & {
	openFile(path: string): void;
	closeFile(path?: string): void;
	addFile(path: string, content?: string): void;
	removeFile(path: string): void;
	renameFile(oldPath: string, newPath: string): void;
};

export interface IFile {
	path: string;
	content: string;
	language?: string;
}

export interface ConsoleEntry {
	type: 'error' | 'info';
	message: string;
}

export type CompilerOutput =
	| {
			error: null;
			code: string;
			map: SourceMap;
	  }
	| {
			error: Error;
			code: null;
			map: null;
	  };
