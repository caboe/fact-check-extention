<script lang="ts">
	import endpoints from '../state/endpoints.svelte'
	import L from '../state/L.svelte'
	import { ProgressBar } from '@skeletonlabs/skeleton'

	// Import transformer.js dynamically
	let transformer: any = null
	let isLoading = $state(false)
	let error = $state('')

	async function loadTransformer() {
		if (!transformer) {
			try {
				const { pipeline } = await import('@xenova/transformers')
				transformer = { pipeline }
				console.log('Transformer.js loaded successfully')
			} catch (err) {
				console.error('Failed to load transformer.js:', err)
				error = 'Failed to load transformer.js'
			}
		}
	}

	async function downloadModel(modelId: string) {
		if (!transformer) {
			await loadTransformer()
			if (!transformer) return
		}

		try {
			isLoading = true
			error = ''

			// Update progress
			await endpoints.updateLocalModelProgress(modelId, 0)

			// Start download - this will download and cache the model
			const model = await transformer.pipeline('text-generation', modelId, {
				progress_callback: (progress: any) => {
					console.log('Download progress:', progress)
					if (progress.progress !== undefined) {
						const percentage = Math.round(progress.progress * 100)
						endpoints.updateLocalModelProgress(modelId, percentage)
					}
				},
			})

			// Mark as downloaded
			await endpoints.markLocalModelDownloaded(modelId)
			console.log(`Model ${modelId} downloaded and ready to use`)
		} catch (err) {
			console.error(`Failed to download model ${modelId}:`, err)
			error = `Failed to download model: ${err instanceof Error ? err.message : 'Unknown error'}`
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

	// Load transformer.js on component mount
	loadTransformer()
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
	123{endpoints.value.localModels}
	{#each endpoints.value.localModels as model (model.id)}1
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
