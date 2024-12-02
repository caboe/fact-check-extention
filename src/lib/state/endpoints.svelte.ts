import localStorage from '../util/unifiedStorage.svelte'

export interface Endpoint {
	title: string
	url: string
	apiKey: string
	isStream: boolean
	model: string
}

class Endpoints {
	#value: Endpoint[] = $state([])
	#selected: Endpoint | null = $state(null)

	constructor() {
		this.load()
	}

	async load() {
		await this.#updateFromStore()

		if (this.#value.length > 0) {
			const lastUsedTitle = await localStorage.getLastUsed()
			this.#selected =
				this.#value.find((endpoint) => endpoint.title === lastUsedTitle) || this.#value[0]
		}
	}

	async #updateFromStore() {
		this.#value = (await localStorage.getEndpoints()) ?? []
	}

	async add(newEndpoint: Endpoint) {
		await localStorage.add(newEndpoint)
		await this.#updateFromStore()
	}

	async delete(title: string) {
		await localStorage.delete(title)
		await this.#updateFromStore()
	}

	get value() {
		return this.#value
	}

	set value(newValue: Endpoint[]) {
		this.#value = newValue
	}

	get selected() {
		return this.#selected
	}

	set selected(selected: Endpoint | null) {
		this.#selected = selected
	}
}

const endpoints = new Endpoints()

export default endpoints
