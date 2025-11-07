// vite.config.ts
import { defineConfig, Plugin } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

// Custom plugin to prevent SPA fallback for model files
const noSpaFallbackForModels = (): Plugin => {
	return {
		name: 'no-spa-fallback-for-models',
		configureServer(server) {
			return () => {
				server.middlewares.use((req, res, next) => {
					const url = req.url || ''

					// Log all requests to see what patterns we need to catch
					console.log('[vite-middleware] Request:', url)

					// Check if this looks like a model file request
					// These are patterns that transformers.js uses
					const isModelFile =
						url.includes('/resolve/') || // HuggingFace model paths
						url.includes('/models/') || // Alternative HF path
						url.endsWith('.onnx') ||
						url.endsWith('.bin') ||
						url.endsWith('.safetensors') ||
						url.endsWith('.txt') ||
						url.endsWith('.json') ||
						url.includes('config.json') ||
						url.includes('tokenizer.json') ||
						url.includes('tokenizer_config.json') ||
						url.includes('vocab.json') ||
						url.includes('merges.txt') ||
						url.includes('special_tokens_map.json')

					// If it's a model file request, return 404 instead of HTML
					if (isModelFile) {
						console.log('[vite-middleware] Blocking model file request:', url)
						res.statusCode = 404
						res.setHeader('Content-Type', 'text/plain')
						res.end('Not found - model files should be fetched from HuggingFace CDN')
						return
					}

					next()
				})
			}
		},
	}
}
export default defineConfig({
	plugins: [svelte(), noSpaFallbackForModels()],
	publicDir: 'public', // Stellen Sie sicher, dass dies auf 'public' gesetzt ist
	server: {
		fs: {
			// Allow serving files from node_modules and transformers cache
			allow: ['..'],
		},
		headers: {
			'Cross-Origin-Embedder-Policy': 'require-corp',
			'Cross-Origin-Opener-Policy': 'same-origin',
		},
	},
	optimizeDeps: {
		exclude: ['@xenova/transformers'],
		include: ['onnxruntime-web'],
		esbuildOptions: {
			target: 'esnext',
		},
	},
	worker: {
		format: 'es',
	},
	assetsInclude: ['**/*.wasm', '**/*.onnx'],
	build: {
		target: 'esnext',
		outDir: 'dist',
		cssCodeSplit: true, // Aktivieren des CSS-Code-Splitting
		rollupOptions: {
			input: {
				popup: path.resolve(__dirname, 'src/main.ts'), // Einstiegspunkt für Popup
				background: path.resolve(__dirname, 'src/background.ts'), // Hintergrund-Skript
				content: path.resolve(__dirname, 'src/content.ts'), // Content-Skript
				// Entfernen Sie 'manifest.json' aus den Eingängen
			},
			output: {
				entryFileNames: '[name].js',
				chunkFileNames: '[name].js',
				assetFileNames: '[name][extname]',
			},
		},
	},
})
