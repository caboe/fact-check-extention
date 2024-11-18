<!-- src/components/FactCheck.svelte -->
<script lang="ts">
	import { Accordion, AccordionItem, SlideToggle } from '@skeletonlabs/skeleton';
	import endpoints from './Endpoints.svelte';
	import Settings from './icons/SettingsIcon.svelte';
	import L from './L.svelte';

	let selectedText: string = $state('');
	let result: string = $state('');
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

	$effect(() => {
		// Anfrage an Content Script, um den markierten Text zu erhalten
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs[0].id !== undefined) {
				chrome.tabs.sendMessage(tabs[0].id, { action: 'getSelectedText' }, (response) => {
					if (response && response.text) {
						selectedText = response.text;
					} else {
						selectedText = '';
					}
				});
			}
		});
	});

	async function checkFact() {
		if (!endpoints.selected) {
			step = 1;
			return;
		}
		step = 2;

		loading = true;
		result = '';
		// const role = 'You are a climate expert who is angry that the climate catastrophe is being trivialized and therefore responds angrily, but with mentioning facts.'
		// const role = 'Du bist ein Experte und weißt auf fehlerhafte und umstrittene Fakten hin.';
		const factCheckRole =
			'You are an expert and subject the input to a critical review. You are aware of all erroneous and controversial statements in the text. You present your statement as a list,  with mentioning facts.';

		const answerRole =
			'You are a climate expert who is angry that the climate catastrophe is being trivialized and therefore responds angrily, but with mentioning facts.';
		const role = isAnswer ? answerRole : factCheckRole;

		try {
			const response = await fetch(endpoints.selected.url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${endpoints.selected.apiKey}`
				},
				body: JSON.stringify({
					model: 'gpt-4o-mini',
					messages: [
						{
							role: 'system',
							content: role + ' Your answer should be around' + range + ' words in length.'
							// content:
							// 'You are a helpful assistant. You providing short answers with around 100 words.',
						},
						{
							role: 'system',
							content: `Answer in the style of ${character || 'friedly person'}`
						},
						{ role: 'user', content: selectedText }
					]
				})
			});

			if (!response.ok) {
				throw new Error(`HTTP-Fehler! Status: ${response.status}`);
			}

			const data = await response.json();
			result = data.choices[0].message.content;
		} catch (err: any) {
			result = 'Fehler beim Fact Check: ' + err.message;
		} finally {
			loading = false;
		}
	}

	function copyResult() {
		navigator.clipboard
			.writeText(result)
			.then(() => {
				alert('Ergebnis in die Zwischenablage kopiert!');
			})
			.catch((err) => {
				alert('Fehler beim Kopieren: ' + err.message);
			});
	}

	function selectedTokenLength() {
		if (!selectedText) return 0;
		if (selectedText.replaceAll(' ', '').length === 0) return 0;
		return selectedText.trim().split(' ').length;
	}

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

<div class="mx-1 p-3">
	<Accordion autocollapse spacing="space-y-1">
		<AccordionItem open={step === 0}>
			{#snippet summary()}
				<label for="selected-text" class="text-md font-bold">
					{@html selectedTokenLength()
						? L.markedText({ wordCount: selectedTokenLength() })
						: `<span class="text-red-500">${L.enterText()}</span>`}</label
				>
			{/snippet}
			{#snippet content()}
				<textarea
					id="selected-text"
					bind:value={selectedText}
					class="textarea"
					rows="4"
					placeholder={L.editText()}
				></textarea>
			{/snippet}
		</AccordionItem>
		<AccordionItem open={step === 1}>
			{#snippet summary()}
				<label for="endpoints" class="text-md font-bold">{L.apiEndpoint()}</label>
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
							<option>{endpoint.title}</option>
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
		<AccordionItem open={step === 2}>
			{#snippet summary()}
				<label for="selected-text" class="text-md font-bold">{L.response()}</label>
			{/snippet}
			{#snippet content()}
				{#if result}
					<textarea id="selected-text" bind:value={result} class="textarea" rows="4"></textarea>
					<button class="variant-filled-success btn w-full" onclick={copyResult}>
						{L.copy()}
					</button>
				{:else if loading}
					{L.checkingProgress()}
				{:else}
					{L.notChecked()}
				{/if}
			{/snippet}
		</AccordionItem>
	</Accordion>
</div>
