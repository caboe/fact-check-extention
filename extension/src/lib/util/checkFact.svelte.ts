import { isSelectedImage, isSelectedText } from '../../TSelectedContent'
import apiRequest from '../state/apiRequest.svelte'
import endpoints from '../state/endpoints.svelte'
import view from '../state/view.svelte'
import getSystemRole from './getSystemRole.svelte'
import handleStreamResponse from './handleStreamResponse.svelte'
import unifiedStorage from './unifiedStorage.svelte'

export default async function checkFact() {
	if (!endpoints.value.selected) {
		view.step = 1
		return
	}
	view.step = 2

	unifiedStorage.value.lastUsed = endpoints.value.selected.title
	apiRequest.value.state = 'LOADING'
	unifiedStorage.value.result = undefined

	type Content =
		| string
		| {
				type: string
				image_url: {
					url: string
				}
		  }[]
		| null

	let content: Content = null

	if (isSelectedImage(unifiedStorage.value.selectedContent)) {
		content = [
			{
				type: 'image_url',
				image_url: {
					url: unifiedStorage.value.selectedContent.image,
				},
			},
		]
	}

	if (isSelectedText(unifiedStorage.value.selectedContent)) {
		content = unifiedStorage.value.selectedContent.text
	}

	if (!content) throw new Error('No content selected')

	type RequestBody = {
		model?: string
		stream?: boolean
		messages?: {
			role: 'user' | 'system'
			content: Content
		}[]
		input?: {
			prompt: string
		}
	}

	async function fetchModel(): Promise<Response> {
		if (!endpoints.value.selected) throw new Error('No endpoint selected')

		const requestBody: RequestBody = {
			model: endpoints.value.selected.model,
			stream: true,
			messages: [
				{
					role: 'system',
					content: getSystemRole(unifiedStorage.value.person, apiRequest.value.range),
				},
				{
					role: 'user',
					content,
				},
			],
		}

		return await fetch(endpoints.value.selected.url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${endpoints.value.selected.apiKey}`,
			},
			body: JSON.stringify(requestBody),
		})
	}

	try {
		const response = await fetchModel()
		if (response.status === 403) {
			unifiedStorage.value!.result =
				'Forbidden! If you are using Ollame, try to start it with "OLLAMA_ORIGINS=chrome-extension://* ollama serve"'
			return
		}
		if (!response.ok) {
			unifiedStorage.value.result = undefined
			try {
				const errorResponse = await response.json()
				const message =
					errorResponse[0]?.error?.message || errorResponse.error?.message || errorResponse.message
				if (message) {
					unifiedStorage.value.result = message
					return
				}
			} catch (e) {
				unifiedStorage.value.result = `HTTP-Error!  ${e}`
			}
			return
		}

		await handleStreamResponse(response)
	} catch (err: unknown) {
		// TODO
		unifiedStorage.value.result = 'Error during fact check: ' + (err as Error).message
		apiRequest.value.state = 'ERROR'
	}
}
