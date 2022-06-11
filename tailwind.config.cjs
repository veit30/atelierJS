/** @type {import('tailwindcss').Config} */
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			backgroundColor: {
				primary: '#C0BCB1'
			}
		}
	},

	plugins: []
};

module.exports = config;
