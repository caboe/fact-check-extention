<script lang="ts">
	import { AccordionItem, SlideToggle } from '@skeletonlabs/skeleton'
	import { isSelectedImage, isSelectedText, SelectedContent } from '../../../TSelectedContent'
	import endpoints from '../../state/endpoints.svelte'
	import L from '../../state/L.svelte'
	import unifiedStorage from '../../util/unifiedStorage.svelte'
	import comments from '../svg/comments.svg'

	interface Props {
		open: boolean
	}

	let { open }: Props = $props()

	let endpointSelectEl: HTMLSelectElement | null = $state(null)

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

	let hasSelected = $derived(
		isSelectedImage(unifiedStorage.value.selectedContent) ||
			isSelectedText(unifiedStorage.value.selectedContent),
	)

	function selectedTokenLength() {
		if (!unifiedStorage.value.selectedContent) return 0
		if (isSelectedImage(unifiedStorage.value.selectedContent)) return 0
		if (!isSelectedText(unifiedStorage.value.selectedContent)) throw new Error('Unknown type')
		if (unifiedStorage.value.selectedContent.text.replaceAll(' ', '').length === 0) return 0
		return unifiedStorage.value.selectedContent.text.trim().split(' ').length
	}

	function selectCurrent() {
		const idx = endpoints.value.list.findIndex((ep) => ep.title === endpoints.value.selected?.title)
		const option = endpointSelectEl?.getElementsByTagName('option')[idx]
		if (option) option.selected = true
	}

	function textChange(event: Event) {
		const target = event.target as HTMLTextAreaElement
		unifiedStorage.value.selectedContent = { text: target.value }
		unifiedStorage.value.result = undefined
	}

	function reset() {
		unifiedStorage.value.selectedContent = { text: '' }
		unifiedStorage.value.result = undefined
	}

	$effect(() => {
		endpoints.value.selected
		endpointSelectEl
		selectCurrent()
	})

	let imageSelectMode = $derived(isSelectedImage(unifiedStorage.value.selectedContent))

	function toggleImageSelectMode() {
		unifiedStorage.value.selectedContent = initContent(imageSelectMode ? 'text' : 'image')
		imageSelectOnPage(false)
	}

	function imageSelectOnPage(imageSelectMode: boolean) {
		chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs[0].id !== undefined) {
				chrome.tabs.sendMessage(tabs[0].id, {
					action: imageSelectMode ? 'enableImageSelect' : 'disableImageSelect',
				})
			}
		})
	}

	function selectImageOnPage(e: Event) {
		imageSelectOnPage(true)
		window.close()
	}

	function initContent(state: 'text' | 'image' = 'text') {
		let newContent: any = {}
		if (state === 'text') {
			newContent.text = ''
		} else if (state === 'image') {
			newContent.image = null
		}
		return newContent as SelectedContent
	}

	function onclick(e: Event) {
		console.log(e)

		e.stopPropagation()
		// e.preventDefault()
	}

	$effect(() => {
		if (!hasSelected) {
			unifiedStorage.value.selectedContent = initContent()
		}
	})
</script>

<AccordionItem {open} on:click>
	{#snippet summary()}
		{@const content = unifiedStorage.value.selectedContent}
		<label
			for="selected-text"
			class="text-md grid grid-cols-[16px_1fr] items-center gap-2 font-bold"
		>
			<img src={comments} class="h-4 w-4" alt="Comments Icon" />
			{#if isSelectedImage(content)}
				{#if content.image && content.image.length > 0}
					<span>Image selected</span>
				{:else}
					<button class="btn">Select image</button>
				{/if}
			{:else if isSelectedText(content)}
				{#if content.text.replaceAll(' ', '').length === 0}
					<span>{L.enterText()}</span>
				{:else}
					<span>{L.markedText({ wordCount: selectedTokenLength() })}</span>
				{/if}
			{/if}
		</label>
	{/snippet}
	{#snippet content()}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="grid grid-cols-[1fr_auto_1fr_32px] items-center justify-center gap-4" {onclick}>
			<span class="text-right">Text</span>
			<SlideToggle name="slide" on:change={toggleImageSelectMode} checked={!!imageSelectMode} />
			<span>Image</span>
			<button onclick={reset} class="variant-filled btn btn-sm cursor-pointer">X</button>
		</div>
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
			{#if unifiedStorage.value.selectedContent.image}
				<img
					src={unifiedStorage.value.selectedContent.image}
					alt="selected"
					class="w-max-full max-h-[300px]"
				/>
			{:else}
				<button class="btn cursor-pointer" onclick={selectImageOnPage}
					>Please select an image.</button
				>
			{/if}
		{/if}
	{/snippet}
</AccordionItem>
