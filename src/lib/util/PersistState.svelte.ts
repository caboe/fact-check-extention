type StorageBackend = chrome.storage.LocalStorageArea | Storage

function isChromeStorage(storage: StorageBackend): storage is chrome.storage.LocalStorageArea {
	return typeof (storage as chrome.storage.LocalStorageArea).get === 'function'
}

export class PersistState<T> {
	#value: T | null = $state(null)
	#key: string
	#storage: StorageBackend

	get value(): T {
		if (this.#value === null) {
			throw new Error('Value is not initialized')
		}
		return this.#value
	}

	set value(value: T) {
		this.#value = value
	}

	public ready: Promise<void>

	constructor(key: string, initialValue: T) {
		if (initialValue === null) {
			throw new Error('Initial value cannot be null')
		}
		this.#key = key
		if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
			this.#storage = chrome.storage.local
		} else {
			this.#storage = window.localStorage
		}
		this.#value = initialValue
		this.ready = this.#init(initialValue)
	}

	async #init(initialValue: T) {
		const persitedState = await this.#getUnitiedState()

		this.#value = persitedState ?? initialValue
		$effect.root(() => {
			$effect(() => {
				if (this.#value) {
					// Serialize directly in the effect body so that all nested
					// property reads go through the $state proxy synchronously,
					// establishing fine-grained reactive dependencies.
					// This avoids cross-browser differences (Chrome V8 vs Firefox
					// SpiderMonkey) with JSON.stringify inside async/Promise wrappers.
					const serialized = JSON.stringify(this.#value)
					this.#writeToStorage(serialized)
				} else {
					this.deleteUnifiedState()
				}
			})
		})
	}

	async deleteUnifiedState() {
		if (isChromeStorage(this.#storage)) {
			return new Promise<void>((resolve) => {
				this.#storage.remove(this.#key, () => resolve())
			})
		} else {
			this.#storage.removeItem(this.#key)
		}
	}

	async #getUnitiedState(): Promise<T> {
		if (isChromeStorage(this.#storage)) {
			return new Promise<T>((resolve) => {
				this.#storage.get(this.#key, (items: Record<string, string>) => {
					const rawState = items[this.#key]
					const state: T = rawState ? JSON.parse(rawState) : undefined
					resolve(state)
				})
			})
		} else {
			const item = this.#storage.getItem(this.#key)
			const state: T = item ? JSON.parse(item) : undefined
			return state
		}
	}

	/**
	 * Write a pre-serialized state string to storage.
	 * Uses the MV3 Promise-based API (no callback wrapper) for reliable
	 * persistence in both Chrome and Firefox.
	 */
	#writeToStorage(serialized: string): void {
		if (isChromeStorage(this.#storage)) {
			this.#storage.set({ [this.#key]: serialized })
		} else {
			this.#storage.setItem(this.#key, serialized)
		}
	}
}
