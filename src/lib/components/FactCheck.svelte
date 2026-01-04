<!-- src/components/FactCheck.svelte -->
<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton'
	import apiRequest from '../state/apiRequest.svelte'
	import endpoints from '../state/endpoints.svelte'
	import L from '../state/L.svelte'
	import view from '../state/view.svelte'
	import checkFact from '../util/checkFact.svelte'
	import unifiedStorage from '../util/unifiedStorage.svelte'
	import Connection from './steps/Connection.svelte'
	import Response from './steps/Response.svelte'
	import Selected from './steps/Selected.svelte'
</script>

<div class="p-1">
	<Accordion autocollapse spacing="space-y-4">
		<Selected open={view.step === 0} on:click={() => (view.step = 0)} />
		<Connection open={view.step === 1} on:click={() => (view.step = 1)} {checkFact} />
		<Response open={view.step === 2} on:click={() => (view.step = 2)} />
	</Accordion>

	{#if view.step !== 2}
		<div class="mt-4 px-4">
			<div class="mb-4 flex flex-col items-center justify-between gap-2">
				<input type="range" min="3" max="500" bind:value={apiRequest.value.range} class="w-full" />
				<div class="text-sm">{L.responseLength({ responseLength: apiRequest.value.range })}</div>
			</div>

			<div class="mb-4 flex items-center justify-center">
				{#if unifiedStorage.value.selectedRagEndpoints.length > 0}
					<label class="flex items-center gap-2">
						<span class="text-sm font-medium"
							>{L.useRags({ count: unifiedStorage.value.selectedRagEndpoints.length })}</span
						>
						<input type="checkbox" class="checkbox" bind:checked={unifiedStorage.value.useRag} />
					</label>
				{:else}
					<button class="text-sm text-primary-500 underline" onclick={() => (view.step = 1)}>
						{L.activateRags()}
					</button>
				{/if}
			</div>

			<button
				class="variant-filled-primary btn w-full"
				onclick={checkFact}
				disabled={!unifiedStorage.value.selectedContent || !endpoints.value.selected}
				data-testid="fact-check-btn"
			>
				{#if apiRequest.value.state === 'LOADING'}
					{L.checkingProgress()}
				{:else if apiRequest.value.state === 'THINKING'}
					{L.thinking()}
				{:else if apiRequest.value.state === 'STREAMING'}
					{L.checkingProgress()}
				{:else}
					{L.apiCta()}
				{/if}
			</button>
		</div>
	{/if}
</div>
