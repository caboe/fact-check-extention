import { PersistState } from '../util/unifiedState.svelte'

export interface Endpoint {
	title: string
	url: string
	apiKey: string
	model: string
}

class Endpoints extends PersistState<{
	selected: Endpoint | null
	endpoints: Endpoint[]
	lastUsed: string | undefined
}> {
	constructor() {
		super('endpoints', { selected: null, endpoints: [], lastUsed: undefined })
		console.log('endpoints', this.value.selected)

		this.load()
	}

	async load() {
		if (this.value.endpoints.length > 0) {
			const lastUsedTitle = this.value.lastUsed
			this.value.selected =
				this.value.endpoints.find((endpoint) => endpoint.title === lastUsedTitle) ||
				this.value.endpoints[0]
		}
	}

	async add(newEndpoint: Endpoint) {
		this.value.endpoints.push(newEndpoint)
		this.value.selected = newEndpoint
	}

	async delete(title: string) {
		await localStorage.delete(title)
	}

	async edit(originalTitle: string, updatedEndpoint: Endpoint) {
		await localStorage.edit(originalTitle, updatedEndpoint)

		// Update selected endpoint if it was edited
		if (this.value.selected?.title === originalTitle) {
			this.value.selected = updatedEndpoint
		}
	}
}

const endpoints = new Endpoints()

export default endpoints
