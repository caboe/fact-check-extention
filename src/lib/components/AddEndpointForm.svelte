<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { type Endpoint } from './Endpoints.svelte';
	import L from './L.svelte';
	const dispatch = createEventDispatcher();

	let title: string = $state('');
	let url: string = $state('');
	let apiKey: string = $state('');
	let apiKeyInput: HTMLInputElement;
	let selectedValue: string | undefined = $state(undefined);

	type EndpointTemplate = Omit<Endpoint, 'apiKey'> & { keyRequred: boolean };
	type EndpointTemplateMap = Record<string, EndpointTemplate>;

	const endpointTemplateMap: EndpointTemplateMap = {
		chatGpt: {
			title: 'ChatGPT',
			url: 'https://api.openai.com/v1/chat/completions',
			keyRequred: true
		},
		ollama: {
			title: 'Ollama',
			url: 'http://localhost:11434/api/generate',
			keyRequred: false
		}
	};

	function prefillFields() {
		if (!selectedValue) return;
		if (selectedValue in endpointTemplateMap) {
			({ title, url } = endpointTemplateMap[selectedValue]);
			apiKeyInput.focus();
		}
		selectedValue = undefined;
	}

	function add() {
		if (title && url) {
			if (!apiKey && !confirm('Kein API Key angegeben, trotzdem API-Endpunkt speichern')) return;
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
	<p class="text-center text-base font-bold">{L.newEndpoint()}</p>
	<label class="label mb-2" for="template">
		<span>{L.chooseTemplate()}</span>
		<select class="select" onchange={prefillFields} bind:value={selectedValue} id="template">
			<option value={undefined}>{L.choose()}</option>
			{#each Object.entries(endpointTemplateMap) as [value, { title }]}
				<option {value}>{title}</option>
			{/each}
		</select>
	</label>
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
			bind:this={apiKeyInput}
			type="password"
			placeholder={L.apiKeyPlaceholder()}
		/>
	</label>
	<div class="mt-4 flex justify-between">
		<button class="variant-filled-warning btn" onclick={cancel}>{L.cancel()}</button>
		<button class="variant-filled-success btn" onclick={add}>{L.add()}</button>
	</div>
</div>
