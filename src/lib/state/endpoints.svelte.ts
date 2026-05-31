import { PersistState } from '../util/PersistState.svelte'

export interface Endpoint {
	title: string
	url: string
	apiKey: string
	model: string
	canProcessImages: boolean
	rolePlacement?: 'system' | 'inline'
}

class Endpoints extends PersistState<{
	selected: Endpoint | null
	list: Endpoint[]
	lastUsed: string | undefined
}> {
	constructor() {
		super('endpoints', { selected: null, list: [], lastUsed: undefined })
	}

	async add(newEndpoint: Endpoint) {
		await this.ready
		this.value.list.push(newEndpoint)
		this.value.selected = newEndpoint
	}

	async delete(title: string) {
		await this.ready
		const others = this.value.list.filter((endpoint) => endpoint.title !== title)
		this.value.list = others
		if (this.value.selected?.title === title) {
			this.value.selected = null
		}
		if (this.value.lastUsed === title) {
			this.value.lastUsed = undefined
		}
	}

	async edit(originalTitle: string, updatedEndpoint: Endpoint) {
		await this.ready
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
}

const endpoints = new Endpoints()

export default endpoints
