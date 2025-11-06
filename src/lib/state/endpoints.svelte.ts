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
	constructor() {
		super('endpoints', {
			selected: null,
			list: [],
			lastUsed: undefined,
			localModels: [
				{
					id: 'Xenova/phi-2',
					name: 'Phi-2 (Small)',
					description: 'Microsoft Phi-2 model - Good for text analysis',
					size: '1.7GB',
					downloaded: false,
				},
				{
					id: 'Xenova/phi-1_5',
					name: 'Phi-1.5 (Tiny)',
					description: 'Microsoft Phi-1.5 model - Smaller version',
					size: '800MB',
					downloaded: false,
				},
				{
					id: 'Xenova/gemma-2b',
					name: 'Gemma 2B',
					description: 'Google Gemma 2B model',
					size: '1.9GB',
					downloaded: false,
				},
				{
					id: 'Xenova/llama-2-7b',
					name: 'Llama 2 7B',
					description: 'Meta Llama 2 7B model',
					size: '3.8GB',
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
