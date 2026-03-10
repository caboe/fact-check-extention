/// <reference types="chrome" />
import Popup from './lib/components/Popup.svelte'
import { mount, unmount } from 'svelte'

const app = mount(Popup, {
	target: document.body,
})

// Cleanup when popup closes (Firefox/Chrome extension popup lifecycle)
window.addEventListener('unload', () => {
	unmount(app)
})

export default app
