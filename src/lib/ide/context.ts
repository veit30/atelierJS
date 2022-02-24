import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';
import type { Context, IFile } from './types';

export const KEY = {};

export function getIDEContext(): Context {
	return getContext(KEY);
}
export function createIDEContext(input: { files: IFile[] }): Context {
	const events = new EventTarget();
	const context = {
		events: {
			addEventListener(type, cb, options) {
				events.addEventListener(type, cb, options);
			},
			removeEventListener(type, cb, options) {
				events.removeEventListener(type, cb, options);
			},
			dispatch(type, detail) {
				events.dispatchEvent(new CustomEvent(type, { detail }));
			}
		},
		focusedPath: writable('/'),
		files: writable(input.files)
	};
	setContext(KEY, context);
	return context;
}
