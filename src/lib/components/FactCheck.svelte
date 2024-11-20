<!-- src/components/FactCheck.svelte -->
<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton';
	import endpoints from './Endpoints.svelte';
	import Connection from './steps/Connection.svelte';
	import Response from './steps/Response.svelte';
	import Selected from './steps/Selected.svelte';

	let selectedText: string = $state('');
	let result: string = $state('');
	let loading: boolean = $state(false);
	let step = $state(0);
	let range = $state(50);
	let isAnswer = $state(false);
	let character = $state('');

	$effect(() => {
		// Anfrage an Content Script, um den markierten Text zu erhalten
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs[0].id !== undefined) {
				chrome.tabs.sendMessage(tabs[0].id, { action: 'getSelectedText' }, (response) => {
					if (response && response.text) {
						selectedText = response.text;
						step = 1;
					} else {
						selectedText = '';
						step = 0;
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
</script>

<div class="mx-1 p-3">
	<Accordion autocollapse spacing="space-y-4">
		<Selected open={step === 0} bind:selectedText />
		<Connection open={step === 1} {checkFact} {selectedText} />
		<Response open={step === 2} {result} {loading} />
	</Accordion>
</div>
