<!-- src/components/FactCheck.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	interface Endpoint {
		title: string;
		url: string;
		apiKey: string;
	}

	let selectedText: string = '';
	let endpoints: Endpoint[] = [];
	let selectedEndpoint: string = '';
	let result: string = '';
	let loading: boolean = false;

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

		try {
			const response = await fetch(endpoint.url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${endpoint.apiKey}`
				},
				body: JSON.stringify({ text: selectedText })
			});

			if (!response.ok) {
				throw new Error(`HTTP-Fehler! Status: ${response.status}`);
			}

			const data = await response.json();
			result = JSON.stringify(data, null, 2);
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

<div class="factcheck-container">
	<textarea bind:value={selectedText} placeholder="Markierten Text hier bearbeiten..."></textarea>
	<div class="controls">
		<label for="endpoints">API Endpoint:</label>
		<select id="endpoints" bind:value={selectedEndpoint}>
			{#each endpoints as endpoint}
				<option>{endpoint.title}</option>
			{/each}
		</select>
		<button on:click={checkFact} disabled={loading || !selectedText}>
			{#if loading}
				Prüfe...
			{:else}
				Prüfen
			{/if}
		</button>
	</div>
	{#if result}
		<div class="result-section">
			<div class="result">
				<pre>{result}</pre>
			</div>
			<button on:click={copyResult}>In Zwischenablage kopieren</button>
		</div>
	{/if}
</div>

<style>
	textarea {
		width: 100%;
		height: 100px;
		resize: vertical;
	}
	.result {
		white-space: pre-wrap;
		background: #f0f0f0;
		padding: 10px;
		margin-top: 10px;
		height: 150px;
		overflow-y: auto;
	}
	.factcheck-container {
		padding: 10px;
		width: 300px;
	}
	.controls {
		margin-top: 10px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.controls select,
	.controls button {
		width: 100%;
	}
	.result-section {
		margin-top: 10px;
	}
</style>
