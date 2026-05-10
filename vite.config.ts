import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

const outDir = process.env.OUT_DIR || 'dist-chrome'

export default defineConfig({
	plugins: [svelte()],
	publicDir: 'public',
	build: {
		outDir,
		cssCodeSplit: true,
		rollupOptions: {
			input: {
				popup: path.resolve(__dirname, 'src/main.ts'),
			},
			output: {
				entryFileNames: '[name].js',
				chunkFileNames: '[name].js',
				assetFileNames: '[name][extname]',
			},
		},
	},
	server: {
		headers: {
			'Content-Security-Policy': "script-src 'self' 'unsafe-eval'; object-src 'self'",
		},
	},
})
