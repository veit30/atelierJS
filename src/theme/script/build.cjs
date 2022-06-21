/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const generate = require('./generateColors.cjs');
const THEME_DIR = path.join(__dirname, '..');

if (!fs.existsSync(THEME_DIR)) {
	fs.mkdirSync(THEME_DIR);
}

module.exports = async () => {
	const { appColors, editorColors } = await generate();

	// console.log(editorColors);

	return Promise.all([
		fs.promises.writeFile(
			path.join(THEME_DIR, 'atelierjs-dark.json'),
			JSON.stringify(editorColors, null, 4)
		)
	]);
};

if (require.main === module) {
	module.exports();
}
