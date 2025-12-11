import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
	build: {
		outDir: 'dist',
		emptyOutDir: false, // Don't wipe the dist folder, the main build does that
		rollupOptions: {
			input: {
				content: path.resolve(__dirname, 'src/content.ts'),
			},
			output: {
				format: 'iife', // Immediately Invoked Function Expression for content scripts
				entryFileNames: 'content.js',
				extend: true, // Optional: ensures global extension if needed, but not strictly required here
			},
		},
	},
	publicDir: false, // Don't copy public assets again
})
