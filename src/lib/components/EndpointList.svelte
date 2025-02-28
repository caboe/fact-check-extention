<script lang="ts">
	import endpoints, { type Endpoint } from '../state/endpoints.svelte'
	import RemoveIcon from './icons/RemoveIcon.svelte'
	import EditIcon from './icons/EditIcon.svelte'
	import L from '../state/L.svelte'
	import EditEndpointForm from './EditEndpointForm.svelte'
	import view from '../state/view.svelte'

	let editingEndpoint = $state<Endpoint | null>(null)

	function confirmDelete(title: string) {
		if (confirm(`Möchten Sie den Endpunkt "${title}" wirklich löschen?`)) {
			endpoints.delete(title)
		}
	}

	function startEdit(endpoint: Endpoint) {
		view.showEditEndpointForm = true
		editingEndpoint = { ...endpoint }
	}

	function closeEdit() {
		view.showEditEndpointForm = false
		editingEndpoint = null
	}
</script>

{#if view.showEditEndpointForm}
	<div class="mb-4">
		<EditEndpointForm endpoint={editingEndpoint!} />
		<button onclick={closeEdit} class="variant-filled-error btn mt-2 w-full"> {L.cancel()} </button>
	</div>
{:else}
	{#if endpoints.value.endpoints.length === 0}
		<p class="text-center text-base font-bold">{L.noConfiguredEndpoints()}</p>
	{:else}
		<p class="text-center text-base font-bold">
			{L.configuredEndpoints()}: {endpoints.value.endpoints.length}
		</p>
	{/if}

	<ul class="my-4 flex list-none flex-col gap-1 p-0">
		{#each endpoints.value.endpoints as endpoint}
			<li class="endpoint-item align-center flex justify-between gap-2">
				<span>{endpoint.title}</span>
				<div class="flex gap-2">
					<EditIcon
						onclick={() => {
							startEdit(endpoint)
						}}
					/>
					<RemoveIcon onclick={() => confirmDelete(endpoint.title)} />
				</div>
			</li>
		{/each}
	</ul>
{/if}
