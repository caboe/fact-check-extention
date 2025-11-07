// Shared transformer.js initialization
let initialized = false

export async function initTransformers() {
	if (initialized) return

	try {
		const transformersModule = await import('@huggingface/transformers')

		// Configure environment to use Hugging Face CDN directly
		transformersModule.env.allowRemoteModels = true
		transformersModule.env.allowLocalModels = false
		transformersModule.env.useBrowserCache = true

		// Use a custom cache name to avoid conflicts
		transformersModule.env.cacheDir = '.transformers-cache'

		// Configure WASM paths - use local node_modules instead of CDN
		if (transformersModule.env.backends?.onnx?.wasm) {
			transformersModule.env.backends.onnx.wasm.wasmPaths = '/node_modules/onnxruntime-web/dist/'
		}

		initialized = true
		console.log('Transformers.js initialized successfully', transformersModule.env)
	} catch (err) {
		console.error('Failed to initialize transformer.js:', err)
		throw err
	}
}
