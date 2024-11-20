export interface Endpoint {
	title: string;
	url: string;
	apiKey: string;
}

type StorageBackend = chrome.storage.LocalStorageArea | Storage;

interface UnifiedState {
	endpoints: Endpoint[] | null;
}

// wrapper for chrome store browser stor to simplify testing
class UnifiedStorage {
	private storage: StorageBackend;
	private readonly key = 'endpoints';

	constructor() {
		if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
			this.storage = chrome.storage.local;
		} else {
			this.storage = window.localStorage;
		}
	}

	private async getUnifiedState(): Promise<UnifiedState> {
		if (this.isChromeStorage(this.storage)) {
			return new Promise<UnifiedState>((resolve) => {
				this.storage.get(this.key, (items: Record<string, string>) => {
					const rawEndpoints = items[this.key];
					const endpoints: Endpoint[] | null = rawEndpoints ? JSON.parse(rawEndpoints) : null;
					resolve({ endpoints });
				});
			});
		} else {
			const item = this.storage.getItem(this.key);
			const endpoints: Endpoint[] | null = item ? JSON.parse(item) : null;
			return { endpoints };
		}
	}

	private async setUnifiedState(state: UnifiedState): Promise<void> {
		if (this.isChromeStorage(this.storage)) {
			return new Promise<void>((resolve) => {
				const serialized = JSON.stringify(state.endpoints);
				this.storage.set({ [this.key]: serialized }, () => resolve());
			});
		} else {
			const serialized = JSON.stringify(state.endpoints);
			this.storage.setItem(this.key, serialized);
		}
	}

	private isChromeStorage(storage: StorageBackend): storage is chrome.storage.LocalStorageArea {
		return typeof (storage as chrome.storage.LocalStorageArea).get === 'function';
	}

	async add(endpoint: Endpoint): Promise<void> {
		const state = await this.getUnifiedState();
		const endpoints = state.endpoints || [];
		endpoints.push(endpoint);
		await this.setUnifiedState({ endpoints });
	}

	async delete(endpointTitle: string): Promise<void> {
		const state = await this.getUnifiedState();
		const endpoints = state.endpoints || [];
		const updatedEndpoints = endpoints.filter((e) => e.title !== endpointTitle);

		await this.setUnifiedState({
			endpoints: updatedEndpoints.length > 0 ? updatedEndpoints : null
		});
	}

	async set(endpoints: Endpoint[]): Promise<void> {
		await this.setUnifiedState({ endpoints });
	}

	async getEndpoints(): Promise<Endpoint[] | null> {
		const state = await this.getUnifiedState();
		return state.endpoints;
	}
}

const unifiedStorage = new UnifiedStorage();

export default unifiedStorage;
export const add = unifiedStorage.add.bind(unifiedStorage);
export const remove = unifiedStorage.delete.bind(unifiedStorage);
export const set = unifiedStorage.set.bind(unifiedStorage);
