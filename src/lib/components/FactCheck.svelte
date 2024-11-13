<!-- src/components/FactCheck.svelte -->
<script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import Settings from './icons/SettingsIcon.svelte';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import L from './L';

	interface Endpoint {
		title: string;
		url: string;
		apiKey: string;
	}

	let selectedText: string = $state('');
	let endpoints: Endpoint[] = $state([]);
	let selectedEndpoint: string = $state('');
	let result: string = $state('');
	let loading: boolean = $state(false);
	let step = $state(0);
	let range = $state(50);
	let isAnswer = $state(false);

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

		// Lade Endpunkte aus dem Speicher
		chrome.storage.local.get('endpoints', (data: { endpoints?: Endpoint[] }) => {
			if (data.endpoints) {
				endpoints = data.endpoints;
				if (endpoints.length > 0) {
					selectedEndpoint = endpoints[0].title;
				}
			}
		});
	});

	async function checkFact() {
		if (!selectedEndpoint) {
			step = 1;
			return;
		}
		step = 2;

		const endpoint = endpoints.find((ep) => ep.title === selectedEndpoint);
		if (!endpoint) return;

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
			const response = await fetch(endpoint.url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${endpoint.apiKey}`
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
					<select class="select" id="endpoints" bind:value={selectedEndpoint}>
						{#each endpoints as endpoint}
							<option>{endpoint.title}</option>
						{/each}
					</select>
					<div class="flex items-center justify-between gap-2">
						<div>{L.factCheck()}</div>
						<SlideToggle name="slide" bind:checked={isAnswer} />
						<div>{L.response()}</div>
					</div>
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
