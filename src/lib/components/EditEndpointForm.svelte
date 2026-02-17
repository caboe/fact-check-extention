<script lang="ts">
	import endpoints from '../state/endpoints.svelte'
	import { type Endpoint } from '../state/endpoints.svelte'
	import L from '../state/L.svelte'
	import view from '../state/view.svelte'

	const { endpoint } = $props<{
		endpoint: Endpoint
	}>()

	let title = $state(endpoint.title)
	let url = $state(endpoint.url)
	let apiKey = $state(endpoint.apiKey)
	let model = $state(endpoint.model)
	let canProcessImages = $state(endpoint.canProcessImages ?? false)
	let isInlineRolePlacement = $state(endpoint.rolePlacement === 'inline')

	function handleSubmit() {
		const updatedEndpoint: Endpoint = {
			title: title.trim(),
			url: url.trim(),
			apiKey: apiKey.trim(),
			model: model.trim(),
			canProcessImages,
			rolePlacement: isInlineRolePlacement ? 'inline' : 'system',
		}
		endpoints.edit(endpoint.title, updatedEndpoint)
		view.showAddEndpointForm = false
		title = ''
		url = ''
		apiKey = ''
		model = ''
	}
</script>

<form
	onsubmit={(e) => {
		e.preventDefault()
		handleSubmit()
	}}
	class="flex flex-col gap-4"
>
	<div class="form-control">
		<label class="label" for="title">Title</label>
		<input type="text" id="title" bind:value={title} class="input-bordered input" required />
	</div>

	<div class="form-control">
		<label class="label" for="url">URL</label>
		<input type="url" id="url" bind:value={url} class="input-bordered input" required />
	</div>

	<div class="form-control">
		<label class="label" for="apiKey">API Key</label>
		<input type="password" id="apiKey" bind:value={apiKey} class="input-bordered input" />
	</div>

	<div class="form-control">
		<label class="label" for="model">Model</label>
		<input type="text" id="model" bind:value={model} class="input-bordered input" />
	</div>

	<label class="label flex cursor-pointer items-center justify-between">
		<span>{L.canProcessImages()}</span>
		<input type="checkbox" class="checkbox" bind:checked={canProcessImages} />
	</label>

	<label class="label flex cursor-pointer items-center justify-between">
		<span>{L.inlineUserMessage()}</span>
		<input type="checkbox" class="checkbox" bind:checked={isInlineRolePlacement} />
	</label>

	<button type="submit" class="variant-filled-success btn w-full"> {L.updateEndpoint()} </button>
</form>
