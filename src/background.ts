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

function updateContextMenus() {
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
	})
}

chrome.runtime.onInstalled.addListener(() => {
	updateContextMenus()
})

updateContextMenus()

chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === 'fact-check-image') {
		// Save pending image to storage (fire-and-forget, don't await)
		// This must happen before openPopup to ensure data is available
		const storage = chrome.storage.session || chrome.storage.local
		storage.set({ pendingContextMenuImage: info.srcUrl }).catch((err) => {
			console.error('Failed to save pending image:', err)
		})

		// Open popup synchronously (required for Firefox user gesture context)
		chrome.action.openPopup().catch((err) => {
			// Fallback if openPopup fails
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
		})
	} else if (info.menuItemId === 'fact-check-text') {
		// Save pending text to storage (fire-and-forget, don't await)
		// This must happen before openPopup to ensure data is available
		const storage = chrome.storage.session || chrome.storage.local
		storage.set({ pendingContextMenuText: info.selectionText }).catch((err) => {
			console.error('Failed to save pending text:', err)
		})

		// Open popup synchronously (required for Firefox user gesture context)
		chrome.action.openPopup().catch((err) => {
			console.warn('Failed to open popup', err)
		})
	} else if (info.menuItemId === 'fact-check-text-context') {
		// Save pending context to storage (fire-and-forget, don't await)
		// This must happen before openPopup to ensure data is available
		const storage = chrome.storage.session || chrome.storage.local
		storage.set({ pendingContextMenuContext: info.selectionText }).catch((err) => {
			console.error('Failed to save pending context:', err)
		})

		// Open popup synchronously (required for Firefox user gesture context)
		chrome.action.openPopup().catch((err) => {
			console.warn('Failed to open popup', err)
		})
	}
})
