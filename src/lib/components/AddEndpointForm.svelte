<script lang="ts">
	import endpoints, { type Endpoint } from '../state/endpoints.svelte'
	import L from '../state/L.svelte'
	import view from '../state/view.svelte'

	let title: string = $state('')
	let url: string = $state('')
	let apiKey: string = $state('')
	let apiKeyInput: HTMLInputElement
	let selectedValue: string | undefined = $state(undefined)
	let model = $state('')

	type EndpointTemplate = Omit<Endpoint, 'apiKey'>
	type EndpointTemplateMap = Record<string, EndpointTemplate>

	const endpointTemplateMap: EndpointTemplateMap = {
		deepSeek: {
			title: 'DeepSeek',
			url: 'https://api.deepseek.com/chat/completions',
			model: 'deepseek-chat',
		},
		gemini: {
			title: 'Gemini',
			url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
			model: 'gemini-2.0-flash-exp',
		},
		openAi: {
			title: 'ChatGPT',
			url: 'https://api.openai.com/v1/chat/completions',
			model: 'gpt-4o-mini',
		},
		ollama: {
			title: 'Ollama',
			url: 'http://localhost:11434/api/chat',
			model: 'llama3.2:latest',
		},
	}

	function prefillFields() {
		if (!selectedValue) return
		if (selectedValue in endpointTemplateMap) {
			;({ title, url, model } = endpointTemplateMap[selectedValue])
			apiKeyInput.focus()
		}
		selectedValue = undefined
	}

	function add() {
		if (endpoints.value.some((endpoint) => endpoint.title === title)) {
			alert(L.endpointExists())
			return
		}
		if (title && url) {
			if (!apiKey && !confirm(L.saveAnyway())) return
			const newEndpoint: Endpoint = { title, url, apiKey, model }
			endpoints.add(newEndpoint)
			title = ''
			url = ''
			apiKey = ''
			view.showAddEndpointForm = false
			model = ''
		} else {
			alert(L.fieldsMissing())
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
	<label class="label mb-2" for="model">
		<span>Model</span>
		<input class="input" id="model" bind:value={model} />
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
		<button class="variant-filled-warning btn" onclick={() => (view.showAddEndpointForm = false)}
			>{L.cancel()}</button
		>
		<button class="variant-filled-success btn" onclick={add}>{L.add()}</button>
	</div>
</div>
