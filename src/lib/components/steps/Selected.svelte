<script lang="ts">
	import { AccordionItem } from '@skeletonlabs/skeleton'
	import apiRequest from '../../state/apiRequest.svelte'
	import endpoints from '../../state/endpoints.svelte'
	import L from '../../state/L.svelte'
	import { setResult, setSelectedContent } from '../../util/unifiedStorage.svelte'
	import comments from '../svg/comments.svg'
	import { isSelectedText, isSelectedImage, SelectedContent } from '../../../TSelectedContent'

	interface Props {
		open: boolean
	}

	let { open }: Props = $props()

	let endpointSelect: HTMLSelectElement | null = $state(null)

	$effect(() => {
		chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs[0].id !== undefined) {
				chrome.tabs.sendMessage(
					tabs[0].id,
					{ action: 'getSelectedContent' },
					(response: SelectedContent) => {
						setResult(undefined)
						setSelectedContent(response)
					},
				)
			}
		})
	})

	function selectedTokenLength() {
		if (!apiRequest.selectedContent) return 0
		if (isSelectedImage(apiRequest.selectedContent)) return 0
		if (!isSelectedText(apiRequest.selectedContent)) throw new Error('Unknown type')
		if (apiRequest.selectedContent.text.replaceAll(' ', '').length === 0) return 0
		return apiRequest.selectedContent.text.trim().split(' ').length
	}

	function selectCurrent() {
		const idx = endpoints.value.findIndex((ep) => ep.title === endpoints.selected?.title)
		const option = endpointSelect?.getElementsByTagName('option')[idx]
		if (option) option.selected = true
	}

	function textChange(event: Event) {
		const target = event.target as HTMLTextAreaElement
		setSelectedContent({ text: target.value })
		setResult(undefined)
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
		{#if isSelectedText(apiRequest.selectedContent)}
			<textarea
				id="selected-text"
				value={apiRequest.selectedContent.text}
				onchange={textChange}
				class="textarea"
				rows="4"
				placeholder={L.selectedText()}
			></textarea>
		{:else if isSelectedImage(apiRequest.selectedContent)}
			<img src={apiRequest.selectedContent.image} alt="selected" class="w-max-full max-h-[300px]" />
		{:else}
			<textarea
				id="selected-text"
				value={''}
				onchange={textChange}
				class="textarea"
				rows="4"
				placeholder={L.selectedText()}
			></textarea>
		{/if}
	{/snippet}
</AccordionItem>
