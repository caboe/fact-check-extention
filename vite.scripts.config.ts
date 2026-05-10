import { defineConfig } from 'vite'
import path from 'path'

const outDir = process.env.OUT_DIR || 'dist-chrome'
const entryName = process.env.SCRIPT_ENTRY || 'content'

const entries: Record<string, string> = {
	content: path.resolve(__dirname, 'src/content.ts'),
	background: path.resolve(__dirname, 'src/background.ts'),
}

const entry = entries[entryName]
if (!entry) {
	throw new Error(
		`Unknown SCRIPT_ENTRY: ${entryName}. Must be one of: ${Object.keys(entries).join(', ')}`,
	)
}

export default defineConfig({
	build: {
		outDir,
		emptyOutDir: false,
		rollupOptions: {
			input: {
				[entryName]: entry,
			},
			output: {
				format: 'iife',
				entryFileNames: '[name].js',
			},
		},
		target: ['chrome87', 'firefox102'],
	},
	publicDir: false,
})
