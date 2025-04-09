type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'factCheckExtensionTheme'

// Svelte 5 State for the theme
let currentThemeInternal: Theme = $state('light') // Default to light initially

// Helper function to apply theme to DOM - Exported for use in component
export function applyTheme(theme: Theme) {
	// This should only run in browser context where it's called from
	const root = document.documentElement

	if (theme === 'dark') {
		root.classList.add('dark')
	} else {
		root.classList.remove('dark')
	}
}

// Function to initialize theme from storage - To be called from component's onMount
export function initializeTheme() {
	// Check for browser environment here, where it's called
	if (typeof window !== 'undefined' && typeof chrome !== 'undefined' && chrome.storage?.sync) {
		chrome.storage.sync.get([THEME_STORAGE_KEY], (result) => {
			const storedTheme = result[THEME_STORAGE_KEY] as Theme | undefined
			const initialTheme: Theme = storedTheme ?? 'light' // Default to light
			currentThemeInternal = initialTheme
			// Initial application is handled by the effect in the component now
		})
	} else {
		// Apply default theme if storage is not available (e.g., testing environment)
		applyTheme(currentThemeInternal)
	}
}

// Function to save theme to storage - To be called from component's effect
export function saveThemeToStorage(theme: Theme) {
	if (typeof window !== 'undefined' && typeof chrome !== 'undefined' && chrome.storage?.sync) {
		chrome.storage.sync.set({ [THEME_STORAGE_KEY]: theme }, () => {
			if (chrome.runtime.lastError) {
				console.error('Error saving theme:', chrome.runtime.lastError)
			}
		})
	}
}

// Public interface for the theme state
// Public interface for the theme state
export const themeState = {
	get currentTheme(): Theme {
		return currentThemeInternal
	},
	set currentTheme(newTheme: Theme) {
		currentThemeInternal = newTheme
	},
	toggleTheme: () => {
		currentThemeInternal = currentThemeInternal === 'light' ? 'dark' : 'light'
	},
}
