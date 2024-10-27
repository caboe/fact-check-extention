<!-- src/components/Popup.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Config from './Config.svelte';
	import FactCheck from './FactCheck.svelte';
	import { writable } from 'svelte/store';

	interface Endpoint {
		title: string;
		url: string;
		apiKey: string;
	}

	const showConfig = writable<boolean>(false);

	onMount(() => {
		chrome.storage.local.get('endpoints', (data: { endpoints?: Endpoint[] }) => {
			if (!data.endpoints || data.endpoints.length === 0) {
				showConfig.set(true);
			}
		});

		// Listener für Änderungen im Storage
		const storageListener = (
			changes: Record<string, chrome.storage.StorageChange>,
			area: string
		) => {
			if (area === 'local' && changes.endpoints) {
				if (!changes.endpoints.newValue || changes.endpoints.newValue.length === 0) {
					showConfig.set(true);
				}
			}
		};
		chrome.storage.onChanged.addListener(storageListener);

		return () => {
			chrome.storage.onChanged.removeListener(storageListener);
		};
	});
</script>

{#if $showConfig}
	<Config />
{:else}
	<FactCheck />
{/if}
