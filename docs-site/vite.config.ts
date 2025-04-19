import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import path from 'path';

const config: UserConfig = {
	plugins: [tailwindcss(), sveltekit()],
	resolve: {
		alias: {
			$i18n: path.resolve('./src/i18n')
		}
	}
};

export default config;
