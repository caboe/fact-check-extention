<!-- src/components/EndpointList.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let endpoints: { title: string }[] = [];
	const dispatch = createEventDispatcher<{ delete: string }>();

	function confirmDelete(title: string) {
		if (confirm(`Möchten Sie den Endpunkt "${title}" wirklich löschen?`)) {
			dispatch('delete', title);
		}
	}
</script>

<ul>
	{#each endpoints as endpoint}
		<li class="endpoint-item">
			<span>{endpoint.title}</span>
			<button class="delete-button" on:click={() => confirmDelete(endpoint.title)}>-</button>
		</li>
	{/each}
</ul>

<style>
	.endpoint-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 5px 0;
	}
	.delete-button {
		background: red;
		color: white;
		border: none;
		cursor: pointer;
		padding: 2px 5px;
		border-radius: 3px;
	}
	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}
</style>
