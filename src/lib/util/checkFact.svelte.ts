import apiRequest from '../state/apiRequest.svelte'
import endpoints from '../state/endpoints.svelte'
import view from '../state/view.svelte'
import handleStreamResponse from './handleStreamResponse.svelte'
import roles from './roles.svelte'
import unifiedStorage from './unifiedStorage.svelte'

export default async function checkFact() {
	if (!endpoints.selected || !apiRequest.roleKey) {
		view.step = 1
		return
	}
	view.step = 2

	await unifiedStorage.setLastUsed(endpoints.selected.title)
	await unifiedStorage.setLastRoleKey(apiRequest.roleKey)
	apiRequest.loading = true
	apiRequest.result = ''

	const role = roles.find((r) => r[0] === apiRequest.roleKey)
	if (!role) {
		throw new Error(`Unknown role key: ${apiRequest.roleKey}`)
	}

	const requestBody = {
		model: endpoints.selected.model,
		stream: true,
		messages: [
			{
				role: 'system',
				content: `${role[2]}. Your answer should be around ${apiRequest.range} words in length.`,
			},
			{
				role: 'user',
				content: apiRequest.selectedText,
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

		if (!response.ok) {
			throw new Error(`HTTP-Fehler! Status: ${response.status}`)
		}

		handleStreamResponse(response)
	} catch (err: unknown) {
		// TODO
		apiRequest.result = 'Error during fact check: ' + (err as Error).message
	} finally {
		apiRequest.loading = false
	}
}
