<script lang="ts">
	import { ProgressBar } from '@skeletonlabs/skeleton'
	import endpoints from '../state/endpoints.svelte'
	import { initTransformers, getTransformersModule } from '../util/transformersInit'

	let isLoading = $state(false)
	let error = $state('')
	let fileProgress = $state<Map<string, { loaded: number; total: number; percentage: number }>>(
		new Map(),
	)

	async function downloadModel(modelId: string) {
		try {
			isLoading = true
			error = ''
			fileProgress = new Map()

			// Update progress
			await endpoints.updateLocalModelProgress(modelId, 0)

			// Get the dtype for this model
			const localModel = endpoints.value.localModels.find((m) => m.id === modelId)
			const dtype = localModel?.dtype

			// Check for ONNX models and provide better error handling
			if (modelId.includes('onnx-community')) {
				error = 'ONNX models may have compatibility issues in this browser. Try a different model.'
				await endpoints.updateLocalModelProgress(modelId, 0, false)
				return
			}

			// Initialize shared transformers configuration
			const transformersModule = await initTransformers()

			// Start download - this will download and cache the model
			const model = await transformersModule.pipeline('text-generation', modelId, {
				dtype: dtype,
				progress_callback: (progress: any) => {
					if (progress.file && progress.progress !== undefined) {
						const percentage = Math.round(progress.progress * 100)
						const fileName = progress.file.split('/').pop() || progress.file

						// Update individual file progress
						fileProgress.set(progress.file, {
							loaded: progress.loaded || 0,
							total: progress.total || 0,
							percentage: percentage,
						})

						// Calculate overall progress across all files
						const overallProgress = calculateOverallProgress(fileProgress)
						const overallPercentage = Math.round(overallProgress)

						// Only log every 5% or when file changes
						const shouldLog =
							percentage >= (fileProgress.get(progress.file)?.percentage || 0) + 5 ||
							percentage === 100

						if (shouldLog) {
							console.log(`Download progress: ${overallPercentage}% - ${fileName} (${percentage}%)`)
							endpoints.updateLocalModelProgress(modelId, overallPercentage)
						}
					}
				},
			})

			// Mark as downloaded
			await endpoints.markLocalModelDownloaded(modelId)
			console.log(`Model ${modelId} downloaded and ready to use`)
		} catch (err) {
			console.error(`Failed to download model ${modelId}:`, err)

			// Provide specific error messages for common issues
			let errorMessage = 'Unknown error'
			if (err instanceof Error) {
				if (err.message.includes('QuotaExceededError') || err.message.includes('quota')) {
					errorMessage =
						'Browser storage quota exceeded. Try clearing browser storage or using a smaller model.'
				} else if (err.message.includes('Aborted') || err.message.includes('memory')) {
					errorMessage =
						'Memory/performance issue. This model may be too large for your browser. Try using a smaller model or closing other tabs.'
				} else if (err.message.includes('Could not locate file') && err.message.includes('onnx')) {
					errorMessage =
						'ONNX model files not found. This model may not have browser-compatible files available. Try a different model or contact the model provider.'
				} else if (err.message.includes('ONNX') || err.message.includes('onnxruntime')) {
					errorMessage = 'ONNX compatibility issue. Try using a non-ONNX model instead.'
				} else if (err.message.includes('RuntimeError') && err.message.includes('Aborted')) {
					errorMessage =
						'Model loading failed due to memory constraints. This model may be too large for your browser. Try using a smaller model (SmolLM2 135M or GPT-2) or clear browser storage.'
				} else if (err.message.includes('Failed to execute') && err.message.includes('Cache')) {
					errorMessage =
						'Browser cache storage failed. Try clearing browser storage or using a smaller model.'
				} else {
					errorMessage = err.message
				}
			}

			error = `Failed to download model: ${errorMessage}`
			// Reset progress on error
			await endpoints.updateLocalModelProgress(modelId, 0, false)
			fileProgress = new Map()
		} finally {
			isLoading = false
		}
	}

	function calculateOverallProgress(
		fileProgress: Map<string, { loaded: number; total: number; percentage: number }>,
	): number {
		if (fileProgress.size === 0) return 0

		let totalLoaded = 0
		let totalSize = 0

		for (const { loaded, total } of fileProgress.values()) {
			totalLoaded += loaded
			totalSize += total
		}

		return totalSize > 0 ? (totalLoaded / totalSize) * 100 : 0
	}

	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 B'
		const k = 1024
		const sizes = ['B', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
	}

	async function useLocalModel(localModel: (typeof endpoints.value.localModels)[0]) {
		try {
			await endpoints.addLocalEndpoint(localModel)
			console.log(`Local endpoint created for ${localModel.name}`)
		} catch (err) {
			console.error('Failed to create local endpoint:', err)
			error = 'Failed to create local endpoint'
		}
	}

	async function clearBrowserStorage() {
		try {
			// Clear various browser storage
			if ('caches' in window) {
				const cacheNames = await caches.keys()
				await Promise.all(cacheNames.map((name) => caches.delete(name)))
			}
			if ('localStorage' in window) {
				localStorage.clear()
			}
			if ('sessionStorage' in window) {
				sessionStorage.clear()
			}
			console.log('Browser storage cleared successfully')
			error = 'Browser storage cleared. You can now try downloading models again.'
		} catch (err) {
			console.error('Failed to clear browser storage:', err)
			error = 'Failed to clear browser storage. Please clear it manually in your browser settings.'
		}
	}
