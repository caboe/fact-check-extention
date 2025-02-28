/// <reference types="chrome" />

import { SelectedContent } from './TSelectedContent'

let image: string | null = null

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'getSelectedContent') {
		const selectedContent: SelectedContent = image
			? { image }
			: { text: window.getSelection()?.toString() || '' }

		sendResponse(selectedContent)
	}
})

// Add event listener for image clicks
document.addEventListener('click', async (event) => {
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
		notificationBox.style.padding = '15px'
		notificationBox.style.backgroundColor = '#f8f9fa'
		notificationBox.style.border = '1px solid #dee2e6'
		notificationBox.style.borderRadius = '4px'
		notificationBox.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)'
		notificationBox.style.zIndex = '10000'
		notificationBox.textContent = 'image copied to extention'

		// Add close button
		const closeButton = document.createElement('span')
		closeButton.textContent = '×'
		closeButton.style.position = 'absolute'
		closeButton.style.top = '5px'
		closeButton.style.right = '10px'
		closeButton.style.cursor = 'pointer'
		closeButton.style.fontSize = '16px'
		closeButton.onclick = () => document.body.removeChild(notificationBox)

		notificationBox.appendChild(closeButton)
		document.body.appendChild(notificationBox)

		// Auto-remove after 3 seconds
		setTimeout(() => {
			if (document.body.contains(notificationBox)) {
				document.body.removeChild(notificationBox)
			}
		}, 3000)
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
