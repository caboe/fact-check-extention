<script lang="ts">
	import ragEndpoints, { type RagEndpoint } from '../state/ragEndpoints.svelte'
	import RemoveIcon from './icons/RemoveIcon.svelte'
	import EditIcon from './icons/EditIcon.svelte'
	import CopyIcon from './icons/CopyIcon.svelte'
	import L from '../state/L.svelte'
	import EditRagEndpointForm from './EditRagEndpointForm.svelte'

	let editingEndpoint = $state<RagEndpoint | null>(null)
	let copyingEndpoint = $state<RagEndpoint | undefined>(undefined)
	let showAddForm = $state(false)

	function confirmDelete(title: string) {
		if (confirm(`Are you sure you want to delete RAG endpoint "${title}"?`)) {
			ragEndpoints.delete(title)
		}
	}

	function startEdit(endpoint: RagEndpoint) {
		editingEndpoint = { ...endpoint }
		showAddForm = false
	}

	function startCopy(endpoint: RagEndpoint) {
		copyingEndpoint = endpoint
		showAddForm = true
	}

	function closeEdit() {
		editingEndpoint = null
		copyingEndpoint = undefined
		showAddForm = false
	}
</script>

{#if editingEndpoint}
	<div class="mb-4">
		<EditRagEndpointForm endpoint={editingEndpoint} onsubmit={closeEdit} />
		<button onclick={closeEdit} class="variant-filled-error btn mt-2 w-full"> {L.cancel()} </button>
	</div>
{:else if showAddForm}
	<div class="mb-4">
		<EditRagEndpointForm initialData={copyingEndpoint} onsubmit={closeEdit} />
		<button onclick={closeEdit} class="variant-filled-error btn mt-2 w-full">
			{L.cancel()}
		</button>
	</div>
{:else}
	{#if ragEndpoints.value.list.length === 0}
		<p class="text-center text-base font-bold">{L.noRagEndpoints()}</p>
	{:else}
		<p class="text-center text-base font-bold">
			{L.ragEndpoints()}: {ragEndpoints.value.list.length}
		</p>
	{/if}

	<ul class="my-4 flex list-none flex-col gap-1 p-0">
		{#each ragEndpoints.value.list as endpoint}
			<li class="endpoint-item align-center flex justify-between gap-2">
				<span>{endpoint.title}</span>
				<div class="flex items-center gap-2">
					<CopyIcon onclick={() => startCopy(endpoint)} />
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

	<button class="variant-filled-primary btn w-full" onclick={() => (showAddForm = true)}>
		{L.addRagEndpoint()}
	</button>
{/if}
