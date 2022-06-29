/* eslint-disable @typescript-eslint/no-var-requires */
const { readFile } = require('fs').promises;
const { join } = require('path');
const { DEFAULT_SCHEMA, load } = require('js-yaml');

const schema = DEFAULT_SCHEMA;
const convertSetting = (settings) => {
	let newSettings = {};
	for (let key of Object.keys(settings)) {
		if (key === 'foreground' || key === 'background') {
			let convertedHex = settings[key].replace('#', '').toUpperCase();
			newSettings[key] = convertedHex;
		} else {
			newSettings[key] = settings[key];
		}
	}
	return newSettings;
};

const mapTokenColorsToRules = (tc) => {
	if (Array.isArray(tc.scope)) {
		return tc.scope.map((sc) => {
			return {
				token: sc,
				...convertSetting(tc.settings)
			};
		});
	} else {
		return {
			token: tc.scope,
			...convertSetting(tc.settings)
		};
	}
};

module.exports = async () => {
	const yamlFile = await readFile(join(__dirname, '..', 'src', 'theme.yml'), 'utf-8');

	const colors = load(yamlFile, { schema });

	const editorTheme = colors.editorTheme;

	const editorColors = {
		base: editorTheme.type === 'dark' ? 'vs-dark' : 'vs',
		inherit: false,
		rules: editorTheme.tokenColors.map(mapTokenColorsToRules).flat(),
		colors: editorTheme.colors
	};

	const appColors = {};

	return {
		appColors,
		editorColors
	};
};
