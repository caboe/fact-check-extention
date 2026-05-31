export type SelectedImage = {
	image: string
}

export type SelectedText = {
	text: string
}

export type ContentItem =
	| { type: 'image'; image: string }
	| { type: 'text'; text: string }

export type SelectedMixed = {
	content: ContentItem[]
}

export type SelectedContent = SelectedImage | SelectedText | SelectedMixed | undefined

export function isSelectedImage(content: SelectedContent | null): content is SelectedImage {
	if (!content) return false
	return 'image' in content
}

export function isSelectedText(content: SelectedContent | null): content is SelectedText {
	if (!content) return false
	return 'text' in content
}

export function isSelectedMixed(content: SelectedContent | null): content is SelectedMixed {
	if (!content) return false
	return 'content' in content && Array.isArray(content.content)
}
