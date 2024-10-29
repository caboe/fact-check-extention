<!-- src/components/Config.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import EndpointList from './EndpointList.svelte';
	import AddEndpointForm from './AddEndpointForm.svelte';

	interface Endpoint {
		title: string;
		url: string;
		apiKey: string;
	}

	let endpoints: Endpoint[] = [];
	let showAddForm: boolean = false;

	onMount(() => {
		chrome.storage.local.get('endpoints', (data: { endpoints?: Endpoint[] }) => {
			if (data.endpoints) {
				endpoints = data.endpoints;
			}
		});
	});

	function addEndpoint(newEndpoint: Endpoint) {
		endpoints = [...endpoints, newEndpoint];
		chrome.storage.local.set({ endpoints });
		showAddForm = false;
	}

	function deleteEndpoint(title: string) {
		endpoints = endpoints.filter((ep) => ep.title !== title);
		chrome.storage.local.set({ endpoints });
	}
</script>

<div class="w-[300px] rounded-lg bg-white p-4 shadow-md">
	<div class="mb-4">API Endpunkte</div>
	<EndpointList {endpoints} on:delete={(event) => deleteEndpoint(event.detail)} />
	{#if showAddForm}
		<AddEndpointForm
			on:add={(event) => addEndpoint(event.detail)}
			on:cancel={() => (showAddForm = false)}
		/>
	{:else}
		<button
			class="w-full rounded-md bg-blue-500 p-2 text-lg font-bold text-white hover:bg-blue-700"
			on:click={() => (showAddForm = true)}>+</button
		>
	{/if}
</div>
