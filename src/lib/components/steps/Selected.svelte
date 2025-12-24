<script lang="ts">
	import { AccordionItem } from '@skeletonlabs/skeleton'
	import { onMount } from 'svelte'
	import { isSelectedImage, isSelectedText, type SelectedContent } from '../../../TSelectedContent'
	import { processImage } from '../../util/imageProcessing'
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
	let showHelp = $state(false)

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
		const checkPendingContent = async (items: Record<string, any>) => {
			const pendingImage = items?.pendingContextMenuImage
			const pendingText = items?.pendingContextMenuText
			const pendingContext = items?.pendingContextMenuContext

			if (pendingContext) {
				await chrome.storage.session.remove('pendingContextMenuContext')
				unifiedStorage.value.contextEnabled = true
				unifiedStorage.value.contextText = pendingContext
				unifiedStorage.value.result = undefined
				apiRequest.value.state = 'EMPTY'
				// Skip querying tab (preserve existing main content)
				return
			}

			if (pendingImage) {
				// We have a pending image, use it!
				await chrome.storage.session.remove('pendingContextMenuImage')
				try {
					const processed = await processImage(pendingImage)
					unifiedStorage.value.selectedContent = { image: processed }
					unifiedStorage.value.result = undefined
					apiRequest.value.state = 'EMPTY'
				} catch (err) {
					console.error('Failed to process pending context menu image', err)
				}
				// Skip querying tab
				return
			} else if (pendingText) {
				// We have pending text, use it!
				await chrome.storage.session.remove('pendingContextMenuText')
				unifiedStorage.value.selectedContent = { text: pendingText }
				unifiedStorage.value.result = undefined
				apiRequest.value.state = 'EMPTY'
				// Skip querying tab
				return
			}
		}

		// First check if there is a pending image or text from context menu
		const getPendingContent = async () => {
			let items: Record<string, any> = {}
			if (chrome.storage.session) {
				items = await chrome.storage.session.get([
					'pendingContextMenuImage',
					'pendingContextMenuText',
					'pendingContextMenuContext',
				])
			} else {
				items = await chrome.storage.local.get([
					'pendingContextMenuImage',
					'pendingContextMenuText',
					'pendingContextMenuContext',
				])
			}

			await checkPendingContent(items)
			// If no pending content, proceed with normal selection logic
			if (
				!items?.pendingContextMenuImage &&
				!items?.pendingContextMenuText &&
				!items?.pendingContextMenuContext
			) {
				chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
					const tab = tabs[0]
					if (tab?.id !== undefined && !isRestrictedUrl(tab.url)) {
						chrome.tabs.sendMessage(
							tab.id,
							{ action: 'getSelectedContent' },
							(response: SelectedContent) => {
								if (chrome.runtime.lastError) {
									console.warn(
										`Fact Check: Could not get selected content from tab ${tab.id} (${tab.url}): ${chrome.runtime.lastError.message}`,
									)
									return
								}
								unifiedStorage.value.result = undefined
								apiRequest.value.state = 'EMPTY'
								unifiedStorage.value.selectedContent = response
							},
						)
						imageSelectOnPage(false)
						textSelectOnPage(false)
					} else if (tab?.id !== undefined && isRestrictedUrl(tab.url)) {
						// Don't try to communicate with restricted pages
					}
				})
			}
		}
		getPendingContent()

		// Listen for changes in session storage to handle race condition where popup opens before storage is set
		const listener = (changes: Record<string, chrome.storage.StorageChange>, areaName: string) => {
			if (areaName === 'session' || areaName === 'local') {
				const items: Record<string, any> = {}
				if (changes.pendingContextMenuImage?.newValue)
					items.pendingContextMenuImage = changes.pendingContextMenuImage.newValue
				if (changes.pendingContextMenuText?.newValue)
					items.pendingContextMenuText = changes.pendingContextMenuText.newValue
				if (changes.pendingContextMenuContext?.newValue)
					items.pendingContextMenuContext = changes.pendingContextMenuContext.newValue

				if (Object.keys(items).length > 0) {
					checkPendingContent(items)
				}
			}
		}
		chrome.storage?.onChanged.addListener(listener)

		return () => {
			chrome.storage?.onChanged.removeListener(listener)
		}
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
		apiRequest.value.state = 'EMPTY'
	}

	function reset() {
		unifiedStorage.value.selectedContent = { text: '' }
		unifiedStorage.value.result = undefined
		apiRequest.value.state = 'EMPTY'
		unifiedStorage.value.contextEnabled = false
		unifiedStorage.value.contextText = ''
	}

	function toggleContext() {
		// unifiedStorage.value.contextEnabled = !unifiedStorage.value.contextEnabled
		if (!unifiedStorage.value.contextEnabled) {
			unifiedStorage.value.contextText = ''
		}
		unifiedStorage.value.result = undefined
		apiRequest.value.state = 'EMPTY'
	}

	function contextChange(event: Event) {
		const target = event.target as HTMLTextAreaElement
		unifiedStorage.value.contextText = target.value
		unifiedStorage.value.result = undefined
		apiRequest.value.state = 'EMPTY'
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
		apiRequest.value.state = 'EMPTY'
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
			class="text-md grid grid-cols-[auto_1fr] items-center gap-4 text-left font-bold"
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
		<!-- Context Section -->
		<div class="mb-4">
			<label class="mb-2 flex items-center gap-2">
				<input
					type="checkbox"
					class="checkbox"
					bind:checked={unifiedStorage.value.contextEnabled}
					onchange={toggleContext}
				/>
				<span class="text-sm font-medium">Add Context</span>
			</label>
			{#if unifiedStorage.value.contextEnabled}
				<textarea
					id="context-text"
					value={unifiedStorage.value.contextText}
					onchange={contextChange}
					class="textarea max-h-64 min-h-24"
					rows="1"
					data-testid="response-result-textarea"
					placeholder={L.contextPlaceholder()}
				></textarea>
			{/if}
		</div>

		{#if !hasSelected}
			<textarea
				id="selected-text"
				oninput={createFromNewText}
				class="textarea min-h-24"
				rows="4"
				placeholder={L.selectedText()}
				data-testid="selected-text-input"
			></textarea>

			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
		{:else if isSelectedText(unifiedStorage.value.selectedContent)}
			<textarea
				id="selected-text"
				value={unifiedStorage.value.selectedContent.text}
				oninput={textChange}
				class="textarea"
				rows="4"
				placeholder={L.selectedText()}
				data-testid="selected-text-input"
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

		<div class="flex items-center justify-between gap-2">
			<button
				onclick={() => (showHelp = true)}
				class="cursor-pointer text-sm text-primary-500 underline hover:text-primary-700"
			>
				{L.howToSelect()}
			</button>
			<button onclick={reset} class="btn btn-sm p-0"><CloseIcon /></button>
		</div>

		{#if showHelp}
			<div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
				<div class="card bg-surface-100-800-token w-full max-w-md space-y-4 p-4 shadow-xl">
					<h3 class="h3">{L.selectionHelpTitle()}</h3>
					<p>{L.selectionHelpText()}</p>
					<ul class="list-disc space-y-2 pl-4">
						<li>{L.selectionHelpStep1()}</li>
						<li>{L.selectionHelpStep2()}</li>
						<li>{L.selectionHelpStep3()}</li>
					</ul>
					<div class="flex justify-end">
						<button class="variant-filled-primary btn" onclick={() => (showHelp = false)}>
							{L.closeHelp()}
						</button>
					</div>
				</div>
			</div>
		{/if}
	{/snippet}
</AccordionItem>
