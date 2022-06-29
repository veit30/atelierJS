import { tick } from 'svelte';

export function getBasepath(path: string) {
	return path.substring(0, path.lastIndexOf('/'));
}
export function getBasename(path: string) {
	return path.substring(path.lastIndexOf('/') + 1);
}
export function getFilename(path: string) {
	path = getBasename(path);
	return path.substring(0, path.lastIndexOf('.'));
}
export function getExtension(path: string) {
	path = getBasename(path);
	return path.substring(path.lastIndexOf('.'));
}

export function focus(node: HTMLElement) {
	tick().then(() => {
		node.focus();
	});
}

export function joinPaths(...paths: string[]) {
	return paths.map((p) => p.replace(/(^\/|$\/)/, '')).join('/') || '/';
}
