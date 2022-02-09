interface ArtworkConfigEntry {
	name: string;
	type: 'number' | 'string' | 'boolean' | 'seed';
	value: number | string;
}

export interface Artwork {
	id: number;
	owner: string;
	title: string;
	description: string;
	config: ArtworkConfigEntry[];
	visibility: string;
}

export interface Render {
	id: number;
	title: string;
	description: string;
	path: string;
	artwork_id: number;
}
