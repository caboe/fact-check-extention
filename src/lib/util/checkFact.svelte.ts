import apiRequest from '../state/apiRequest.svelte'
import endpoints from '../state/endpoints.svelte'
import view from '../state/view.svelte'
import getSystemRole from './getSystemRole.svelte'
import handleStreamResponse from './handleStreamResponse.svelte'
import tone from './tone.svelte'
import unifiedStorage, { setResult } from './unifiedStorage.svelte'

export default async function checkFact() {
	if (!endpoints.selected) {
		view.step = 1
		return
	}
	view.step = 2

	await unifiedStorage.setLastUsed(endpoints.selected.title)
	// await unifiedStorage.setLastRoleKey(apiRequest.roleKey)
	apiRequest.loading = true
	apiRequest.result = ''

	const requestBody = {
		model: endpoints.selected.model,
		stream: true,
		messages: [
			{
				role: 'system',
				content: getSystemRole(tone, apiRequest.range),
			},
			{
				role: 'user',
				content: apiRequest.selectedContent,
			},
		],
	}

	try {
		const response = await fetch(endpoints.selected.url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${endpoints.selected.apiKey}`,
			},
			body: JSON.stringify(requestBody),
		})
		if (response.status === 403) {
			apiRequest.result =
				'Forbidden! If you are using Ollame, try to start it with "OLLAMA_ORIGINS=chrome-extension://* ollama serve"'
			return
		}
		if (!response.ok) {
			await setResult('')
			try {
				const errorResponse = await response.json()
				const message = errorResponse[0]?.error?.message || errorResponse.error?.message
				if (message) {
					apiRequest.result = message
					return
				}
			} catch (e) {
				apiRequest.result = `HTTP-Error!  ${e}`
			}
			return
		}

		handleStreamResponse(response)
	} catch (err: unknown) {
		// TODO
		apiRequest.result = 'Error during fact check: ' + (err as Error).message
	} finally {
		apiRequest.loading = false
	}
}
