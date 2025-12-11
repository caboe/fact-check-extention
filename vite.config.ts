// vite.config.ts
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

export default defineConfig({
	plugins: [svelte()],
	publicDir: 'public', // Stellen Sie sicher, dass dies auf 'public' gesetzt ist
	build: {
		outDir: 'dist',
		cssCodeSplit: true, // Aktivieren des CSS-Code-Splitting
		rollupOptions: {
			input: {
				popup: path.resolve(__dirname, 'src/main.ts'), // Einstiegspunkt für Popup
				background: path.resolve(__dirname, 'src/background.ts'), // Hintergrund-Skript
				// content script is now built separately via vite.content.config.ts
				// Entfernen Sie 'manifest.json' aus den Eingängen
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
