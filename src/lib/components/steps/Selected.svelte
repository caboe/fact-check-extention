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
	import MicIcon from '../icons/MicIcon.svelte'
	import StopIcon from '../icons/StopIcon.svelte'
	import { hasASR } from '../../util/speech/asr'
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
	}

	function contextChange(event: Event) {
		const target = event.target as HTMLTextAreaElement
		unifiedStorage.value.contextText = target.value
		unifiedStorage.value.result = undefined
	}

	let loadingModels: boolean = $state(false)
	let loadingProgress: number | undefined = $state(undefined)
	let loadingStatus: string | undefined = $state(undefined)
	let transcribing: boolean = $state(false)
	let asrError: string | undefined = $state(undefined)
	let recording: boolean = $state(false)
	let sandboxReady: boolean = $state(false)
	let asrChannel: BroadcastChannel | null = $state(null)

	onMount(() => {
		const iframe = document.createElement('iframe')
		iframe.src = chrome.runtime.getURL('sandbox.html')
		iframe.setAttribute(
			'sandbox',
			'allow-scripts allow-forms allow-popups allow-modals allow-same-origin',
		)
		iframe.setAttribute('allow', 'microphone; camera')
		iframe.style.display = 'none'
		iframe.onload = () => {}
		document.body.appendChild(iframe)
		asrChannel = new BroadcastChannel('asr-channel')
		asrChannel.onmessage = (ev: MessageEvent) => {
			const data = ev.data as any
			if (!data || data.source !== 'asr-sandbox') return
			if (data.type === 'progress') {
				loadingProgress = data.progress
				loadingStatus = data.status
			} else if (data.type === 'ready') {
				loadingModels = false
				sandboxReady = true
			} else if (data.type === 'recording-started') {
				recording = true
			} else if (data.type === 'result') {
				transcribing = false
				const mode = unifiedStorage.value.speechAppend
				const raw = typeof data.text === 'string' ? data.text : String(data.text ?? '')
				if (data.target === 'selected') {
					const prev = isSelectedText(unifiedStorage.value.selectedContent)
						? unifiedStorage.value.selectedContent.text
						: ''
					const text = mode === 'append' ? `${prev}${prev ? ' ' : ''}${raw}` : raw
					unifiedStorage.value.selectedContent = { text }
				} else {
					const prev = unifiedStorage.value.contextText || ''
					const text = mode === 'append' ? `${prev}${prev ? ' ' : ''}${raw}` : raw
					unifiedStorage.value.contextText = text
				}
				unifiedStorage.value.result = undefined
				recording = false
			} else if (data.type === 'error') {
				loadingModels = false
				transcribing = false
				asrError = data.message
				recording = false
			}
		}
	})

	function isRecording() {
		return recording
	}

	async function startMic() {
		if (!unifiedStorage.value.speechEnabled) return
		if (!hasASR()) return
		if (!isRecording()) {
			loadingModels = true
			asrError = undefined
			try {
				if (!isSelectedText(unifiedStorage.value.selectedContent)) {
					unifiedStorage.value.selectedContent = { text: '' }
				}
				sandboxReady = false
				asrChannel?.postMessage({ source: 'popup', type: 'init' })
				// recording starts after init completes
				const startAfterInit = setInterval(() => {
					if (!loadingModels && sandboxReady) {
						clearInterval(startAfterInit)
						try {
							asrChannel?.postMessage({ source: 'popup', type: 'start' })
						} catch (e) {
							asrError = (e as Error)?.message || 'Microphone permission required'
						}
					}
				}, 50)
				// keep loadingModels true until sandbox signals 'ready'
			} catch (e) {
				loadingModels = false
				asrError = (e as Error)?.message || 'ASR init failed'
			}
		}
	}

	async function stopMicAndTranscribe(target: 'selected' | 'context') {
		if (!isRecording()) return
		transcribing = true
		asrChannel?.postMessage({ source: 'popup', type: 'stop', target })
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

	function copyResult() {
		if (unifiedStorage.value.result) {
			navigator.clipboard
				.writeText(unifiedStorage.value.result)
				.then(() => {
					// Optional: Show a toast or feedback
					// For now, we rely on the button text change or similar if implemented,
					// but the original code didn't seem to have specific feedback state for this button
					// other than the 'copied' translation key which might be used elsewhere.
					// Let's just log for now or assume the UI handles it if there's a state.
					// Actually, looking at the translations, there is 'copied' and 'copyError'.
					// But without a toast system in this file, we'll just copy.
				})
				.catch((err) => {
					console.error('Failed to copy: ', err)
				})
		}
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
			class="text-md grid grid-cols-[16px_1fr] items-center gap-4 text-left font-bold"
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
					class="textarea max-h-64 min-h-8"
					rows="1"
					data-testid="response-result-textarea"
					placeholder={L.contextPlaceholder()}
				></textarea>
				{#if unifiedStorage.value.speechEnabled && hasASR()}
					<div class="mt-2 flex items-center gap-2">
						{#if loadingModels}
							<span class="text-xs"
								>{L.loadingModels()}{loadingProgress !== undefined
									? ` ${Math.min(100, Math.round(loadingProgress <= 1 ? loadingProgress * 100 : loadingProgress))}%`
									: ''}</span
							>
							{#if loadingStatus}
								<span class="text-xs">{loadingStatus}</span>
							{/if}
						{:else if isRecording()}
							<button
								class="btn-xs variant-filled btn flex items-center gap-1"
								onclick={() => stopMicAndTranscribe('context')}
								data-testid="context-speech-stop-btn"
								><StopIcon />{L.stopRecording() ?? 'Stop'}</button
							>
						{:else}
							<button
								class="btn-xs variant-filled-primary btn flex items-center gap-1"
								onclick={startMic}
								data-testid="context-speech-start-btn"
								><MicIcon />{L.startRecording() ?? 'Speak'}</button
							>
						{/if}
						{#if transcribing}
							<span class="text-xs">{L.transcribing()}</span>
						{/if}
					</div>
				{/if}
			{/if}
		</div>

		{#if !hasSelected}
			<textarea
				id="selected-text"
				oninput={createFromNewText}
				class="textarea"
				rows="4"
				placeholder={L.selectedText()}
				data-testid="selected-text-input"
			></textarea>
			{#if unifiedStorage.value.speechEnabled && hasASR()}
				<div class="mt-2 flex items-center gap-2">
					{#if loadingModels}
						<span class="text-xs"
							>{L.loadingModels()}{loadingProgress !== undefined
								? ` ${Math.min(100, Math.round(loadingProgress <= 1 ? loadingProgress * 100 : loadingProgress))}%`
								: ''}</span
						>
						{#if loadingStatus}
							<span class="text-xs">{loadingStatus}</span>
						{/if}
					{:else if isRecording()}
						<button
							class="btn-xs variant-filled btn flex items-center gap-1"
							onclick={() => stopMicAndTranscribe('selected')}
							data-testid="selected-speech-stop-btn"
							><StopIcon />{L.stopRecording() ?? 'Stop'}</button
						>
					{:else}
						<button
							class="btn-xs variant-filled-primary btn flex items-center gap-1"
							onclick={startMic}
							data-testid="selected-speech-start-btn"
							><MicIcon />{L.startRecording() ?? 'Speak'}</button
						>
					{/if}
					{#if transcribing}
						<span class="text-xs">{L.transcribing()}</span>
					{/if}
					{#if asrError}
						<span class="text-error text-xs">{asrError}</span>
					{/if}
				</div>
			{/if}

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
			{#if unifiedStorage.value.speechEnabled && hasASR()}
				<div class="mt-2 flex items-center gap-2">
					{#if loadingModels}
						<span class="text-xs"
							>{L.loadingModels()}{loadingProgress !== undefined
								? ` ${Math.min(100, Math.round(loadingProgress <= 1 ? loadingProgress * 100 : loadingProgress))}%`
								: ''}</span
						>
					{:else if isRecording()}
						<button
							class="btn-xs variant-filled btn flex items-center gap-1"
							onclick={() => stopMicAndTranscribe('selected')}
							data-testid="selected-speech-stop-btn"
							><StopIcon />{L.stopRecording() ?? 'Stop'}</button
						>
					{:else}
						<button
							class="btn-xs variant-filled-primary btn flex items-center gap-1"
							onclick={startMic}
							data-testid="selected-speech-start-btn"
							><MicIcon />{L.startRecording() ?? 'Speak'}</button
						>
					{/if}
					{#if transcribing}
						<span class="text-xs">{L.transcribing()}</span>
					{/if}
					{#if asrError}
						<span class="text-error text-xs">{asrError}</span>
					{/if}
				</div>
			{/if}
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
		{#if apiRequest.value.state === 'FINISHED'}
			<button
				class="variant-filled-success btn w-full"
				onclick={copyResult}
				data-testid="response-copy-btn"
			>
				{L.copy()}
			</button>
		{/if}
		<div class="grid grid-cols-[1fr_1fr_32px] justify-around gap-2">
			<button
				onclick={selectTextOnPage}
				class="variant-filled btn btn-sm flex cursor-pointer items-center gap-1"
				disabled={loadingModels || isRecording() || transcribing}
			>
				<TextIcon />
				{L.selectText()}
			</button>
			<button
				onclick={selectImageOnPage}
				class="variant-filled btn btn-sm flex cursor-pointer items-center gap-1"
				disabled={loadingModels || isRecording() || transcribing}
			>
				<ImageIcon />
				{L.selectImage()}
			</button>
			<button
				onclick={reset}
				class="variant-filled btn btn-sm cursor-pointer"
				disabled={isRecording()}><CloseIcon /></button
			>
		</div>
	{/snippet}
</AccordionItem>
