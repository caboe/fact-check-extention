<!-- src/components/FactCheck.svelte -->
<script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import Settings from './icons/SettingsIcon.svelte';

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
		const length = 100;
		// const role = 'You are a climate expert who is angry that the climate catastrophe is being trivialized and therefore responds angrily, but with mentioning facts.'
		// const role = 'Du bist ein Experte und weißt auf fehlerhafte und umstrittene Fakten hin.';
		const role =
			'You are an expert and subject the input to a critical review. You are aware of all erroneous and controversial statements in the text. You present your statement as a list,  with mentioning facts.';

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
							content: role + ' Your answer should be around' + length + 'words in length.'
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
					Markierter Text {selectedTokenLength()
						? `(${selectedTokenLength()} Wörter)`
						: '- bitte einfügen'}</label
				>
			{/snippet}
			{#snippet content()}
				<textarea
					id="selected-text"
					bind:value={selectedText}
					class="textarea"
					rows="4"
					placeholder="Markierten Text hier bearbeiten..."
				></textarea>
			{/snippet}
		</AccordionItem>
		<AccordionItem open={step === 1}>
			{#snippet summary()}
				<label for="selected-text" class="text-md font-bold">API Endpoint</label>
			{/snippet}
			{#snippet content()}
				<div class="mt-3 flex flex-col gap-2">
					<div class="flex items-center justify-between">
						<label for="endpoints" class="text-md">Configure:</label>
						<Settings />
					</div>
					<select class="select" id="endpoints" bind:value={selectedEndpoint}>
						{#each endpoints as endpoint}
							<option>{endpoint.title}</option>
						{/each}
					</select>
					<button
						class="variant-filled-primary btn"
						onclick={checkFact}
						disabled={loading || !selectedText}
					>
						{#if loading}
							Prüfe...
						{:else}
							Prüfen
						{/if}
					</button>
				</div>
			{/snippet}
		</AccordionItem>
		<AccordionItem open={step === 2}>
			{#snippet summary()}
				<label for="selected-text" class="text-md font-bold">Ergebnis</label>
			{/snippet}
			{#snippet content()}
				{#if result}
					<textarea id="selected-text" bind:value={result} class="textarea" rows="4"></textarea>
					<button class="variant-filled-success btn w-full" onclick={copyResult}>
						In Zwischenablage kopieren
					</button>
				{:else if loading}
					Prüfe...
				{:else}
					Noch nicht geprüft
				{/if}
			{/snippet}
		</AccordionItem>
	</Accordion>
</div>
