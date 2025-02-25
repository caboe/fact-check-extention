import { Endpoint } from '../state/endpoints.svelte'
import { ITone } from './tone.svelte'

type StorageBackend = chrome.storage.LocalStorageArea | Storage

interface UnifiedState {
	endpoints: Endpoint[] | null
	lastUsed: string | null
	tone: ITone | null
	hasSeenIntroduction: boolean
	selectedContent: string | null
	result: any | null
}

const emptyUnifiedState: UnifiedState = {
	endpoints: null,
	lastUsed: null,
	tone: null,
	hasSeenIntroduction: false,
	selectedContent: null,
	result: null,
}

// Wrapper für Chrome Storage und window.localStorage zur Vereinfachung von Tests
class UnifiedStorage {
	#storage: StorageBackend
	readonly #key = 'unifiedState'

	constructor() {
		if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
			this.#storage = chrome.storage.local
		} else {
			this.#storage = window.localStorage
		}
	}

	private async getUnifiedState(): Promise<UnifiedState> {
		if (this.isChromeStorage(this.#storage)) {
			return new Promise<UnifiedState>((resolve) => {
				this.#storage.get(this.#key, (items: Record<string, string>) => {
					const rawState = items[this.#key]
					const state: UnifiedState = rawState ? JSON.parse(rawState) : emptyUnifiedState
					resolve(state)
				})
			})
		} else {
			const item = this.#storage.getItem(this.#key)
			const state: UnifiedState = item ? JSON.parse(item) : emptyUnifiedState
			return state
		}
	}

	private async setUnifiedState(state: UnifiedState): Promise<void> {
		if (this.isChromeStorage(this.#storage)) {
			return new Promise<void>((resolve) => {
				const serialized = JSON.stringify(state)
				this.#storage.set({ [this.#key]: serialized }, () => resolve())
			})
		} else {
			const serialized = JSON.stringify(state)
			this.#storage.setItem(this.#key, serialized)
		}
	}

	private isChromeStorage(storage: StorageBackend): storage is chrome.storage.LocalStorageArea {
		return typeof (storage as chrome.storage.LocalStorageArea).get === 'function'
	}

	// Methoden für Endpoints
	async add(endpoint: Endpoint): Promise<void> {
		const state = await this.getUnifiedState()
		const endpoints = state.endpoints || []
		endpoints.push(endpoint)
		state.endpoints = endpoints
		await this.setUnifiedState(state)
	}

	async delete(endpointTitle: string): Promise<void> {
		const state = await this.getUnifiedState()
		const endpoints = state.endpoints || []
		const updatedEndpoints = endpoints.filter((e) => e.title !== endpointTitle)
		state.endpoints = updatedEndpoints.length > 0 ? updatedEndpoints : null
		await this.setUnifiedState(state)
	}

	async edit(originalTitle: string, updatedEndpoint: Endpoint): Promise<void> {
		const state = await this.getUnifiedState()
		const endpoints = state.endpoints || []
		const updatedEndpoints = endpoints.map((e) => (e.title === originalTitle ? updatedEndpoint : e))
		state.endpoints = updatedEndpoints
		await this.setUnifiedState(state)
	}

	async set(endpoints: Endpoint[]): Promise<void> {
		const state = await this.getUnifiedState()
		state.endpoints = endpoints
		await this.setUnifiedState(state)
	}

	async getEndpoints(): Promise<Endpoint[] | null> {
		const state = await this.getUnifiedState()
		return state.endpoints
	}

	async setLastUsed(value: string): Promise<void> {
		const state = await this.getUnifiedState()
		state.lastUsed = value
		await this.setUnifiedState(state)
	}

	async getLastUsed(): Promise<string | null> {
		const state = await this.getUnifiedState()
		return state.lastUsed
	}

	async setTone(value: ITone): Promise<void> {
		const state = await this.getUnifiedState()
		state.tone = value
		await this.setUnifiedState(state)
	}

	async getTone(): Promise<ITone | null> {
		const state = await this.getUnifiedState()
		return state.tone
	}

	async setHasSeenIntroduction(): Promise<void> {
		const state = await this.getUnifiedState()
		state.hasSeenIntroduction = true
		await this.setUnifiedState(state)
	}

	async getHasSeenIntroduction(): Promise<boolean> {
		const state = await this.getUnifiedState()
		return !!state.hasSeenIntroduction
	}

	async setSelectedContent(value: string): Promise<void> {
		const state = await this.getUnifiedState()
		state.selectedContent = value
		await this.setUnifiedState(state)
	}

	async getSelectedContent(): Promise<string | null> {
		const state = await this.getUnifiedState()
		return state.selectedContent
	}

	async setResult(value: any): Promise<void> {
		const state = await this.getUnifiedState()
		state.result = value
		await this.setUnifiedState(state)
	}

	async getResult(): Promise<any | null> {
		const state = await this.getUnifiedState()
		return state.result
	}
}

const unifiedStorage = new UnifiedStorage()

export default unifiedStorage
export const add = unifiedStorage.add.bind(unifiedStorage)
export const remove = unifiedStorage.delete.bind(unifiedStorage)
export const set = unifiedStorage.set.bind(unifiedStorage)
export const setLastUsed = unifiedStorage.setLastUsed.bind(unifiedStorage)
export const getLastUsed = unifiedStorage.getLastUsed.bind(unifiedStorage)
export const setLastRoleKey = unifiedStorage.setTone.bind(unifiedStorage)
export const getLastRoleKey = unifiedStorage.getTone.bind(unifiedStorage)
export const setSelectedContent = unifiedStorage.setSelectedContent.bind(unifiedStorage)
export const getSelectedContent = unifiedStorage.getSelectedContent.bind(unifiedStorage)
export const setResult = unifiedStorage.setResult.bind(unifiedStorage)
export const getResult = unifiedStorage.getResult.bind(unifiedStorage)
export const setHasSeenIntroduction = unifiedStorage.setHasSeenIntroduction.bind(unifiedStorage)
export const getHasSeenIntroduction = unifiedStorage.getHasSeenIntroduction.bind(unifiedStorage)
