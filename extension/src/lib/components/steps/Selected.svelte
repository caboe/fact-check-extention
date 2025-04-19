<script lang="ts">
	import { AccordionItem } from '@skeletonlabs/skeleton'
	import { onMount } from 'svelte'
	import { isSelectedImage, isSelectedText, type SelectedContent } from '../../../TSelectedContent'
	import apiRequest from '../../state/apiRequest.svelte'
	import endpoints from '../../state/endpoints.svelte'
	import L from '../../state/L.svelte'
	import view from '../../state/view.svelte'
	import unifiedStorage from '../../util/unifiedStorage.svelte'
	import CommentsIcon from '../icons/CommentsIcon.svelte'
	import TextIcon from '../icons/TextIcon.svelte'
	import ImageIcon from '../icons/ImageIcon.svelte'
	import CloseIcon from '../icons/CloseIcon.svelte'
	interface Props {
		open: boolean
	}

	let { open }: Props = $props()

	let endpointSelectEl: HTMLSelectElement | null = $state(null)

	function isRestrictedUrl(url: string | undefined): boolean {
		if (!url) return true // Treat undefined URL as restricted
		try {
			const parsedUrl = new URL(url)
			return (
				parsedUrl.protocol === 'chrome:' ||
				parsedUrl.protocol === 'chrome-extension:' ||
				parsedUrl.hostname === 'chrome.google.com' // Web Store
			)
		} catch (e) {
			// Invalid URL, treat as restricted
			return true
		}
	}

	$effect(() => {
		chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
			const tab = tabs[0]
			if (tab?.id !== undefined && !isRestrictedUrl(tab.url)) {
				chrome.tabs.sendMessage(
					tab.id,
					{ action: 'getSelectedContent' },
					(response: SelectedContent) => {
						// Check lastError *first*
						if (chrome.runtime.lastError) {
							// Still log if connection fails unexpectedly on a non-restricted page
							console.warn(
								`Fact Check: Could not get selected content from tab ${tab.id} (${tab.url}): ${chrome.runtime.lastError.message}`,
							)
							return
						}
						// No error, proceed as normal
						unifiedStorage.value.result = undefined
						unifiedStorage.value.selectedContent = response
					},
				)
				// Also check URL before sending these
				imageSelectOnPage(false)
				textSelectOnPage(false)
			} else if (tab?.id !== undefined && isRestrictedUrl(tab.url)) {
				// Don't try to communicate with restricted pages
				// console.log(`Fact Check: Not attempting to get content from restricted URL: ${tab.url}`);
				// Optionally clear selection when opened on restricted page
				// unifiedStorage.value.selectedContent = undefined;
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
		apiRequest.value.loading = false
	}

	$effect(() => {
		endpoints.value.selected
		endpointSelectEl
		selectCurrent()
	})

	function imageSelectOnPage(imageSelectMode: boolean) {
		chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
			const tab = tabs[0]
			if (tab?.id !== undefined && !isRestrictedUrl(tab.url)) {
				chrome.tabs.sendMessage(
					tab.id,
					{
						action: imageSelectMode ? 'enableImageSelect' : 'disableImageSelect',
					},
					() => {
						if (chrome.runtime.lastError) {
							console.warn(
								`Fact Check: Could not toggle image select mode on tab ${tab.id} (${tab.url}): ${chrome.runtime.lastError.message}`,
							)
						}
					},
				)
			} else if (tab?.id !== undefined && isRestrictedUrl(tab.url)) {
				// console.log(`Fact Check: Not attempting image select on restricted URL: ${tab.url}`);
			}
		})
	}

	function textSelectOnPage(textSelectMode: boolean) {
		chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
			const tab = tabs[0]
			if (tab?.id !== undefined && !isRestrictedUrl(tab.url)) {
				chrome.tabs.sendMessage(
					tab.id,
					{
						action: textSelectMode ? 'enableTextSelect' : 'disableTextSelect',
					},
					() => {
						if (chrome.runtime.lastError) {
							console.warn(
								`Fact Check: Could not toggle text select mode on tab ${tab.id} (${tab.url}): ${chrome.runtime.lastError.message}`,
							)
						}
					},
				)
			} else if (tab?.id !== undefined && isRestrictedUrl(tab.url)) {
				// console.log(`Fact Check: Not attempting text select on restricted URL: ${tab.url}`);
			}
		})
	}

	function selectImageOnPage(e: Event) {
		imageSelectOnPage(true)
		window.close()
	}

	function selectTextOnPage(e: Event) {
		imageSelectOnPage(false)
		textSelectOnPage(true)
		window.close()
	}

	function createFromNewText(e: Event) {
		const target = e.target as HTMLTextAreaElement
		unifiedStorage.value.selectedContent = { text: target.value }
		unifiedStorage.value.result = undefined
	}

	onMount(() => {
		if (hasSelected) {
			view.step = 1
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
			<CommentsIcon />
			{#if !hasSelected}
				<span>{L.selectTextOrImage()}</span>
			{/if}
			{#if isSelectedImage(content)}
				{#if content.image && content.image.length > 0}
					<span>{L.imageSelected()}</span>
				{:else}
					<button class="btn">{L.selectImage()}</button>
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
		{#if !hasSelected}
			<textarea
				id="selected-text"
				onchange={createFromNewText}
				class="textarea"
				rows="4"
				placeholder={L.selectedText()}
			></textarea>

			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
		{:else if isSelectedText(unifiedStorage.value.selectedContent)}
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
					class="w-max-full mx-auto max-h-[300px]"
				/>
			{:else}
				<button class="btn cursor-pointer" onclick={selectImageOnPage}>
					{L.pleaseSelectImage()}
				</button>
			{/if}
		{/if}
		<div class="grid grid-cols-[1fr_1fr_32px] justify-around gap-2">
			<button
				onclick={selectTextOnPage}
				class="variant-filled btn btn-sm flex cursor-pointer items-center gap-1"
			>
				<TextIcon />
				{L.selectText()}
			</button>
			<button
				onclick={selectImageOnPage}
				class="variant-filled btn btn-sm flex cursor-pointer items-center gap-1"
			>
				<ImageIcon />
				{L.selectImage()}
			</button>
			<button onclick={reset} class="variant-filled btn btn-sm cursor-pointer"><CloseIcon /></button
			>
		</div>
	{/snippet}
</AccordionItem>
