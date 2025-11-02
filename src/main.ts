// src/main.ts
import { mount } from 'svelte'
import Popup from './lib/components/Popup.svelte'
import './app.css'

const app = mount(Popup, {
	target: document.getElementById('app') || document.body,
})

export default app
