import { getContext, setContext } from 'svelte';
import type { Context } from './types';

export const KEY = {};

export function getIDEContext(): Context {
	return getContext(KEY);
}
export function setIDEContext(context: Partial<Context>) {
	setContext(KEY, context);
	return context;
}
