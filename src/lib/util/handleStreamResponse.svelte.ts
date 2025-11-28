import apiRequest from '../state/apiRequest.svelte'
import unifiedStorage from './unifiedStorage.svelte'

export default async function handleStreamResponse(response: Response, signal: AbortSignal) {
	if (!response.body) {
		throw new Error('Response body is null')
	}
	const reader = response.body.getReader()
	const decoder = new TextDecoder('utf-8')
	let resultText = ''
	let reasoningText = ''
	let done = false
	let buffer = ''

	while (!done) {
		// Check for abort signal before reading
		if (signal.aborted) {
			console.log('Stream reading aborted.')
			await reader.cancel('Aborted by new request') // Cancel the reader
			done = true // Exit loop
			// Ensure state reflects cancellation if it was still loading/streaming
			if (apiRequest.value.state === 'LOADING' || apiRequest.value.state === 'STREAMING') {
				apiRequest.value.state = 'EMPTY' // Use 'EMPTY' state
				unifiedStorage.value.result = undefined // Clear partial results
			}
			break
		}

		let value: Uint8Array | undefined
		let readerDone = false

		try {
			// Read the next chunk
			;({ value, done: readerDone } = await reader.read())
			done = readerDone
		} catch (err) {
			// Handle potential errors during read, especially AbortError if fetch was cancelled
			if (err instanceof Error && err.name === 'AbortError') {
				console.log('Reader.read() aborted:', err.message)
				done = true // Ensure loop terminates
				// State should have been handled by checkFact's catch block, but ensure loop exit
			} else {
				console.error('Error reading stream:', err)
				apiRequest.value.state = 'ERROR'
				unifiedStorage.value.result = 'Error reading stream: ' + (err as Error).message
				done = true // Exit loop on other read errors
			}
			break // Exit loop on any error during read
		}

		if (value) {
			const chunk = decoder.decode(value, { stream: true })
			buffer += chunk

			const lines = buffer.split('\n')
			//last line might be incomplete
			buffer = lines.pop()!

			for (const rawLine of lines) {
				if (rawLine.trim() === '') continue
				// Ignore SSE comments
				if (rawLine.startsWith(':')) continue
				// TODO: For unknown resaons, ChatGPT needs thsi
				const line = rawLine.replace('data: ', '')

				// Skip non-JSON lines like "[DONE]"
				if (line.trim() === '[DONE]') continue

				try {
					const parsed = JSON.parse(line)

					// Handle Gemini response format
					if (parsed.candidates?.[0]?.content?.parts?.[0]?.text) {
						resultText += parsed.candidates[0].content.parts[0].text
					}
					// Fallback to OpenAI format for compatibility
					else if (parsed.choices?.[0]?.delta?.content) {
						resultText += parsed.choices[0].delta.content
					} else if (parsed.message?.content) {
						resultText += parsed.message.content
					}
					
					// Handle reasoning (OpenRouter/Gemini thinking models)
					if (parsed.choices?.[0]?.delta?.reasoning) {
						reasoningText += parsed.choices[0].delta.reasoning
					}
				} catch (e) {
					console.error('Parsing error:', e)
					continue
				}
			}
		}
		unifiedStorage.value.result = resultText
		unifiedStorage.value.reasoning = reasoningText

		// Update state based on accumulated content
		if (resultText) {
			apiRequest.value.state = 'STREAMING'
		} else if (reasoningText) {
			apiRequest.value.state = 'THINKING'
		}

		if (done) {
			apiRequest.value.state = 'FINISHED'
		}
	}
}
