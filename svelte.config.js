import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		})
	],

	kit: {
		adapter: adapter(),

		// Override http methods in the Todo forms
		methodOverride: {
			allowed: ['PATCH', 'DELETE']
		},
		vite: {
			optimizeDeps: {
				entries: ['monaco-editor']
			},
			resolve: {
				alias: {
					// these are the aliases and paths to them
					$theme: path.resolve('./src/theme')
				}
			}
		}
	}
};

export default config;
