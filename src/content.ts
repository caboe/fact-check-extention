/// <reference types="chrome" />

import type { SelectedContent } from './TSelectedContent'
import { processImage } from './lib/util/imageProcessing'

let image: string | null = null
let imageSelectActive = false

const suppressEvents = ['mousedown', 'mouseup', 'pointerdown', 'pointerup', 'touchstart', 'touchend']

const suppressHandler = (event: Event) => {
	event.stopPropagation()
	event.preventDefault()
}

function addImageSelectStyles() {
	if (document.getElementById('dynamic-img-hover')) return
	const style = document.createElement('style')
	style.id = 'dynamic-img-hover'
	style.textContent = `
		img {
			cursor: crosshair !important;
		}
		img:hover {
			box-shadow: 0 0 1px 1px red !important;
			transition: box-shadow 0.15s ease;
			will-change: box-shadow;
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

	setTimeout(() => {
		if (document.body.contains(notificationBox)) {
			document.body.removeChild(notificationBox)
		}
	}, 3000)
}

function removeImageSelectListeners() {
	suppressEvents.forEach((event) => {
		document.removeEventListener(event, suppressHandler)
	})
	document.removeEventListener('click', imageClickHandler)
	imageSelectActive = false
}

function addImageSelectListeners() {
	if (imageSelectActive) {
		removeImageSelectListeners()
	}
	imageSelectActive = true
	suppressEvents.forEach((event) => {
		document.addEventListener(event, suppressHandler)
	})
	document.addEventListener('click', imageClickHandler)
}

const imageClickHandler = async (event: MouseEvent) => {
	event.stopPropagation()
	event.preventDefault()

	const target = event.target as HTMLElement
	if (target.tagName === 'IMG') {
		try {
			image = await processImage((target as HTMLImageElement).src)
			showNotification('image copied to extension')
		} catch (err) {
			console.error('Fact Check: Failed to process image', err)
			showNotification('Failed to process image')
		}

		removeImageHoverStyles()
		removeImageSelectListeners()

		try {
			chrome.runtime.sendMessage({ action: 'imageSelected' })
		} catch (e) {
			console.warn('Fact Check: Failed to send message to extension (context may be invalidated)', e)
		}
	}
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'enableImageSelect') {
		addImageSelectStyles()
		addImageSelectListeners()
		sendResponse(true)
		return true
	}
	if (request.action === 'disableImageSelect') {
		removeImageHoverStyles()
		removeImageSelectListeners()
		image = null
		sendResponse(true)
		return true
	}
	if (request.action === 'enableTextSelect') {
		image = null
		sendResponse(true)
		return true
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
		return true
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
