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
					id: 'Xenova/gpt2',
					name: 'GPT-2',
					description: 'OpenAI GPT-2 model for text generation',
					size: '500MB',
					downloaded: false,
				},
				{
					id: 'Xenova/distilbert-base-uncased',
					name: 'DistilBERT',
					description: 'DistilBERT for text classification and analysis',
					size: '250MB',
					downloaded: false,
				},
				{
					id: 'Xenova/bert-base-uncased',
					name: 'BERT Base',
					description: 'BERT base model for text understanding',
					size: '440MB',
					downloaded: false,
				},
				{
					id: 'Xenova/distilgpt2',
					name: 'DistilGPT-2',
					description: 'Smaller GPT-2 model for text generation',
					size: '320MB',
					downloaded: false,
				},
				{
					id: 'Xenova/t5-small',
					name: 'T5 Small',
					description: 'T5 model for text-to-text tasks',
					size: '240MB',
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
