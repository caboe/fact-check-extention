// src/main.ts
import { mount } from 'svelte';
import Popup from './lib/components/Popup.svelte';

const app = mount(Popup, {
	target: document.body
});

export default app;
