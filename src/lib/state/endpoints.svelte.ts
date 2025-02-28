import { PersistState } from '../util/unifiedState.svelte'

export interface Endpoint {
	title: string
	url: string
	apiKey: string
	model: string
}

class Endpoints extends PersistState<{
	selected: Endpoint | null
	list: Endpoint[]
	lastUsed: string | undefined
}> {
	constructor() {
		super('endpoints', { selected: null, list: [], lastUsed: undefined })

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
