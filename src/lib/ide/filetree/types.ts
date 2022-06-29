import type { Uri } from '../types';

export interface ITreeFile {
	name: string;
	type: 'file';
	uri: Uri;
	path: string;
}

export interface ITreeFolder {
	name: string;
	type: 'directory';
	path: string;
	children: (ITreeFile | ITreeFolder)[];
}

export const TREE_KEY = {};
