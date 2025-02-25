<script lang="ts">
	import { AccordionItem } from '@skeletonlabs/skeleton'
	import apiRequest from '../../state/apiRequest.svelte'
	import endpoints from '../../state/endpoints.svelte'
	import L from '../../state/L.svelte'
	import { setResult, setSelectedContent } from '../../util/unifiedStorage.svelte'
	import comments from '../svg/comments.svg'

	interface Props {
		open: boolean
	}

	let { open }: Props = $props()

	let endpointSelect: HTMLSelectElement | null = $state(null)

	let isEditable: boolean = true //$derived(!apiRequest.selectedContent)

	$effect(() => {
		chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs[0].id !== undefined) {
				chrome.tabs.sendMessage(tabs[0].id, { action: 'getSelectedText' }, (response) => {
					if (response && response.text) {
						setSelectedContent(response.text)
						setResult('')
					}
				})
			}
		})
	})

	function selectedTokenLength() {
		if (!apiRequest.selectedContent) return 0
		if (apiRequest.selectedContent.replaceAll(' ', '').length === 0) return 0
		return apiRequest.selectedContent.trim().split(' ').length
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

<AccordionItem {open} on:click>
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
		{#if isEditable}
			<textarea
				id="selected-text"
				bind:value={apiRequest.selectedContent}
				class="textarea"
				rows="4"
				placeholder={L.selectedText()}
			></textarea>
		{:else}
			<p class="max-h-60 overflow-scroll text-sm text-gray-500">{apiRequest.selectedContent}</p>
		{/if}
	{/snippet}
</AccordionItem>
