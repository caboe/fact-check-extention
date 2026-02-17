/// <reference types="chrome" />

import type { SelectedContent } from './TSelectedContent'
import { processImage } from './lib/util/imageProcessing'

let image: string | null = null

const suppessEvents = ['mousedown', 'mouseup', 'pointerdown', 'pointerup', 'touchstart', 'touchend']
const noop = (event: Event) => {
	event.stopPropagation()
	event.preventDefault()
}

function addImageSelectStyles() {
	if (document.getElementById('dynamic-img-hover')) return
	const style = document.createElement('style')
	style.id = 'dynamic-img-hover' // Eindeutige ID für spätere Referenz
	style.textContent = `
	  img {
	  	cursor: crosshair !important;
	  }
	  img:hover {
	  	box-shadow: 0 0 1px 1px red !important;
		z-index: 99999 !important; 
		transition: all 0.3s; 
	  }
	`
	document.head.appendChild(style)
}

function removeImageHoverStyles() {
	const styleElement = document.getElementById('dynamic-img-hover')
	if (styleElement) {
		styleElement.remove()
	}
}

function showNotification(message: string) {
	const notificationBox = document.createElement('div')
	notificationBox.style.position = 'fixed'
	notificationBox.style.top = '20px'
	notificationBox.style.right = '20px'
	notificationBox.style.padding = '8px 16px'
	notificationBox.style.backgroundColor = '#f8f9fa'
	notificationBox.style.border = '2px solid #333'
	notificationBox.style.borderRadius = '9999px'
	notificationBox.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)'
	notificationBox.style.zIndex = '10000'
	notificationBox.style.fontSize = '18px'
	notificationBox.style.fontWeight = 'bold'
	notificationBox.style.fontFamily = 'Arial, sans-serif'
	notificationBox.style.color = '#333'
	notificationBox.textContent = message

	document.body.appendChild(notificationBox)

	// Auto-remove after 3 seconds
	setTimeout(() => {
		if (document.body.contains(notificationBox)) {
			document.body.removeChild(notificationBox)
		}
	}, 3000)
}

const imageClickHandler = async (event: MouseEvent) => {
	// Always prevent default behavior for any click during image selection mode
	event.stopPropagation()
	event.preventDefault()

	const target = event.target as HTMLElement
	if (target.tagName === 'IMG') {
		image = await processImage((target as HTMLImageElement).src)

		showNotification('image copied to extension')

		removeImageHoverStyles()
		if (imageClickHandler) {
			document.removeEventListener('click', imageClickHandler)
		}
		// Notify the extension that image was selected
		chrome.runtime.sendMessage({ action: 'imageSelected' })
	}
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'enableImageSelect') {
		addImageSelectStyles()

		// Remove potential existing listeners to avoid duplicates
		suppessEvents.forEach((event) => {
			document.removeEventListener(event, noop)
		})
		document.removeEventListener('click', imageClickHandler)

		suppessEvents.forEach((event) => {
			document.addEventListener(event, noop)
		})
		document.addEventListener('click', imageClickHandler)
		sendResponse(true)
		return true // Keep the message channel open for async response
	}
	if (request.action === 'disableImageSelect') {
		removeImageHoverStyles()

		image = null
		if (imageClickHandler) {
			document.removeEventListener('click', imageClickHandler)
			suppessEvents.forEach((event) => {
				document.removeEventListener(event, noop)
			})
		}
		sendResponse(true)
		return true // Keep the message channel open for async response
	}
	if (request.action === 'enableTextSelect') {
		image = null
		sendResponse(true)
		return true // Keep the message channel open for async response
	}
	if (request.action === 'getSelectedContent') {
		let selectedContent: SelectedContent = undefined
		const text = window.getSelection()?.toString()
		if (image) {
			selectedContent = { image }
		} else if (text) {
			selectedContent = { text }
		}

		sendResponse(selectedContent)
		return true // Keep the message channel open for async response
	}

	if (request.action === 'contextMenuImageSelected') {
		processImage(request.src)
			.then((base64) => {
				image = base64
				showNotification('image copied to extension')
				sendResponse(true)
			})
			.catch((err) => {
				console.error('Fact Check: Failed to process context menu image', err)
				sendResponse(false)
			})
		return true
	}
})
