export { default } from './IDE.svelte';

export interface IdeInstance {
	console: {
		log(...args: string[]): void;
		error(...args: string[]): void;
	};
}
