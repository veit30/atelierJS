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
					resolveId(source, _importer, _options) {
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
						const file = files.get(id);
						if (!file) return null;

						if (id === '/main.js' && file)
							return {
								code: file,
								moduleSideEffects: 'no-treeshake'
							};
						return file;
					}
				}
			]
		});

		const {
			output: [{ code, map }]
		} = await build.generate({ format: 'es', sourcemap: true });
		return { error: null, code, map: map! };
	} catch (error) {
		return { error: error as Error, code: null, map: null };
	}
}
