<script lang="ts">
	import endpoints, { type Endpoint } from './Endpoints.svelte';
	import L from './L.svelte';

	interface Props {
		showAddForm: boolean;
	}

	let { showAddForm = $bindable() }: Props = $props();

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
		if (endpoints.value.some((endpoint) => endpoint.title === title)) {
			alert(L.endpointExists());
			return;
		}
		if (title && url) {
			if (!apiKey && !confirm(L.saveAnyway())) return;
			const newEndpoint: Endpoint = { title, url, apiKey };
			endpoints.add(newEndpoint);
			title = '';
			url = '';
			apiKey = '';
			showAddForm = false;
		} else {
			alert(L.fieldsMissing());
		}
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
		<button class="variant-filled-warning btn" onclick={() => (showAddForm = false)}
			>{L.cancel()}</button
		>
		<button class="variant-filled-success btn" onclick={add}>{L.add()}</button>
	</div>
</div>
