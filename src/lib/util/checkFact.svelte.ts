import apiRequest from '../state/apiRequest.svelte'
import endpoints from '../state/endpoints.svelte'
import view from '../state/view.svelte'
import roles from './roles.svelte'
import unifiedStorage from './unifiedStorage.svelte'

interface ApiRequestPrompt {
	prompt: string
}
interface ApiRequestMessage {
	messages: { role: string; content: string }[]
}
type ApiRequestBody = { model: string } & (ApiRequestPrompt | ApiRequestMessage)

export default async function checkFact() {
	if (!endpoints.selected) {
		view.step = 1
		return
	}
	view.step = 2

	unifiedStorage.setLastUsed(endpoints.selected.title)
	apiRequest.loading = true
	apiRequest.result = ''

	const role = roles.find((r) => r[0] === apiRequest.roleKey)
	if (!role) {
		throw new Error(`Unknown role key: ${apiRequest.roleKey}`)
	}

	let requestBody: ApiRequestBody

	if (endpoints.selected.isStream) {
		requestBody = {
			model: endpoints.selected.model,
			prompt: `${apiRequest.selectedText}\n\n${role[2]} Your answer should be around ${apiRequest.range} words in length.`,
		}
	} else {
		requestBody = {
			model: endpoints.selected.model,
			messages: [
				{
					role: 'system',
					content: `${role[2]} Your answer should be around ${apiRequest.range} words in length.`,
				},
				{ role: 'user', content: apiRequest.selectedText },
			],
		}
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

		if (endpoints.selected.isStream) {
			const reader = response.body!.getReader()
			const decoder = new TextDecoder('utf-8')
			let resultText = ''
			let done = false
			let buffer = ''

			while (!done) {
				const { value, done: readerDone } = await reader.read()
				done = readerDone
				if (value) {
					const chunk = decoder.decode(value, { stream: true })
					buffer += chunk

					const lines = buffer.split('\n')
					buffer = lines.pop()! // Die letzte Zeile könnte unvollständig sein

					for (const line of lines) {
						if (line.trim() === '') continue
						try {
							const parsed = JSON.parse(line)
							if (parsed && parsed.response) {
								resultText += parsed.response
							}
						} catch (e) {
							console.error('Parsing error:', e)
						}
					}
				}
			}
			apiRequest.result = resultText
		} else {
			// Verarbeitung für JSON-Response
			const data = await response.json()
			apiRequest.result = data.choices[0].message.content
		}
	} catch (err: unknown) {
		// TODO
		apiRequest.result = 'Error during fact check: ' + (err as Error).message
	} finally {
		apiRequest.loading = false
	}
}
