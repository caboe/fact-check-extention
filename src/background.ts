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
	console.log(L.extensionInstalled)
	updateContextMenus()
})

updateContextMenus()

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
	if (info.menuItemId === 'fact-check-image') {
		try {
			// @ts-ignore - openPopup might not be in type definitions yet
			await chrome.action.openPopup()
		} catch (err) {
			// Fallback if openPopup is not supported or fails
			console.warn('Failed to open popup, falling back to content script notification', err)

			if (tab?.id) {
				chrome.tabs.sendMessage(tab.id, {
					action: 'contextMenuImageSelected',
					src: info.srcUrl,
				}, (response) => {
		            if (chrome.runtime.lastError) {
		                console.warn('Could not send message to tab:', chrome.runtime.lastError.message);
		            }
		        })
			}
		}
		// Save pending image to session storage
		await chrome.storage.session.set({ pendingContextMenuImage: info.srcUrl })
	} else if (info.menuItemId === 'fact-check-text') {
		try {
			// @ts-ignore - openPopup might not be in type definitions yet
			await chrome.action.openPopup()
		} catch (err) {
			console.warn('Failed to open popup', err)
		}
		// Save pending text to session storage
		await chrome.storage.session.set({ pendingContextMenuText: info.selectionText })
	} else if (info.menuItemId === 'fact-check-text-context') {
		try {
			// @ts-ignore
			await chrome.action.openPopup()
		} catch (err) {
			console.warn('Failed to open popup', err)
		}
		await chrome.storage.session.set({ pendingContextMenuContext: info.selectionText })
	}
})
