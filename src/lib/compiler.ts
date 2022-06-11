import { rollup, type SourceMap } from 'rollup';

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

export async function run(files: Map<string, string>, treeshake = true): Promise<CompilerOutput> {
	try {
		const build = await rollup({
			input: '/main.js',
			treeshake,
			plugins: [
				{
					name: 'resolve',
					resolveId(source, importer, options) {
						if (source.startsWith('http')) {
							const url = new URL(source);
							if (url.origin !== window.location.origin) return false;
							return source;
						}
						if (files.has(source)) return source;
					},
					async load(id) {
						if (id.startsWith('http')) {
							const data = await fetch(id).then((res) => res.text());
							return data;
						}
						if (id === '/main.js')
							return {
								code: files.get(id),
								moduleSideEffects: 'no-treeshake'
							};
						return files.get(id);
					}
				}
			]
		});

		const {
			output: [{ code, map }]
		} = await build.generate({ format: 'es', sourcemap: true });
		return { error: null, code, map };
	} catch (error) {
		return { error, code: null, map: null };
	}
}
