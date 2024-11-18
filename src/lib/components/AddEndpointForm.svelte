<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Endpoint } from './Endpoints.svelte';
	import L from './L.svelte';
	const dispatch = createEventDispatcher();

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
		<span>{L.title()}</span>
		<input class="input" id="title" bind:value={title} placeholder={L.titelPlaceholder()} />
	</label>
	<label class="label mb-2" for="url">
		<span>{L.url()}</span>
		<input class="input" id="url" bind:value={url} placeholder={L.urlPlaceholder()} />
	</label>
	<label class="label mb-2" for="apiKey">
		<span>{L.apiKey()}</span>
		<input
			class="input"
			id="apiKey"
			bind:value={apiKey}
			type="password"
			placeholder={L.apiKeyPlaceholder()}
		/>
	</label>
	<div class="mt-4 flex justify-between">
		<button class="variant-filled-warning btn" onclick={cancel}>{L.cancel()}</button>
		<button class="variant-filled-success btn" onclick={add}>{L.add()}</button>
	</div>
</div>
