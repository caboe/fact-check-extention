<script lang="ts">
	import { AccordionItem, SlideToggle } from '@skeletonlabs/skeleton';
	import endpoints from '../Endpoints.svelte';
	import Settings from '../icons/SettingsIcon.svelte';
	import L from '../L.svelte';
	import connection from '../svg/connection.svg';

	interface Props {
		open: boolean;
		checkFact: () => Promise<void>;
		selectedText: string;
	}

	let { open, checkFact, selectedText }: Props = $props();

	let loading: boolean = $state(false);
	let step = $state(0);
	let range = $state(50);
	let isAnswer = $state(false);
	let character = $state('');
	let endpointSelect: HTMLSelectElement | null = $state(null);

	$effect(() => {
		if (selectedText.trim().length > 1 && step === 0) {
			step = 1;
		}
	});

	function selectCurrent() {
		const idx = endpoints.value.findIndex((ep) => ep.title === endpoints.selected?.title);
		const option = endpointSelect?.getElementsByTagName('option')[idx];
		if (option) option.selected = true;
	}

	$effect(() => {
		endpoints.selected;
		endpointSelect;
		selectCurrent();
	});
</script>

<AccordionItem {open}>
	{#snippet summary()}
		<label for="endpoints" class="text-md grid grid-cols-[16px_1fr] items-center gap-2 font-bold">
			<img src={connection} class="h-4 w-4" alt="Response Icon" />
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
			<select
				bind:this={endpointSelect}
				class="select"
				id="endpoints"
				bind:value={endpoints.selected}
			>
				{#each endpoints.value as endpoint}
					<option value={endpoint}>{endpoint.title}</option>
				{/each}
			</select>
			<div class="grid grid-cols-[1fr_auto_1fr] items-center justify-between gap-2">
				<div>{L.factCheck()}</div>
				<div class="text-center">
					<SlideToggle name="slide" bind:checked={isAnswer} />
				</div>
				<div class="text-right">{L.response()}</div>
			</div>
			<label
				class="grid max-h-0 grid-cols-1 grid-rows-2 gap-2 overflow-hidden transition-all"
				class:max-h-[100px]={isAnswer}
			>
				<div class="text-sm">{L.characterLabel()}</div>
				<input
					class="input"
					type="text"
					bind:value={character}
					placeholder={L.characterPlaceholder()}
				/>
			</label>
			<div class="flex flex-col items-center justify-between gap-2">
				<input type="range" min="3" max="500" bind:value={range} class="mt-2" />
				<div class="text-sm">{L.responseLength({ responseLength: range })}</div>
			</div>
			<button
				class="variant-filled-primary btn"
				onclick={checkFact}
				disabled={loading || !selectedText}
			>
				{#if loading}
					{L.checkingProgress()}
				{:else}
					{L.apiCta()}
				{/if}
			</button>
		</div>
	{/snippet}
</AccordionItem>
