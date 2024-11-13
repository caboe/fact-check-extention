<!-- src/components/Popup.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import state from '../../popupState.svelte';
	import Config from './Config.svelte';
	import FactCheck from './FactCheck.svelte';

	interface Endpoint {
		title: string;
		url: string;
		apiKey: string;
	}

	onMount(() => {
		chrome.storage.local.get('endpoints', (data: { endpoints?: Endpoint[] }) => {
			if (!data.endpoints || data.endpoints.length === 0) {
				state.showConfig = true;
			}
		});

		// Listener für Änderungen im Storage
		const storageListener = (
			changes: Record<string, chrome.storage.StorageChange>,
			area: string
		) => {
			if (area === 'local' && changes.endpoints) {
				if (!changes.endpoints.newValue || changes.endpoints.newValue.length === 0) {
					state.showConfig = true;
				}
			}
		};
		chrome.storage.onChanged.addListener(storageListener);

		return () => {
			chrome.storage.onChanged.removeListener(storageListener);
		};
	});
</script>

{#if state.showConfig}
	<Config />
{:else}
	<FactCheck />
{/if}
