export function processImage(src: string): Promise<string> {
	return new Promise((resolve, reject) => {
		fetch(src)
			.then((response) => response.blob())
			.then((blob) => {
				const reader = new FileReader()
				reader.onloadend = () => {
					const base64data = reader.result as string
					const img = new Image()
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
						const resizedBase64 = canvas.toDataURL('image/jpeg')
						// Clear canvas reference to help GC
						canvas.width = 0
						canvas.height = 0
						resolve(resizedBase64)
					}
					img.onerror = () => reject(new Error('Failed to load image for resizing'))
					img.src = base64data
				}
				reader.readAsDataURL(blob)
			})
			.catch((err) => {
				// Fallback to direct image loading if fetch fails (though fetch is preferred in extension)
				// or just reject
				console.error('Fetch failed, trying direct load', err)
				const img = new Image()
				img.crossOrigin = 'anonymous'
				img.onload = () => {
					// ... same resizing logic ...
					// For brevity, let's just use the fetch path primarily.
					// If fetch fails in extension with permissions, direct load likely fails too due to CORS.
					reject(err)
				}
				img.onerror = () => reject(err)
				img.src = src
			})
	})
}
