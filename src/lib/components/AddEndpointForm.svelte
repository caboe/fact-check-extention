<!-- src/components/AddEndpointForm.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	interface Endpoint {
		title: string;
		url: string;
		apiKey: string;
	}

	let title: string = $state('');
	let url: string = $state('');
	let apiKey: string = $state('');

	function add() {
		if (title && url && apiKey) {
			const newEndpoint: Endpoint = { title, url, apiKey };
			dispatch('add', newEndpoint);
			title = '';
			url = '';
			apiKey = '';
		} else {
			alert('Bitte alle Felder ausfüllen.');
		}
	}

	function cancel() {
		dispatch('cancel');
	}
</script>

<div>
	<div class="form-group">
		<label for="title">Titel</label>
		<input id="title" bind:value={title} placeholder="Beispiel: FactCheck API" />
	</div>
	<div class="form-group">
		<label for="url">URL</label>
		<input id="url" bind:value={url} placeholder="https://api.example.com/factcheck" />
	</div>
	<div class="form-group">
		<label for="apiKey">API Key</label>
		<input id="apiKey" bind:value={apiKey} type="password" placeholder="Ihr API-Schlüssel" />
	</div>
	<div class="buttons">
		<button onclick={cancel}>Abbrechen</button>
		<button onclick={add}>Hinzufügen</button>
	</div>
</div>

<style>
	.form-group {
		margin-bottom: 10px;
	}
	.form-group label {
		display: block;
		margin-bottom: 2px;
	}
	.form-group input {
		width: 100%;
		padding: 5px;
		box-sizing: border-box;
	}
	.buttons {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
	}
	.buttons button {
		padding: 5px 10px;
	}
</style>
