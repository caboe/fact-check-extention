<script lang="ts">
	import endpoints from '../state/endpoints.svelte'
	import RemoveIcon from './icons/RemoveIcon.svelte'
	import L from '../state/L.svelte'

	function confirmDelete(title: string) {
		if (confirm(`Möchten Sie den Endpunkt "${title}" wirklich löschen?`)) {
			endpoints.delete(title)
		}
	}
</script>

{#if endpoints.value.length === 0}
	<p class="text-center text-base font-bold">{L.noConfiguredEndpoints()}</p>
{:else}
	<p class="text-center text-base font-bold">
		{L.configuredEndpoints()}: {endpoints.value.length}
	</p>
	<ul class="my-4 flex list-none flex-col gap-1 p-0">
		{#each endpoints.value as endpoint}
			<li class="endpoint-item align-center flex justify-between gap-2">
				<span>{endpoint.title}</span>
				<RemoveIcon onclick={() => confirmDelete(endpoint.title)} />
			</li>
		{/each}
	</ul>
{/if}
