// src/main.ts
import Popup from './lib/components/Popup.svelte'
import { mount } from 'svelte'

const app = mount(Popup, {
	target: document.body,
})

export default app
