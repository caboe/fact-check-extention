<!-- src/components/Config.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import AddEndpointForm from './AddEndpointForm.svelte';
	import EndpointList from './EndpointList.svelte';
	import CloseIcon from './icons/CloseIcon.svelte';

	interface Endpoint {
		title: string;
		url: string;
		apiKey: string;
	}

	let endpoints: Endpoint[] = $state([]);
	let showAddForm: boolean = $state(false);

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

<div class="mx-1 p-3">
	<div class="mb-4 flex items-center justify-between">
		<div class="text-md font-bold">API Endpunkte</div>
		<CloseIcon />
	</div>
	<EndpointList {endpoints} on:delete={(event) => deleteEndpoint(event.detail)} />
	{#if showAddForm}
		<AddEndpointForm
			on:add={(event) => addEndpoint(event.detail)}
			on:cancel={() => (showAddForm = false)}
		/>
	{:else}
		<button class="variant-filled-success btn w-full" onclick={() => (showAddForm = true)}
			>New Endpoint</button
		>
	{/if}
</div>
