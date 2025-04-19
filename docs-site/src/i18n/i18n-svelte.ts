import { readable, writable, get } from 'svelte/store';
import type { TranslationFunctions, Locales } from './i18n-types';
import { i18nObject, baseLocale, locales as allLocales } from './i18n-util';

// Create a writable Svelte store for the locale, initialized with the base locale
export const locale = writable<Locales>(baseLocale);

// Create a function to set the locale, which updates the Svelte store
export const setLocale = (l: Locales) => {
	locale.set(l);
};

// Create a readable store for the translation functions
export const L = readable<TranslationFunctions>(i18nObject(get(locale)), (set) => {
	const unsubscribe = locale.subscribe(($locale) => {
		set(i18nObject($locale));
	});

	return unsubscribe;
});

// Export the list of all locales
export const locales = allLocales;

// Note: loading, loadLocale, loadAllLocales are not directly available as Svelte stores/functions
// in this manual setup based on the current i18n-util.ts structure.
// If needed, you might need to modify i18n-util.ts or implement similar logic here.
