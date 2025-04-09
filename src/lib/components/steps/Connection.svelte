<script lang="ts">
	import { AccordionItem } from '@skeletonlabs/skeleton'
	import popupState from '../../../popupState.svelte'
	import apiRequest from '../../state/apiRequest.svelte'
	import endpoints from '../../state/endpoints.svelte'
	import L from '../../state/L.svelte'
	import view from '../../state/view.svelte'
	import Settings from '../icons/SettingsIcon.svelte'
	import unifiedStorage from '../../util/unifiedStorage.svelte'
	import ConnectionIcon from '../icons/ConnectionIcon.svelte'

	interface Props {
		open: boolean
		checkFact: () => Promise<void>
	}

	let { open, checkFact }: Props = $props()

	let endpointSelect: HTMLSelectElement | null = $state(null)

	if (unifiedStorage.value.selectedContent && view.step === 0) {
		view.step = 1
	}

	function selectCurrent() {
		const idx = endpoints.value.list.findIndex((ep) => ep.title === endpoints.value.selected?.title)
		const option = endpointSelect?.getElementsByTagName('option')[idx]
		if (option) option.selected = true
	}

	$effect(() => {
		endpoints.value.selected
		endpointSelect
		selectCurrent()
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
			{#if endpoints.value.list.length === 1}
				<span class="text-center text-lg font-bold">{endpoints.value.list[0].title}</span>
			{:else}
				<select
					bind:this={endpointSelect}
					class="select"
					id="endpoints"
					bind:value={endpoints.value.selected}
				>
					{#each endpoints.value.list as endpoint}
						<option value={endpoint}>{endpoint.title}</option>
					{/each}
				</select>
			{/if}
			<div class="grid grid-cols-1 items-center justify-between gap-2">
				<button class="variant-filled-primary btn" onclick={() => (popupState.value = 'TONE')}>
					{L.configureTone()}
				</button>
			</div>
			<!-- 			<label class="grid max-h-0 grid-cols-1 grid-rows-2 gap-2 overflow-hidden transition-all">
				<div class="text-sm">{L.personLabel()}</div>
				<input
					class="input"
					type="text"
					bind:value={unifiedStorage.value.person}
					placeholder={L.personPlaceholder()}
				/>
			</label> -->
			<div class="flex flex-col items-center justify-between gap-2">
				<input type="range" min="3" max="500" bind:value={apiRequest.value.range} class="mt-2" />
				<div class="text-sm">{L.responseLength({ responseLength: apiRequest.value.range })}</div>
			</div>
			<button
				class="variant-filled-primary btn"
				onclick={checkFact}
				disabled={apiRequest.value.loading || !unifiedStorage.value.selectedContent}
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
