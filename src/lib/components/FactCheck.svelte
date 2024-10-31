<!-- src/components/FactCheck.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
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

	onMount(() => {
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
		if (!selectedEndpoint) return;
		const endpoint = endpoints.find((ep) => ep.title === selectedEndpoint);
		if (!endpoint) return;

		loading = true;
		result = '';
		const length = 100;
		// const role = 'You are a climate expert who is angry that the climate catastrophe is being trivialized and therefore responds angrily, but with mentioning facts.'
		const role = 'Du bist ein Experte und weißt auf fehlerhafte und umstrittene Fakten hin.';

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
</script>

<div class="mx-1 p-3">
	<label for="selected-text" class="text-md font-bold">Markierter Text:</label>

	<textarea
		id="selected-text"
		bind:value={selectedText}
		class="textarea"
		rows="4"
		placeholder="Markierten Text hier bearbeiten..."
	></textarea>
	<div class="mt-3 flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<label for="endpoints" class="text-md font-bold">API Endpoint:</label>
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
	{#if result}
		<label for="selected-text" class="label mt-3">
			<span class="text-md font-bold"> Ergebnis </span>
			<textarea id="selected-text" bind:value={result} class="textarea" rows="4"></textarea>
			<button class="variant-filled-success btn w-full" onclick={copyResult}>
				In Zwischenablage kopieren
			</button>
		</label>
	{/if}
</div>
