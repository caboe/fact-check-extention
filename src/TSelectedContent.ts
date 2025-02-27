export type SelectedImage = {
	image: string
}

export type SelectedText = {
	text: string
}

export type SelectedContent = SelectedImage | SelectedText

export function isSelectedImage(content: SelectedContent): content is SelectedImage {
	return 'image' in content
}

export function isSelectedText(content: SelectedContent): content is SelectedText {
	return 'text' in content
}
