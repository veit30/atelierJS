import type { Uri } from './types';

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

export function equalsUri(...uri: Uri[]) {
	const [a, b, ...rest] = uri;
	if (a.toString() !== b.toString()) return false;
	return rest.length ? equalsUri(b, ...rest) : true;
}
