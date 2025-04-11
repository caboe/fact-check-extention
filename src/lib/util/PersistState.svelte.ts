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
		this.#init(initialValue)
	}

	async #init(initialValue: T) {
		const persitedState = await this.#getUnitiedState()

		this.#value = persitedState ?? initialValue
		$effect.root(() => {
			$effect(() => {
				if (this.#value) {
					this.#setUnifiedState(this.#value)
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

	async #setUnifiedState(state: T): Promise<void> {
		if (isChromeStorage(this.#storage)) {
			return new Promise<void>((resolve) => {
				const serialized = JSON.stringify(state)
				this.#storage.set({ [this.#key]: serialized }, () => resolve())
			})
		} else {
			const serialized = JSON.stringify(state)
			this.#storage.setItem(this.#key, serialized)
		}
	}
}
