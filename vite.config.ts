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
				background: path.resolve(__dirname, 'src/background.ts'),
				content: path.resolve(__dirname, 'src/content.ts'),
			},
			output: {
				entryFileNames: (chunkInfo) => {
					if (chunkInfo.name === 'content') {
						return 'content.js'
					}
					return '[name].js'
				},
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
