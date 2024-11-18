function isStorageArea(
	store: chrome.storage.LocalStorageArea | Storage | null
): store is chrome.storage.LocalStorageArea {
	return !!store?.get;
}

function isStorage(store: chrome.storage.LocalStorageArea | Storage | null): store is Storage {
	if (!store) return false;
	return !isStorageArea(store);
}

class LocalStorage {
	#localStorage: chrome.storage.LocalStorageArea | Storage | null = $state(null);
	#hasChromeStorage = !!chrome?.storage?.local;
	#key = 'endpoints';

	constructor() {
		this.#localStorage = this.#hasChromeStorage ? chrome.storage.local : window.localStorage;
	}

	getValue() {
		if (isStorageArea(this.#localStorage)) return this.#localStorage.get(this.#key);
		if (isStorage(this.#localStorage)) return this.#localStorage.getItem(this.#key);
		throw new Error('Storage nor set or invalid type.');
	}

	setValue(data: unknown) {
		if (isStorageArea(this.#localStorage)) return this.#localStorage.set(this.#key, data);
		if (isStorage(this.#localStorage))
			return this.#localStorage.setItem(this.#key, JSON.stringify(data));
		throw new Error('Storage nor set or invalid type.');
	}

	delete() {
		if (isStorageArea(this.#localStorage)) this.#localStorage.delete(this.#key);
	}
}

const localStorage = new LocalStorage();

export default localStorage;
