<!-- src/components/FactCheck.svelte -->
<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton'
	import Connection from './steps/Connection.svelte'
	import Response from './steps/Response.svelte'
	import Selected from './steps/Selected.svelte'
	import checkFact from '../util/checkFact'
	import apiRequest from '../state/apiRequest.svelte'
	import view from '../state/view.svelte'

	$effect(() => {
		// Anfrage an Content Script, um den markierten Text zu erhalten
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs[0].id !== undefined) {
				chrome.tabs.sendMessage(tabs[0].id, { action: 'getSelectedText' }, (response) => {
					if (response && response.text) {
						apiRequest.selectedText = response.text
						view.step = 1
					} else {
						apiRequest.selectedText = ''
						view.step = 0
					}
				})
			}
		})
	})
</script>

<div class="mx-1 p-3">
	<Accordion autocollapse spacing="space-y-4">
		<Selected open={view.step === 0} />
		<Connection open={view.step === 1} {checkFact} />
		<Response open={view.step === 2} />
	</Accordion>
</div>
