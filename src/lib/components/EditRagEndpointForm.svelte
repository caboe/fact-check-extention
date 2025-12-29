<script lang="ts">
	import ragEndpoints, { type RagEndpoint } from '../state/ragEndpoints.svelte'
	import L from '../state/L.svelte'
	import view from '../state/view.svelte'

	const { endpoint, initialData, onsubmit } = $props<{
		endpoint?: RagEndpoint
		initialData?: RagEndpoint
		onsubmit?: () => void
	}>()

	let title = $state(endpoint?.title || initialData?.title || '')
	let url = $state(endpoint?.url || initialData?.url || '')
	let apiKey = $state(endpoint?.apiKey || initialData?.apiKey || '')
	let mode = $state(endpoint?.mode || initialData?.mode || 'hybrid')
	let top_k = $state(endpoint?.top_k || initialData?.top_k || 10)

	function handleSubmit() {
		const newEndpoint: RagEndpoint = {
			title,
			url,
			apiKey,
			mode,
			top_k,
		}

		if (endpoint) {
			ragEndpoints.edit(endpoint.title, newEndpoint)
		} else {
			ragEndpoints.add(newEndpoint)
		}

		if (onsubmit) {
			onsubmit()
		}
	}
</script>

<form
	onsubmit={(e) => {
		e.preventDefault()
		handleSubmit()
		// Dispatch event or callback to close form?
		// For simplicity, we can let the parent handle closure via props or context if needed.
		// But following EditEndpointForm pattern:
	}}
	class="flex flex-col gap-4"
>
	<div class="form-control">
		<label class="label" for="title">{L.title()}</label>
		<input type="text" id="title" bind:value={title} class="input-bordered input" required />
	</div>

	<div class="form-control">
		<label class="label" for="url">{L.url()}</label>
		<input type="url" id="url" bind:value={url} class="input-bordered input" required />
	</div>

	<div class="form-control">
		<label class="label" for="apiKey">{L.apiKey()}</label>
		<input type="password" id="apiKey" bind:value={apiKey} class="input-bordered input" />
	</div>

	<div class="form-control">
		<label class="label" for="mode">{L.ragMode()}</label>
		<select id="mode" bind:value={mode} class="select">
			<option value="local">{L.ragModeLocal()}</option>
			<option value="global">{L.ragModeGlobal()}</option>
			<option value="hybrid">{L.ragModeHybrid()}</option>
			<option value="naive">{L.ragModeNaive()}</option>
			<option value="mix">{L.ragModeMix()}</option>
		</select>
	</div>

	<div class="form-control">
		<label class="label" for="top_k">{L.topK()}</label>
		<input type="number" id="top_k" bind:value={top_k} class="input-bordered input" />
	</div>

	<button type="submit" class="variant-filled-success btn w-full">
		{endpoint ? L.updateRagEndpoint() : L.addRagEndpoint()}
	</button>
</form>
