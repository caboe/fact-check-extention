import forms from '@tailwindcss/forms';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}', './public/**/*.html'],
	theme: {
		extend: {}
	},

	plugins: [forms]
} as Config;