</script>

<div class="space-y-4">
	<h3 class="text-lg font-semibold">Local LLM Models</h3>
	<p class="text-sm text-surface-500">
		Download and run language models locally in your browser. Models will be cached for offline use.
	</p>

	{#if error}
		<div class="alert variant-soft-error">
			<span>{error}</span>
			{#if error.includes('quota') || error.includes('storage')}
				<button class="variant-filled-secondary btn btn-sm mt-2" onclick={clearBrowserStorage}>
					Clear Browser Storage
				</button>
			{/if}
		</div>
	{/if}
	{#each endpoints.value.localModels as model (model.id)}
		<div class="card variant-soft-surface space-y-3 p-4">
			<div class="flex items-start justify-between">
				<div class="flex-1">
					<h4 class="font-semibold">{model.name}</h4>
					<p class="text-sm text-surface-600">{model.description}</p>
					<p class="text-xs text-surface-500">Size: {model.size}</p>
					{#if model.dtype}
						<p class="text-xs text-surface-500">Precision: {model.dtype}</p>
					{/if}
					{#if model.id === 'Xenova/Phi-3-mini-4k-instruct'}
						<p class="text-xs font-medium text-amber-600">
							⚠️ Large model - may exceed browser memory limits
						</p>
					{/if}
				</div>
				<div class="flex items-center gap-2">
					{#if model.downloaded}
						<span class="variant-soft-success badge">Downloaded</span>
						<button
							class="variant-filled-primary btn btn-sm"
							onclick={() => useLocalModel(model)}
							disabled={isLoading}
						>
							Use Model
						</button>
					{:else}
						<button
							class="variant-filled-primary btn btn-sm"
							onclick={() => downloadModel(model.id)}
							disabled={isLoading}
						>
							{isLoading ? 'Downloading...' : 'Download'}
						</button>
					{/if}
				</div>
			</div>

			{#if model.downloadProgress !== undefined && model.downloadProgress > 0 && model.downloadProgress < 100}
				<div class="space-y-2">
					<div class="text-xs font-medium text-surface-600">
						Overall Progress: {model.downloadProgress}%
					</div>
					<ProgressBar value={model.downloadProgress} max={100} class="w-full" />

					{#if fileProgress.size > 0}
						<div class="mt-3 space-y-2">
							<div class="text-xs font-medium text-surface-600">Individual Files:</div>
							{#each Array.from(fileProgress.entries()) as [filePath, progress]}
								<div class="space-y-1">
									<div class="flex justify-between text-xs text-surface-600">
										<span class="max-w-[200px] truncate" title={filePath}>
											{filePath.split('/').pop()}
										</span>
										<span
											>{progress.percentage}% ({formatFileSize(progress.loaded)} / {formatFileSize(
												progress.total,
											)})</span
										>
									</div>
									<ProgressBar value={progress.percentage} max={100} class="h-2 w-full" />
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/each}

	<div class="space-y-1 text-xs text-surface-500">
		<p>
			<strong>Note:</strong> Local models require significant storage and may impact browser performance.
		</p>
		<p>Models are downloaded from Hugging Face and cached locally in your browser.</p>
		<p>
			<strong>Recommended Models:</strong> For best compatibility, try SmolLM2 135M or GPT-2 first. Larger
			models like Phi-3 Mini may exceed browser memory limits.
		</p>
		<p>
			<strong>Troubleshooting:</strong> If you encounter storage or memory errors, try:
		</p>
		<ul class="ml-2 list-inside list-disc space-y-1">
			<li>Clear browser storage using the button above</li>
			<li>Close other browser tabs to free memory</li>
			<li>Try smaller models (SmolLM2 135M, GPT-2)</li>
			<li>Use models with int8 or fp32 precision for better compatibility</li>
		</ul>
	</div>
</div>
