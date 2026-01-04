import { PersistState } from '../util/PersistState.svelte'

export interface RagEndpoint {
	title: string
	url: string
	apiKey: string
	mode: 'local' | 'global' | 'hybrid' | 'naive' | 'mix'
	top_k: number
}

class RagEndpoints extends PersistState<{
	list: RagEndpoint[]
}> {
	constructor() {
		super('ragEndpoints', { list: [] })
	}

	async add(newEndpoint: RagEndpoint) {
		await this.ready
		this.value.list.push(newEndpoint)
	}

	async delete(title: string) {
		await this.ready
		const others = this.value.list.filter((endpoint) => endpoint.title !== title)
		this.value.list = others
	}

	async edit(originalTitle: string, updatedEndpoint: RagEndpoint) {
		await this.ready
		this.value.list = this.value.list.map((endpoint) => {
			if (endpoint.title === originalTitle) {
				return updatedEndpoint
			}
			return endpoint
		})
	}

	exists(title: string) {
		return this.value.list.some((endpoint) => endpoint.title === title)
	}
}

const ragEndpoints = new RagEndpoints()

export default ragEndpoints
