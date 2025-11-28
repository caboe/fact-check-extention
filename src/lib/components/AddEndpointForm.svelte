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
	let canProcessImages = $state(false)
	let isInlineRolePlacement = $state(false)

	type EndpointTemplate = Omit<Endpoint, 'apiKey' | 'canProcessImages'> & { apiKeyUrl?: string }
	type EndpointTemplateMap = Record<string, EndpointTemplate>

	const endpointTemplateMap: EndpointTemplateMap = {
		kimi: {
			title: 'Kimi',
			url: 'https://api.moonshot.ai/v1/chat/completions',
			model: 'kimi-k2-turbo-preview',
			apiKeyUrl: 'https://platform.moonshot.ai/console/api-keys',
		},
		lmstudio: {
			title: 'LM Studio Local',
			url: 'http://localhost:1234/v1/chat/completions',
			model: 'mimo-vl-7b-rl',
		},
		ollama: {
			title: 'Ollama',
			url: 'http://localhost:11434/api/chat',
			model: 'mistral-small',
		},
		miniMax: {
			title: 'MiniMax',
			url: 'https://api.minimax.io/v1/text/chatcompletion_v2',
			model: 'MiniMax-M2',
			apiKeyUrl: 'https://www.minimax.io/platform/document/',
		},
		deepSeek: {
			title: 'DeepSeek',
			url: 'https://api.deepseek.com/chat/completions',
			model: 'deepseek-chat',
			apiKeyUrl: 'https://platform.deepseek.com/api-keys',
		},
		mistral: {
			title: 'Mistral AI',
			url: 'https://api.mistral.ai/v1/chat/completions',
			model: 'magistral-medium-2509',
			apiKeyUrl: 'https://console.mistral.ai/api-keys',
		},
		qwen: {
			title: 'Qwen',
			url: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions',
			model: 'qwen-plus',
			apiKeyUrl: 'https://bailian.console.aliyun.com/?tab=apiKey',
		},
		gemini: {
			title: 'Gemini',
			url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
			model: 'gemini-2.5-flash',
			apiKeyUrl: 'https://aistudio.google.com/app/apikey',
		},
		openAi: {
			title: 'ChatGPT',
			url: 'https://api.openai.com/v1/chat/completions',
			model: 'gpt-5',
			apiKeyUrl: 'https://platform.openai.com/api-keys',
		},
		openRouter: {
			title: 'OpenRouter',
			url: 'https://openrouter.ai/api/v1/chat/completions',
			model: 'anthropic/claude-haiku-4.5',
			apiKeyUrl: 'https://openrouter.ai/keys',
		},
	}

	function prefillFields() {
		if (!selectedValue) return
		if (selectedValue in endpointTemplateMap) {
			;({ title, url, model } = endpointTemplateMap[selectedValue])
			;({ title, url, model } = endpointTemplateMap[selectedValue])
			apiKeyInput.focus()

			if (selectedValue === 'ollama' || selectedValue === 'lmstudio') {
				isInlineRolePlacement = true
			} else {
				isInlineRolePlacement = false
			}
		}
		// selectedValue = undefined
	}

	function add() {
		if (endpoints.value.list.some((endpoint) => endpoint.title === title)) {
			alert(L.endpointExists())
			return
		}
		if (title && url) {
			if (
				(!selectedValue || endpointTemplateMap[selectedValue]?.apiKeyUrl) &&
				!apiKey &&
				!confirm(L.saveAnyway())
			)
				return
			const newEndpoint: Endpoint = {
				title,
				url,
				apiKey,
				model,
				canProcessImages,
				rolePlacement: isInlineRolePlacement ? 'inline' : 'system',
			}
			endpoints.add(newEndpoint)
			view.showAddEndpointForm = false
			title = ''
			url = ''
			apiKey = ''
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
		<span class="flex items-center">
			{L.apiKey()}
			{#if selectedValue && endpointTemplateMap[selectedValue]?.apiKeyUrl}
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<a
					href={endpointTemplateMap[selectedValue].apiKeyUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="ml-2 text-blue-500 hover:text-blue-700"
					title="Get API Key"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
						/>
					</svg>
				</a>
			{/if}
		</span>
		<input
			class="input"
			id="apiKey"
			bind:value={apiKey}
			bind:this={apiKeyInput}
			type="password"
			placeholder={L.apiKeyPlaceholder()}
		/>
	</label>
	<label class="label mb-2 flex cursor-pointer items-center justify-between">
		<span>{L.canProcessImages()}</span>
		<input type="checkbox" class="checkbox" bind:checked={canProcessImages} />
	</label>
	<label class="label mb-2 flex cursor-pointer items-center justify-between">
		<span>{L.inlineUserMessage()}</span>
		<input type="checkbox" class="checkbox" bind:checked={isInlineRolePlacement} />
	</label>
	<div class="mt-4 flex justify-between">
		<button class="variant-filled-warning btn" onclick={() => (view.showAddEndpointForm = false)}
			>{L.cancel()}</button
		>
		<button class="variant-filled-success btn" onclick={add}>{L.add()}</button>
	</div>
</div>
