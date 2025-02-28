<script lang="ts">
	import { AccordionItem } from '@skeletonlabs/skeleton'
	import { onMount } from 'svelte'
	import { isSelectedImage, isSelectedText, SelectedContent } from '../../../TSelectedContent'
	import endpoints from '../../state/endpoints.svelte'
	import L from '../../state/L.svelte'
	import unifiedStorage from '../../util/unifiedStorage.svelte'
	import comments from '../svg/comments.svg'

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
						unifiedStorage.value.result = undefined
						unifiedStorage.value.selectedContent = response
					},
				)
			}
		})
	})

	function selectedTokenLength() {
		if (!unifiedStorage.value.selectedContent) return 0
		if (isSelectedImage(unifiedStorage.value.selectedContent)) return 0
		if (!isSelectedText(unifiedStorage.value.selectedContent)) throw new Error('Unknown type')
		if (unifiedStorage.value.selectedContent.text.replaceAll(' ', '').length === 0) return 0
		return unifiedStorage.value.selectedContent.text.trim().split(' ').length
	}

	function selectCurrent() {
		const idx = endpoints.value.endpoints.findIndex(
			(ep) => ep.title === endpoints.value.selected?.title,
		)
		const option = endpointSelect?.getElementsByTagName('option')[idx]
		if (option) option.selected = true
	}

	function textChange(event: Event) {
		const target = event.target as HTMLTextAreaElement
		unifiedStorage.value.selectedContent = { text: target.value }
		unifiedStorage.value.result = undefined
	}

	function reset() {
		unifiedStorage.value.selectedContent = null
		unifiedStorage.value.result = undefined
	}

	$effect(() => {
		endpoints.value.selected
		endpointSelect
		selectCurrent()
	})

	onMount(() => {
		const { selectedContent } = unifiedStorage.value

		if (!isSelectedText(selectedContent) && !isSelectedImage(selectedContent)) {
			unifiedStorage.value.selectedContent = { text: '123' }
		}
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
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<span onclick={reset} class="cursor-pointer text-red-500">reset</span>
		{#if isSelectedText(unifiedStorage.value.selectedContent)}
			<textarea
				id="selected-text"
				value={unifiedStorage.value.selectedContent.text}
				onchange={textChange}
				class="textarea"
				rows="4"
				placeholder={L.selectedText()}
			></textarea>
		{:else if isSelectedImage(unifiedStorage.value.selectedContent)}
			<img
				src={unifiedStorage.value.selectedContent.image}
				alt="selected"
				class="w-max-full max-h-[300px]"
			/>
		{/if}
	{/snippet}
</AccordionItem>
