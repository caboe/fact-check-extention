/// <reference types="chrome" />

import { SelectedContent } from './TSelectedContent'

let image: string | null = null

const suppessEvents = ['mousedown', 'mouseup', 'pointerdown', 'pointerup', 'touchstart', 'touchend']
const noop = (event: Event) => {
	event.stopPropagation()
	event.preventDefault()
}

const imageClickHandler = async (event: MouseEvent) => {
	// Always prevent default behavior for any click during image selection mode
	event.stopPropagation()
	event.preventDefault()

	const target = event.target as HTMLElement
	if (target.tagName === 'IMG') {
		image = await processImage((target as HTMLImageElement).src)

		// Create and show notification box
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
		notificationBox.textContent = 'image copied to extention'

		document.body.appendChild(notificationBox)

		// Auto-remove after 3 seconds
		setTimeout(() => {
			if (document.body.contains(notificationBox)) {
				document.body.removeChild(notificationBox)
			}
		}, 3000)

		// Disable image select mode after selection
		document.body.style.cursor = ''
		if (imageClickHandler) {
			document.removeEventListener('click', imageClickHandler)
		}
		// Notify the extension that image was selected
		chrome.runtime.sendMessage({ action: 'imageSelected' })
	}
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log('content.js received message', request)

	if (request.action === 'enableImageSelect') {
		document.body.style.cursor = 'crosshair'

		suppessEvents.forEach((event) => {
			document.addEventListener(event, noop)
		})
		document.addEventListener('click', imageClickHandler)
	}
	if (request.action === 'disableImageSelect') {
		document.body.style.cursor = ''
		image = null
		if (imageClickHandler) {
			document.removeEventListener('click', imageClickHandler)
			suppessEvents.forEach((event) => {
				document.removeEventListener(event, noop)
			})
		}
	}
	if (request.action === 'enableTextSelect') {
		image = null
	}
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log('content.js received message', request)

	if (request.action === 'getSelectedContent') {
		let selectedContent: SelectedContent = undefined
		const text = window.getSelection()?.toString()
		if (image) {
			selectedContent = { image }
		} else if (text) {
			selectedContent = { text }
		}

		sendResponse(selectedContent)
	}
})

function processImage(src: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const img = new Image()
		img.crossOrigin = 'anonymous'

		img.onload = () => {
			// Calculate new dimensions while maintaining aspect ratio
			let width = img.width
			let height = img.height
			const maxSize = 512

			if (width > maxSize || height > maxSize) {
				if (width > height) {
					height = Math.round(height * (maxSize / width))
					width = maxSize
				} else {
					width = Math.round(width * (maxSize / height))
					height = maxSize
				}
			}

			// Create canvas and resize image
			const canvas = document.createElement('canvas')
			canvas.width = width
			canvas.height = height
			const ctx = canvas.getContext('2d')

			if (!ctx) {
				reject(new Error('Could not get canvas context'))
				return
			}

			ctx.drawImage(img, 0, 0, width, height)

			// Convert to base64
			const base64Data = canvas.toDataURL('image/jpeg')

			resolve(base64Data)
		}

		img.onerror = () => {
			reject(new Error('Failed to load image'))
		}

		img.src = src
	})
}
