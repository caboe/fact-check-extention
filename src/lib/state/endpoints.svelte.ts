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
				},
				{
					id: 'onnx-community/Phi-3.5-mini-instruct-onnx-web',
					name: 'Phi-3.5 Mini Instruct (ONNX)',
					description: 'Microsoft Phi-3.5 mini model optimized for instruction following',
					size: '2.3GB',
					downloaded: false,
				},
				{
					id: 'onnx-community/Qwen3-0.6B-ONNX',
					name: 'Qwen3 0.6B (ONNX)',
					description: 'Qwen 0.6B parameter model for text generation and reasoning',
					size: '1.2GB',
					downloaded: false,
				},
				{
					id: 'HuggingFaceTB/SmolLM2-135M-Instruct',
					name: 'SmolLM2 135M Instruct',
					description: 'SmolLM2 135M parameter model for instruction following',
					size: '145MB',
					downloaded: false,
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
			model: localModel.id,
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

	getDownloadedModels() {
		return this.value.localModels.filter((model) => model.downloaded)
	}

	getAvailableModels() {
		return this.value.localModels.filter((model) => !model.downloaded)
	}
}

const endpoints = new Endpoints()

export default endpoints
