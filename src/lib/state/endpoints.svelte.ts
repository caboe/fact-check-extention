import { PersistState } from '../util/PersistState.svelte'

export interface Endpoint {
	title: string
	url: string
	apiKey: string
	model: string
	canProcessImages: boolean
	isLocal?: boolean // New field to identify local models
	localModelId?: string // For storing the actual transformer.js model ID
}

export interface LocalModel {
	id: string
	name: string
	description: string
	size: string
	downloadUrl?: string
	downloaded: boolean
	downloadProgress?: number
	dtype?: 'auto' | 'fp32' | 'fp16' | 'q8' | 'int8' | 'uint8' | 'q4' | 'bnb4' | 'q4f16' // Data type for model precision
}

class Endpoints extends PersistState<{
	selected: Endpoint | null
	list: Endpoint[]
	lastUsed: string | undefined
	localModels: LocalModel[]
}> {
	selected: Endpoint | null = $state(null)
	list: Endpoint[] = $state([])
	lastUsed: string | undefined = $state(undefined)
	localModels: LocalModel[] = $state([])

	constructor() {
		super('local', {
			selected: null,
			list: [],
			lastUsed: undefined,
			localModels: [
				{
					id: 'HuggingFaceTB/SmolLM3-3B-Base',
					name: 'SmolLM3 3B Base',
					description: 'SmolLM3 3B parameter base model for text generation and understanding',
					size: '6.2GB',
					downloaded: false,
					dtype: 'int8',
				},
				{
					id: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B',
					name: 'DeepSeek R1 Distill Qwen 1.5B',
					description:
						'DeepSeek R1 Distill Qwen 1.5B parameter base model for text generation and understanding',
					size: '4.2GB',
					downloaded: false,
					dtype: 'fp16',
				},
				{
					id: 'Xenova/Phi-3-mini-4k-instruct',
					name: 'Phi-3 Mini 4K Instruct',
					description:
						'Microsoft Phi-3 mini model optimized for instruction following with 4K context',
					size: '2.3GB',
					downloaded: false,
					dtype: 'fp16',
				},
				{
					id: 'Xenova/gpt2',
					name: 'GPT-2',
					description: 'Classic GPT-2 model for text generation (smaller, more stable)',
					size: '548MB',
					downloaded: false,
					dtype: 'fp32',
				},
				{
					id: 'HuggingFaceTB/SmolLM2-135M-Instruct',
					name: 'SmolLM2 135M Instruct',
					description: 'SmolLM2 135M parameter model for instruction following',
					size: '145MB',
					downloaded: false,
					dtype: 'fp32',
				},
			],
		})

		this.load()
	}

	async load() {
		if (this.value.list.length > 0) {
			const lastUsedTitle = this.value.lastUsed
			this.value.selected =
				this.value.list.find((endpoint) => endpoint.title === lastUsedTitle) || this.value.list[0]
		}
	}

	async add(newEndpoint: Endpoint) {
		this.value.list.push(newEndpoint)
		this.value.selected = newEndpoint
	}

	async delete(title: string) {
		const others = this.value.list.filter((endpoint) => endpoint.title !== title)
		this.value.list = others
	}

	async edit(originalTitle: string, updatedEndpoint: Endpoint) {
		this.value.list = this.value.list.map((endpoint) => {
			if (endpoint.title === originalTitle) {
				return updatedEndpoint
			}
			return endpoint
		})

		// Update selected endpoint if it was edited
		if (this.value.selected?.title === originalTitle) {
			this.value.selected = updatedEndpoint
		}
	}

	// Local model management methods
	async addLocalEndpoint(localModel: LocalModel) {
		const endpoint: Endpoint = {
			title: `${localModel.name} (Local)`,
			url: 'local://transformer.js', // Special URL for local models
			apiKey: '', // No API key needed for local models
			model: localModel.dtype ? `${localModel.id}?dtype=${localModel.dtype}` : localModel.id,
			canProcessImages: false, // Local models don't support images yet
			isLocal: true,
			localModelId: localModel.id,
		}
		await this.add(endpoint)
	}

	async updateLocalModelProgress(modelId: string, progress: number, downloaded: boolean = false) {
		this.value.localModels = this.value.localModels.map((model) =>
			model.id === modelId ? { ...model, downloadProgress: progress, downloaded } : model,
		)
	}

	async markLocalModelDownloaded(modelId: string) {
		this.value.localModels = this.value.localModels.map((model) =>
			model.id === modelId ? { ...model, downloaded: true, downloadProgress: 100 } : model,
		)
	}

	// Verify if a model is actually downloaded and working
	async verifyModelDownload(modelId: string): Promise<boolean> {
		try {
			const model = this.value.localModels.find((m) => m.id === modelId)
			if (!model) return false

			// Check if the model was marked as downloaded
			if (!model.downloaded) return false

			// In a real implementation, you could verify the model files exist
			// For now, just return true if marked as downloaded
			console.log(`Verifying model ${modelId} is available`)
			return true
		} catch (err) {
			console.error('Error verifying model download:', err)
			return false
		}
	}

	getDownloadedModels() {
		return this.value.localModels.filter((model) => model.downloaded)
	}

	getAvailableModels() {
		return this.value.localModels.filter((model) => !model.downloaded)
	}
}

const endpoints = new Endpoints()

export default endpoints
