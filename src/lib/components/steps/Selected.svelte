<script lang="ts">
	import { AccordionItem } from '@skeletonlabs/skeleton'
	import endpoints from '../../state/endpoints.svelte'
	import L from '../../state/L.svelte'
	import comments from '../svg/comments.svg'
	import apiRequest from '../../state/apiRequest.svelte'

	interface Props {
		open: boolean
	}

	let { open }: Props = $props()

	let endpointSelect: HTMLSelectElement | null = $state(null)

	$effect(() => {
		chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs[0].id !== undefined) {
				chrome.tabs.sendMessage(tabs[0].id, { action: 'getSelectedText' }, (response) => {
					if (response && response.text) {
						apiRequest.selectedText = response.text
					} else {
						apiRequest.selectedText = ''
					}
				})
			}
		})
	})

	function selectedTokenLength() {
		if (!apiRequest.selectedText) return 0
		if (apiRequest.selectedText.replaceAll(' ', '').length === 0) return 0
		return apiRequest.selectedText.trim().split(' ').length
	}

	function selectCurrent() {
		const idx = endpoints.value.findIndex((ep) => ep.title === endpoints.selected?.title)
		const option = endpointSelect?.getElementsByTagName('option')[idx]
		if (option) option.selected = true
	}

	$effect(() => {
		endpoints.selected
		endpointSelect
		selectCurrent()
	})
</script>

<AccordionItem {open}>
	{#snippet summary()}
		<label
			for="selected-text"
			class="text-md grid grid-cols-[16px_1fr] items-center gap-2 font-bold"
		>
			<img src={comments} class="h-4 w-4" alt="Comments Icon" />
			{@html selectedTokenLength()
				? `<span>${L.markedText({ wordCount: selectedTokenLength() })}</span>`
				: `<span class="text-red-500">${L.enterText()}</span>`}
		</label>
	{/snippet}
	{#snippet content()}
		<textarea
			id="selected-text"
			bind:value={apiRequest.selectedText}
			class="textarea"
			rows="4"
			placeholder={L.editText()}
		></textarea>
	{/snippet}
</AccordionItem>
