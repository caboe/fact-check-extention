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
	<p class="text-center text-base font-bold">Neuer Endpunkt</p>
	<label class="label mb-2" for="title">
		<span>Titel</span>
		<input class="input" id="title" bind:value={title} placeholder="Beispiel: FactCheck API" />
	</label>
	<label class="label mb-2" for="url">
		<span>URL</span>
		<input
			class="input"
			id="url"
			bind:value={url}
			placeholder="https://api.example.com/factcheck"
		/>
	</label>
	<label class="label mb-2" for="apiKey">
		<span>API Key</span>
		<input
			class="input"
			id="apiKey"
			bind:value={apiKey}
			type="password"
			placeholder="Ihr API-Schlüssel"
		/>
	</label>
	<div class="mt-4 flex justify-between">
		<button class="variant-filled-warning btn" onclick={cancel}>Abbrechen</button>
		<button class="variant-filled-success btn" onclick={add}>Hinzufügen</button>
	</div>
</div>
