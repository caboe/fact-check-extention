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

<div class="config-container">
	<h2>API Endpunkte</h2>
	<EndpointList {endpoints} on:delete={(event) => deleteEndpoint(event.detail)} />
	{#if showAddForm}
		<AddEndpointForm
			on:add={(event) => addEndpoint(event.detail)}
			on:cancel={() => (showAddForm = false)}
		/>
	{:else}
		<button class="add-button" on:click={() => (showAddForm = true)}>+</button>
	{/if}
</div>

<style>
	.config-container {
		padding: 10px;
		width: 300px;
	}
	.add-button {
		margin-top: 10px;
		width: 100%;
	}
	h2 {
		margin-bottom: 10px;
	}
</style>
