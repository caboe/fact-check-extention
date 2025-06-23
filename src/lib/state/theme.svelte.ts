import { PersistState } from '../util/PersistState.svelte'

type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'factCheckExtensionTheme'

export const themeState = new PersistState<Theme>(
	THEME_STORAGE_KEY,
	window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
)

$effect.root(() => {
	$effect(() => {
		const root = document.documentElement

		if (themeState.value === 'dark') {
			root.classList.add('dark')
		} else {
			root.classList.remove('dark')
		}
	})
})

export function toggleTheme() {
	themeState.value = themeState.value === 'dark' ? 'light' : 'dark'
}
