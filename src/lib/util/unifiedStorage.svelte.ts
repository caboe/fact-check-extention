import { Endpoint } from '../state/endpoints.svelte'
import { Key } from './roles.svelte'

type StorageBackend = chrome.storage.LocalStorageArea | Storage

interface UnifiedState {
	endpoints: Endpoint[] | null
	lastUsed: string | null
	lastRoleKey: Key | null
}

// Wrapper für Chrome Storage und window.localStorage zur Vereinfachung von Tests
class UnifiedStorage {
	private storage: StorageBackend
	private readonly key = 'unifiedState'

	constructor() {
		if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
			this.storage = chrome.storage.local
		} else {
			this.storage = window.localStorage
		}
	}

	private async getUnifiedState(): Promise<UnifiedState> {
		if (this.isChromeStorage(this.storage)) {
			return new Promise<UnifiedState>((resolve) => {
				this.storage.get(this.key, (items: Record<string, string>) => {
					const rawState = items[this.key]
					const state: UnifiedState = rawState
						? JSON.parse(rawState)
						: { endpoints: null, lastUsed: null, lastRoleKey: null }
					resolve(state)
				})
			})
		} else {
			const item = this.storage.getItem(this.key)
			const state: UnifiedState = item
				? JSON.parse(item)
				: { endpoints: null, lastUsed: null, lastRoleKey: null }
			return state
		}
	}

	private async setUnifiedState(state: UnifiedState): Promise<void> {
		if (this.isChromeStorage(this.storage)) {
			return new Promise<void>((resolve) => {
				const serialized = JSON.stringify(state)
				this.storage.set({ [this.key]: serialized }, () => resolve())
			})
		} else {
			const serialized = JSON.stringify(state)
			this.storage.setItem(this.key, serialized)
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

	async setLastRoleKey(value: string): Promise<void> {
		const state = await this.getUnifiedState()
		state.lastRoleKey = value
		await this.setUnifiedState(state)
	}

	async getLastRoleKey(): Promise<string | null> {
		const state = await this.getUnifiedState()
		return state.lastRoleKey
	}
}

const unifiedStorage = new UnifiedStorage()

export default unifiedStorage
export const add = unifiedStorage.add.bind(unifiedStorage)
export const remove = unifiedStorage.delete.bind(unifiedStorage)
export const set = unifiedStorage.set.bind(unifiedStorage)
export const setLastUsed = unifiedStorage.setLastUsed.bind(unifiedStorage)
export const getLastUsed = unifiedStorage.getLastUsed.bind(unifiedStorage)
export const setLastRoleKey = unifiedStorage.setLastRoleKey.bind(unifiedStorage)
export const getLastRoleKey = unifiedStorage.getLastRoleKey.bind(unifiedStorage)
