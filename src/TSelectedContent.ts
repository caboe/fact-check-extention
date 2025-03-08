export type SelectedImage = {
	image: string
}

export type SelectedText = {
	text: string
}

export type SelectedContent = SelectedImage | SelectedText | undefined

export function isSelectedImage(content: SelectedContent | null): content is SelectedImage {
	if (!content) return false
	return 'image' in content
}

export function isSelectedText(content: SelectedContent | null): content is SelectedText {
	if (!content) return false
	return 'text' in content
}
