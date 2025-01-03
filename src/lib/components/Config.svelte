<script lang="ts">
	import endpoints from '../state/endpoints.svelte'
	import L from '../state/L.svelte'
	import view from '../state/view.svelte'
	import AddEndpointForm from './AddEndpointForm.svelte'
	import EndpointList from './EndpointList.svelte'
	import CloseIcon from './icons/CloseIcon.svelte'

	function deleteEndpoint(title: string) {
		endpoints.delete(title)
		view.showAddEndpointForm = false
	}
</script>

<div class="mx-1 p-3">
	<div class="mb-4 flex items-center justify-between">
		<div class="text-md font-bold">{L.apiEndpoint()}</div>
		<CloseIcon />
	</div>
	<EndpointList on:delete={(event: CustomEvent<string>) => deleteEndpoint(event.detail)} />
	{#if view.showAddEndpointForm}
		<AddEndpointForm />
	{:else if !view.showEditEndpointForm}
		<button
			class="variant-filled-success btn w-full"
			onclick={() => (view.showAddEndpointForm = true)}
		>
			{L.newEndpoint()}
		</button>
	{/if}
</div>
