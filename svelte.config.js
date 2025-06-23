import adapter from 'sveltekit-adapter-chrome-extension'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

const config = {
	preprocess: [vitePreprocess({})],

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: false,
			manifest: 'manifest.json',
		}),
		appDir: 'app',
	},
}

export default config
