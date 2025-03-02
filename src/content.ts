/// <reference types="chrome" />

import { SelectedContent } from './TSelectedContent'

let image: string | null = null
let imageClickHandler: ((event: MouseEvent) => Promise<void>) | null = null

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log('content.js received message', request)

	if (request.action === 'enableImageSelect') {
		document.body.style.cursor = 'crosshair'
		imageClickHandler = async (event) => {
			const target = event.target as HTMLElement
			if (target.tagName === 'IMG') {
				event.stopPropagation()
				event.preventDefault()
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
					imageClickHandler = null
				}
				// Notify the extension that image was selected
				chrome.runtime.sendMessage({ action: 'imageSelected' })
			}
		}
		document.addEventListener('click', imageClickHandler)
	} else if (request.action === 'disableImageSelect') {
		document.body.style.cursor = ''
		if (imageClickHandler) {
			document.removeEventListener('click', imageClickHandler)
			imageClickHandler = null
		}
	}
	if (request.action === 'getSelectedContent') {
		const selectedContent: SelectedContent = image
			? { image }
			: { text: window.getSelection()?.toString() || '' }

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
