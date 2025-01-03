<script lang="ts">
	import endpoints from '../state/endpoints.svelte'
	import { type Endpoint } from '../state/endpoints.svelte'

	const { endpoint } = $props<{
		endpoint: Endpoint
	}>()

	let title = $state(endpoint.title)
	let url = $state(endpoint.url)
	let apiKey = $state(endpoint.apiKey)
	let model = $state(endpoint.model)

	function handleSubmit() {
		const updatedEndpoint: Endpoint = {
			title,
			url,
			apiKey,
			model,
		}
		endpoints.edit(endpoint.title, updatedEndpoint)
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
		<input type="password" id="apiKey" bind:value={apiKey} class="input-bordered input" required />
	</div>

	<div class="form-control">
		<label class="label" for="model">Model</label>
		<input type="text" id="model" bind:value={model} class="input-bordered input" required />
	</div>

	<button type="submit" class="variant-filled-success btn w-full"> Update Endpoint </button>
</form>
