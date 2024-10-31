<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import RemoveIcon from './icons/RemoveIcon.svelte';

	interface Props {
		endpoints?: { title: string }[];
	}

	let { endpoints = [] }: Props = $props();
	const dispatch = createEventDispatcher<{ delete: string }>();

	function confirmDelete(title: string) {
		if (confirm(`Möchten Sie den Endpunkt "${title}" wirklich löschen?`)) {
			dispatch('delete', title);
		}
	}
</script>

{#if endpoints.length === 0}
	<p class="text-center text-base font-bold">Keine Endpunkte hinzugefügt</p>
{:else}
	<p class="text-center text-base font-bold">Konfigurierte Endpunkte</p>
	<ul class="my-4 list-none p-0">
		{#each endpoints as endpoint}
			<li class="endpoint-item align-center flex justify-between gap-2">
				<span>{endpoint.title}</span>
				<RemoveIcon onclick={() => confirmDelete(endpoint.title)} />
			</li>
		{/each}
	</ul>
{/if}
