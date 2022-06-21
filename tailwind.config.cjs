/** @type {import('tailwindcss').Config} */
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			backgroundColor: {
				primary: '#454344',
				secondary: '#363434'
			},
			textColor: {
				text: {
					primary: '#FBF6F2'
				}
			},
			fontFamily: {
				serif: ['Prata', 'serif'],
				sans: ['Noto Sans', 'sans-serif']
			}
		}
	},

	plugins: []
};

module.exports = config;
