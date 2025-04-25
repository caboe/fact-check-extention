<script lang="ts">
	import { AccordionItem } from '@skeletonlabs/skeleton'
	import popupState from '../../../popupState.svelte'
	import { isSelectedImage } from '../../../TSelectedContent'
	import apiRequest from '../../state/apiRequest.svelte'
	import endpoints from '../../state/endpoints.svelte'
	import L from '../../state/L.svelte'
	import view from '../../state/view.svelte'
	import unifiedStorage from '../../util/unifiedStorage.svelte'
	import ConnectionIcon from '../icons/ConnectionIcon.svelte'
	import Settings from '../icons/SettingsIcon.svelte'

	interface Props {
		open: boolean
		checkFact: () => Promise<void>
	}

	let { open, checkFact }: Props = $props()

	let endpointSelect: HTMLSelectElement | null = $state(null)

	if (unifiedStorage.value.selectedContent && view.step === 0) {
		view.step = 1
	}

	// --- Start Image Endpoint Logic ---
	let isImageSelected = $derived(isSelectedImage(unifiedStorage.value.selectedContent))

	// Corrected $derived syntax
	let availableEndpoints = $derived(
		isImageSelected
			? endpoints.value.list.filter((ep) => ep.canProcessImages)
			: endpoints.value.list,
	)

	// Removed erroneous $effect block
	$effect(() => {
		if (!endpointSelect) return
		// Automatically select an endpoint when the available list changes
		const currentSelected = endpoints.value.selected
		const isCurrentSelectedAvailable =
			currentSelected && availableEndpoints.some((ep) => ep.title === currentSelected.title)

		if (!isCurrentSelectedAvailable) {
			if (availableEndpoints.length > 0) {
				// Select the first available endpoint if the current one is not available or null
				endpoints.value.selected = availableEndpoints[0]
			} else {
				// No endpoints available (e.g., image selected, none support it)
				endpoints.value.selected = null
			}
		} else {
			endpointSelect.value = currentSelected.title
		}
	})
</script>

<AccordionItem {open} on:click>
	{#snippet summary()}
		<label for="endpoints" class="text-md grid grid-cols-[16px_1fr] items-center gap-2 font-bold">
			<ConnectionIcon />
			<span>
				{L.apiEndpoint()}
			</span>
		</label>
	{/snippet}
	{#snippet content()}
		<div class="mt-3 flex flex-col gap-2">
			<div class="flex items-center justify-between">
				<div class="text-md">{L.configureApi()}</div>
				<Settings />
			</div>
			{#if isImageSelected && availableEndpoints.length === 0}
				<div class="alert variant-soft-warning flex flex-col items-center gap-2 p-2 text-center">
					<span>{L.noImageEndpoint()}</span>
					<button
						class="variant-filled-primary btn btn-sm"
						onclick={() => (popupState.value = 'CONFIG')}
					>
						{L.configureButton()}
					</button>
				</div>
			{:else if availableEndpoints.length > 0}
				{#if availableEndpoints.length === 1}
					<span class="text-center text-lg font-bold">{availableEndpoints[0].title}</span>
				{:else}
					<select
						bind:this={endpointSelect}
						class="select"
						id="endpoints"
						onchange={(event) => {
							const selectedEndpoint = availableEndpoints.find(
								(ep) => ep.title === (event.target as HTMLSelectElement).value,
							)
							if (selectedEndpoint) {
								endpoints.value.selected = selectedEndpoint
							}
						}}
						value={endpoints.value.selected?.title || ''}
					>
						{#each availableEndpoints as endpoint (endpoint.title)}
							<option value={endpoint.title}>{endpoint.title}</option>
						{/each}
					</select>
				{/if}
			{/if}

			<label class="grid grid-cols-1 grid-rows-2 gap-2">
				<div class="text-sm">{L.personLabel()}</div>
				<input
					class="input"
					type="text"
					size="30"
					bind:value={unifiedStorage.value.person}
					placeholder={L.personPlaceholder()}
				/>
			</label>
			<div class="flex flex-col items-center justify-between gap-2">
				<input type="range" min="3" max="500" bind:value={apiRequest.value.range} class="mt-2" />
				<div class="text-sm">{L.responseLength({ responseLength: apiRequest.value.range })}</div>
			</div>
			<button
				class="variant-filled-primary btn"
				onclick={checkFact}
				disabled={apiRequest.value.loading ||
					!unifiedStorage.value.selectedContent ||
					!endpoints.value.selected}
			>
				{#if apiRequest.value.loading}
					{L.checkingProgress()}
				{:else}
					{L.apiCta()}
				{/if}
			</button>
		</div>
	{/snippet}
</AccordionItem>
