import type { Writable } from 'svelte/store';

type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export interface IFile {
	path: string;
	content: string;
}

export interface IdeEvents {
	openfile: Pick<IFile, 'path'>;
	closefile: Pick<IFile, 'path'>;
	newfile: IFile;
	removefile: Pick<IFile, 'path'>;
	changefile: IFile;
}
export interface ContextEvents {
	'file:add': IFile;
	'file:change': IFile;
	'file:delete': Pick<IFile, 'path'>;
	'file:open': Pick<IFile, 'path'>;
	'file:close': Pick<IFile, 'path'>;
	'file:request_new': undefined;
	'folder:request_new': undefined;

	'console:log': IConsoleEntry;
	'console:clear': undefined;

	'editor:layout': undefined;
	'editor:add_extra_lib': { content: string; path: string };
	'editor:remove_extra_lib': { content: string; path: string };
}

export interface Context {
	events: {
		addEventListener<K extends keyof ContextEvents>(
			type: K,
			callback: (event: CustomEvent<ContextEvents[K]>) => void | Promise<void>,
			options?: boolean | AddEventListenerOptions
		): void;
		removeEventListener<K extends keyof ContextEvents>(
			type: K,
			callback: (event: CustomEvent<ContextEvents[K]>) => void | Promise<void>,
			options?: boolean | EventListenerOptions
		): void;
		dispatch<K extends keyof ContextEvents>(type: K, detail?: ContextEvents[K]): void;
	};
	focusedPath: Writable<string>;
	files: Writable<IFile[]>;
}

export interface IConsoleEntry {
	type: 'error' | 'info';
	message: string;
}
