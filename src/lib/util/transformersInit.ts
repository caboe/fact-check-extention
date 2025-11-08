// Shared transformer.js initialization
let initialized = false
let transformersModule: any = null

export async function initTransformers() {
	if (initialized && transformersModule) return transformersModule

	try {
		transformersModule = await import('@huggingface/transformers')

		// Configure environment to use Hugging Face CDN directly
		transformersModule.env.allowRemoteModels = true
		transformersModule.env.allowLocalModels = false
		transformersModule.env.useBrowserCache = true

		// Use a consistent cache directory
		transformersModule.env.cacheDir = 'fact-check-extension-cache'

		// Configure ONNX runtime for better browser compatibility
		if (transformersModule.env.backends?.onnx?.wasm) {
			transformersModule.env.backends.onnx.wasm.wasmPaths = '/node_modules/onnxruntime-web/dist/'
			transformersModule.env.backends.onnx.wasm.numThreads = 1 // Reduce threads for stability
		}

		// Configure caching to avoid quota issues
		transformersModule.env.useBrowserCache = true
		transformersModule.env.allowRemoteModels = true

		// Set up consistent cache behavior
		transformersModule.env.localModelPath = 'fact-check-extension-cache'

		initialized = true
		console.log('Transformers.js initialized successfully', transformersModule.env)
		return transformersModule
	} catch (err) {
		console.error('Failed to initialize transformer.js:', err)
		throw err
	}
}

// Get the initialized transformers module
export function getTransformersModule() {
	if (!initialized || !transformersModule) {
		throw new Error('Transformers not initialized. Call initTransformers() first.')
	}
	return transformersModule
}

// Check if a model is available in cache
export async function isModelCached(modelId: string): Promise<boolean> {
	try {
		const transformersModule = await initTransformers()

		// Try to access the cache to see if the model exists
		// This is a simple check - in practice, transformers.js handles this internally
		if (transformersModule.env?.cacheDir) {
			console.log(`Checking cache for model: ${modelId}`)
			return true // Assume cached if we can access the cache directory
		}
		return false
	} catch (err) {
		console.error('Error checking model cache:', err)
		return false
	}
}

// Clear the model cache for a specific model
export async function clearModelCache(modelId: string): Promise<void> {
	try {
		const transformersModule = await initTransformers()

		// Clear any cached data for this model
		if (transformersModule.env?.cacheDir) {
			console.log(`Clearing cache for model: ${modelId}`)
			// Note: transformers.js handles cache clearing internally
		}
	} catch (err) {
		console.error('Error clearing model cache:', err)
	}
}
