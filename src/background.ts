/// <reference types="chrome" />

import en from './i18n/en'
import de from './i18n/de'
import es from './i18n/es'
import fr from './i18n/fr'
import pt from './i18n/pt'

type Locale = 'en' | 'de' | 'es' | 'fr' | 'pt'

function getTranslations() {
	const uiLang = chrome.i18n.getUILanguage()
	if (uiLang.startsWith('de')) return de
	if (uiLang.startsWith('es')) return es
	if (uiLang.startsWith('fr')) return fr
	if (uiLang.startsWith('pt')) return pt
	return en
}

const L = getTranslations()

let isRecording = false
let recordingTabId: number | null = null

// Restore state
chrome.storage.local.get(['isRecording', 'recordingTabId'], async (result) => {
	// If the extension is reloaded, the offscreen document is dead and media streams are closed.
	// So any persisted "isRecording" state is actually invalid.
	// We should reset it to ensure the UI is consistent.
	if (result.isRecording) {
		console.log('Fact Check: Resetting recording state on reload')
		await chrome.storage.local.set({ isRecording: false, recordingTabId: null })
		chrome.action.setBadgeText({ text: '' })
	}
	// Update visibility instead of recreating
	updateRecordingMenuState()
})

function createContextMenus() {
	chrome.contextMenus.removeAll(() => {
		chrome.contextMenus.create({
			id: 'fact-check-image',
			title: L.contextMenuImage,
			contexts: ['image'],
		})
		chrome.contextMenus.create({
			id: 'fact-check-text',
			title: L.contextMenuText,
			contexts: ['selection'],
		})
		chrome.contextMenus.create({
			id: 'fact-check-text-context',
			title: L.contextMenuContext,
			contexts: ['selection'],
		})

		// Audio Recording Items
		chrome.contextMenus.create({
			id: 'start-audio-recording',
			title: 'Start Audio Recording',
			contexts: ['all'],
			visible: !isRecording,
		})
		chrome.contextMenus.create({
			id: 'stop-audio-recording',
			title: 'Stop Audio Recording',
			contexts: ['all'],
			visible: isRecording,
		})
	})
}

function updateRecordingMenuState() {
	chrome.contextMenus.update('start-audio-recording', { visible: !isRecording }, () => {
		if (chrome.runtime.lastError) {
			// Ignore error if menu doesn't exist yet (e.g. race condition or not installed yet)
		}
	})
	chrome.contextMenus.update('stop-audio-recording', { visible: isRecording }, () => {
		if (chrome.runtime.lastError) {
			// Ignore error
		}
	})
}

let creating: Promise<void> | null = null
async function setupOffscreenDocument(path: string) {
	if (!chrome.offscreen) return
	if (await chrome.offscreen.hasDocument()) return
	if (creating) {
		await creating
	} else {
		creating = chrome.offscreen.createDocument({
			url: path,
			reasons: [chrome.offscreen.Reason.AUDIO_PLAYBACK, chrome.offscreen.Reason.USER_MEDIA],
			justification: 'Recording from tab',
		})
		await creating
		creating = null
	}
}

chrome.runtime.onInstalled.addListener(() => {
	console.log(L.extensionInstalled)
	createContextMenus()
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === 'TRANSCRIPTION_STATUS') {
		if (message.status === 'recording') {
			chrome.action.setBadgeText({ text: 'REC' })
			chrome.action.setBadgeBackgroundColor({ color: '#FF0000' })
		} else if (message.status === 'stopped') {
			chrome.action.setBadgeText({ text: '' })
			isRecording = false
			recordingTabId = null
			chrome.storage.local.set({ isRecording: false, recordingTabId: null })
			updateRecordingMenuState()
		}
	}
	// We allow other listeners to handle TRANSCRIPTION_RESULT
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
	if (info.menuItemId === 'fact-check-image') {
		try {
			// @ts-ignore - openPopup might not be in type definitions yet
			await chrome.action.openPopup()
		} catch (err) {
			console.warn('Failed to open popup, falling back to content script notification', err)
			if (tab?.id) {
				chrome.tabs.sendMessage(
					tab.id,
					{
						action: 'contextMenuImageSelected',
						src: info.srcUrl,
					},
					(response) => {
						if (chrome.runtime.lastError) {
							console.warn('Could not send message to tab:', chrome.runtime.lastError.message)
						}
					},
				)
			}
		}
		if (chrome.storage.session) {
			await chrome.storage.session.set({ pendingContextMenuImage: info.srcUrl })
		} else {
			await chrome.storage.local.set({ pendingContextMenuImage: info.srcUrl })
		}
	} else if (info.menuItemId === 'fact-check-text') {
		try {
			// @ts-ignore
			await chrome.action.openPopup()
		} catch (err) {
			console.warn('Failed to open popup', err)
		}
		if (chrome.storage.session) {
			await chrome.storage.session.set({ pendingContextMenuText: info.selectionText })
		} else {
			await chrome.storage.local.set({ pendingContextMenuText: info.selectionText })
		}
	} else if (info.menuItemId === 'fact-check-text-context') {
		try {
			// @ts-ignore
			await chrome.action.openPopup()
		} catch (err) {
			console.warn('Failed to open popup', err)
		}
		if (chrome.storage.session) {
			await chrome.storage.session.set({ pendingContextMenuContext: info.selectionText })
		} else {
			await chrome.storage.local.set({ pendingContextMenuContext: info.selectionText })
		}
	} else if (info.menuItemId === 'start-audio-recording') {
		if (tab?.id) {
			recordingTabId = tab.id
			isRecording = true
			await chrome.storage.local.set({ isRecording: true, recordingTabId: tab.id })
			updateRecordingMenuState()

			if (chrome.offscreen) {
				await setupOffscreenDocument('offscreen.html')

				// Get the stream ID here in the background script
				chrome.tabCapture.getMediaStreamId({ targetTabId: tab.id }, (streamId) => {
					if (chrome.runtime.lastError) {
						console.error('Error getting stream ID:', chrome.runtime.lastError)
						return
					}

					// Get the preferred language
					chrome.storage.local.get(['transcriptionLanguage'], (result) => {
						const language = result.transcriptionLanguage
							? JSON.parse(result.transcriptionLanguage)
							: 'en'

						// Send the stream ID to the offscreen document
						setTimeout(() => {
							chrome.runtime.sendMessage({
								type: 'START_RECORDING',
								targetTabId: tab.id,
								streamId: streamId,
								language: language,
							})
						}, 500)
					})
				})
			} else {
				console.warn('Offscreen API not available')
			}

			try {
				// @ts-ignore
				await chrome.action.openPopup()
			} catch (e) {}
		}
	} else if (info.menuItemId === 'stop-audio-recording') {
		// Check if offscreen exists before sending message
		const hasOffscreen = await chrome.offscreen.hasDocument()
		if (hasOffscreen) {
			chrome.runtime.sendMessage({ type: 'STOP_RECORDING' })
		} else {
			// If no offscreen, force stop immediately
			console.warn('Offscreen document not found, forcing stop state')
			chrome.action.setBadgeText({ text: '' })
			isRecording = false
			recordingTabId = null
			chrome.storage.local.set({ isRecording: false, recordingTabId: null })
			updateRecordingMenuState()
		}
		// State update happens when we receive 'stopped' status normally
	}
})
