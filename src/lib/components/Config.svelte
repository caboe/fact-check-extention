<script lang="ts">
	import AddEndpointForm from './AddEndpointForm.svelte';
	import EndpointList from './EndpointList.svelte';
	import endpoints from './Endpoints.svelte';
	import CloseIcon from './icons/CloseIcon.svelte';
	import L from './L.svelte';

	let showAddForm: boolean = $state(false);

	function deleteEndpoint(title: string) {
		endpoints.delete(title);
		showAddForm = false;
	}
</script>

<div class="mx-1 p-3">
	<div class="mb-4 flex items-center justify-between">
		<div class="text-md font-bold">{L.apiEndpoint()}</div>
		<CloseIcon />
	</div>
	<EndpointList on:delete={(event) => deleteEndpoint(event.detail)} />
	{#if showAddForm}
		<AddEndpointForm
			on:add={(event) => endpoints.add(event.detail)}
			on:cancel={() => (showAddForm = false)}
		/>
	{:else}
		<button class="variant-filled-success btn w-full" onclick={() => (showAddForm = true)}>
			{L.newEndpoint()}
		</button>
	{/if}
</div>
