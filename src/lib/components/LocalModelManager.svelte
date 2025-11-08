<script lang="ts">
	import { ProgressBar } from '@skeletonlabs/skeleton'
	import endpoints from '../state/endpoints.svelte'
	import { initTransformers, getTransformersModule } from '../util/transformersInit'

	let isLoading = $state(false)
	let error = $state('')

	async function downloadModel(modelId: string) {
		try {
			isLoading = true
			error = ''

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
			// Use the same cache directory and configuration as the chat requests
			const model = await transformersModule.pipeline('text-generation', modelId, {
				dtype: dtype,
				progress_callback: (progress: any) => {
					console.log('Download progress:', progress)
					if (progress.progress !== undefined) {
						const percentage = Math.round(progress.progress)
						endpoints.updateLocalModelProgress(modelId, percentage)
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
						'Memory/performance issue. Try using a smaller model or closing other tabs.'
				} else if (err.message.includes('ONNX') || err.message.includes('onnxruntime')) {
					errorMessage = 'ONNX compatibility issue. Try using a non-ONNX model instead.'
				} else {
					errorMessage = err.message
				}
			}

			error = `Failed to download model: ${errorMessage}`
			// Reset progress on error
			await endpoints.updateLocalModelProgress(modelId, 0, false)
		} finally {
			isLoading = false
		}
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
</script>

<div class="space-y-4">
	<h3 class="text-lg font-semibold">Local LLM Models</h3>
	<p class="text-sm text-surface-500">
		Download and run language models locally in your browser. Models will be cached for offline use.
	</p>

	{#if error}
		<div class="alert variant-soft-error">
			<span>{error}</span>
		</div>
	{/if}
	{#each endpoints.value.localModels as model (model.id)}
		<div class="card variant-soft-surface space-y-3 p-4">
			<div class="flex items-start justify-between">
				<div class="flex-1">
					<h4 class="font-semibold">{model.name}</h4>
					<p class="text-sm text-surface-600">{model.description}</p>
					<p class="text-xs text-surface-500">Size: {model.size}</p>
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
				<div class="space-y-1">
					<div class="text-xs text-surface-600">
						Downloading... {model.downloadProgress}%
					</div>
					<ProgressBar value={model.downloadProgress} max={100} class="w-full" />
				</div>
			{/if}
		</div>
	{/each}

	<div class="space-y-1 text-xs text-surface-500">
		<p>
			<strong>Note:</strong> Local models require significant storage and may impact browser performance.
		</p>
		<p>Models are downloaded from Hugging Face and cached locally in your browser.</p>
	</div>
</div>
