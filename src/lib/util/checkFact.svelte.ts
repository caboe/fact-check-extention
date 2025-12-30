import { isSelectedImage, isSelectedText } from '../../TSelectedContent'
import apiRequest from '../state/apiRequest.svelte'
import endpoints from '../state/endpoints.svelte'
import ragEndpoints from '../state/ragEndpoints.svelte'
import view from '../state/view.svelte'
import getSystemRole from './getSystemRole.svelte'
import handleStreamResponse from './handleStreamResponse.svelte'
import unifiedStorage from './unifiedStorage.svelte'

let currentAbortController: AbortController | null = null

export default async function checkFact() {
	// Abort any ongoing request
	if (currentAbortController) {
		currentAbortController.abort()
		console.log('Previous fact check request aborted.')
	}

	// Create a new AbortController for this request
	currentAbortController = new AbortController()
	const signal = currentAbortController.signal

	if (!endpoints.value.selected) {
		view.step = 1
		return
	}
	view.step = 2

	// Wait for storage to be ready to avoid overwriting state
	await apiRequest.ready
	await unifiedStorage.ready
	await ragEndpoints.ready

	unifiedStorage.value.lastUsed = endpoints.value.selected.title
	apiRequest.value.state = 'LOADING'
	unifiedStorage.value.result = undefined
	unifiedStorage.value.reasoning = undefined

	type Content =
		| string
		| (
				| {
						type: 'image_url'
						image_url: {
							url: string
						}
				  }
				| {
						type: 'text'
						text: string
				  }
		  )[]
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
		max_tokens?: number
		messages?: {
			role: 'user' | 'system'
			content: Content
		}[]
		input?: {
			prompt: string
		}
	}

	async function fetchModel(signal: AbortSignal, ragContext: string = ''): Promise<Response> {
		if (!endpoints.value.selected) throw new Error('No endpoint selected')

		function getInlineContent(content: Content): string {
			let contentStr = ''
			if (typeof content === 'string') {
				contentStr = content
			} else if (Array.isArray(content)) {
				contentStr = content.map((c) => (c.type === 'text' ? c.text : '[Image]')).join('\n')
			}

			return `DEINE AUFGABE:\n
			${getSystemRole(unifiedStorage.value.selectedRole || '', apiRequest.value.range)}\n
            ${ragContext ? `\n${ragContext}\n` : ''}
			CHECKE DIE FOLGENDE AUSSAGE:\n
			${contentStr}`
		}

		const systemRoleContent =
			getSystemRole(unifiedStorage.value.selectedRole || '', apiRequest.value.range) +
			(ragContext ? `\n\n${ragContext}` : '')

		const requestBody: RequestBody = {
			model: endpoints.value.selected.model,
			stream: true,
			messages: [
				...(apiRequest.value.rolePlacement === 'system'
					? [
							{
								role: 'system' as const,
								content: systemRoleContent,
							},
						]
					: []),
				{
					role: 'user' as const,
					content:
						apiRequest.value.rolePlacement === 'inline' ? getInlineContent(content) : content,
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
			signal, // Pass the signal to fetch
		})
	}

	try {
		let ragContext = ''
		// Fetch RAG Data if configured
		if (
			unifiedStorage.value.useRag &&
			unifiedStorage.value.selectedRagEndpoints &&
			unifiedStorage.value.selectedRagEndpoints.length > 0
		) {
			apiRequest.value.state = 'FETCHING_RAG'

			let queryText = ''
			if (typeof content === 'string') {
				queryText = content
			} else if (Array.isArray(content)) {
				// Try to find text part or just use generic query if only image
				// For now, only extract text if available
				const textPart = content.find((c) => c.type === 'text')
				if (textPart && 'text' in textPart) {
					queryText = textPart.text
				}
			}

			// Only query RAG if we have enough text
			if (queryText && queryText.length >= 3) {
				const ragResults = await Promise.all(
					unifiedStorage.value.selectedRagEndpoints.map(async (title) => {
						const endpoint = ragEndpoints.value.list.find((e) => e.title === title)
						if (!endpoint) return null

						try {
							const res = await fetch(endpoint.url, {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
									'X-API-Key': endpoint.apiKey,
								},
								body: JSON.stringify({
									query: queryText,
									mode: endpoint.mode,
									top_k: endpoint.top_k,
								}),
								signal,
							})
							if (!res.ok) return null
							const data = await res.json()
							return { title: endpoint.title, data: data.data }
						} catch (e) {
							console.error('RAG fetch error', e)
							return null
						}
					}),
				)

				const validResults = ragResults.filter((r) => r !== null)
				if (validResults.length > 0) {
					ragContext = '\n\nADDITIONAL CONTEXT FROM KNOWLEDGE GRAPH:\n'
					validResults.forEach((r) => {
						ragContext += `\n--- Source: ${r!.title} ---\n`
						if (r!.data.entities && r!.data.entities.length) {
							ragContext +=
								'Entities:\n' +
								r!.data.entities
									.map((e: any) => `- ${e.entity_name}: ${e.description}`)
									.join('\n') +
								'\n'
						}
						if (r!.data.relationships && r!.data.relationships.length) {
							ragContext +=
								'Relationships:\n' +
								r!.data.relationships
									.map((rel: any) => `- ${rel.src_id} -> ${rel.tgt_id}: ${rel.description}`)
									.join('\n') +
								'\n'
						}
						if (r!.data.chunks && r!.data.chunks.length) {
							ragContext +=
								'Chunks:\n' +
								r!.data.chunks.map((c: any) => `- ${c.content_with_weight}`).join('\n') +
								'\n'
						}
					})
					// Context is now stored in ragContext and passed to fetchModel
				}
			}
		}

		apiRequest.value.state = 'LOADING' // Reset to loading before LLM call

		// Pass the signal to fetchModel
		const response = await fetchModel(signal, ragContext)

		// Check if the request was aborted before proceeding
		if (signal.aborted) {
			console.log('Fact check request aborted before handling response.')
			apiRequest.value.state = 'EMPTY' // Reset state to EMPTY
			return
		}

		if (response.status === 403) {
			unifiedStorage.value!.result =
				'Forbidden! If you are using Ollama, try to start it with in the console: <code>OLLAMA_ORIGINS=chrome-extension://* && ollama serve</code>'
			apiRequest.value.state = 'ERROR'
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
					apiRequest.value.state = 'ERROR'
					return
				}
			} catch (e) {
				unifiedStorage.value.result = `HTTP-Error!  ${e}`
			}
			return
		}

		// Pass the signal to handleStreamResponse
		await handleStreamResponse(response, signal)
	} catch (err: unknown) {
		if (err instanceof Error && err.name === 'AbortError') {
			console.log('Fact check fetch aborted:', err.message)
			// Reset state as the request was aborted.
			// The 'FINISHED' check is removed as svelte-check flags it as redundant within this AbortError catch block.
			apiRequest.value.state = 'EMPTY' // Reset state to EMPTY
			unifiedStorage.value.result = undefined // Clear potentially partial results
		} else {
			console.error('Error during fact check:', err)
			unifiedStorage.value.result = 'Error during fact check: ' + (err as Error).message
			apiRequest.value.state = 'ERROR'
		}
	} finally {
		// Clear the controller if this specific request instance finished or was aborted
		if (currentAbortController?.signal === signal) {
			currentAbortController = null
		}
	}
}
