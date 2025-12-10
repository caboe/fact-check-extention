/// <reference types="chrome" />

chrome.runtime.onInstalled.addListener(() => {
	console.log('Fact Check Extension installiert.')
	chrome.contextMenus.create({
		id: 'fact-check-image',
		title: 'Fact Check this image',
		contexts: ['image'],
	})
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === 'fact-check-image' && tab?.id) {
		chrome.tabs.sendMessage(tab.id, {
			action: 'contextMenuImageSelected',
			src: info.srcUrl,
		}, (response) => {
            if (chrome.runtime.lastError) {
                console.warn('Could not send message to tab:', chrome.runtime.lastError.message);
            }
        })
	}
})
