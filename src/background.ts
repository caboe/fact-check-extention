/// <reference types="chrome" />

chrome.runtime.onInstalled.addListener(() => {
	console.log('Fact Check Extension installiert.')
	chrome.contextMenus.create({
		id: 'fact-check-image',
		title: 'Fact Check this image',
		contexts: ['image'],
	})
	chrome.contextMenus.create({
		id: 'fact-check-text',
		title: 'Fact Check marked text',
		contexts: ['selection'],
	})
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
	if (info.menuItemId === 'fact-check-image') {
		// Save pending image to session storage
		await chrome.storage.session.set({ pendingContextMenuImage: info.srcUrl })
		
		try {
			// @ts-ignore - openPopup might not be in type definitions yet
			await chrome.action.openPopup()
		} catch (err) {
			// Fallback if openPopup is not supported or fails
			console.warn('Failed to open popup, falling back to content script notification', err)
			
			// Clean up storage since we failed to open popup
			await chrome.storage.session.remove('pendingContextMenuImage')

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
	} else if (info.menuItemId === 'fact-check-text') {
		// Save pending text to session storage
		await chrome.storage.session.set({ pendingContextMenuText: info.selectionText })

		try {
			// @ts-ignore - openPopup might not be in type definitions yet
			await chrome.action.openPopup()
		} catch (err) {
			console.warn('Failed to open popup', err)
			// Clean up storage since we failed to open popup
			await chrome.storage.session.remove('pendingContextMenuText')
            // Optionally notify user via content script?
            // For now just warn as text is usually easier to re-select
		}
	}
})
