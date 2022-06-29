import dts from 'rollup-plugin-dts';

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
	input: ['three/index.d.ts', 'p5/global.d.ts'],
	output: { dir: 'dist' },
	plugins: [dts()]
};
export default config;
