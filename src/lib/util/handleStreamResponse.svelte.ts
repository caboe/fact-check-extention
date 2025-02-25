import apiRequest from '../state/apiRequest.svelte'
import { setResult } from './unifiedStorage.svelte'

export default async function handleStreamResponse(response: Response) {
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
			//last line might be incomplete
			buffer = lines.pop()!

			for (const rawLine of lines) {
				if (rawLine.trim() === '') continue
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
				} catch (e) {
					console.error('Parsing error:', e)
					continue
				}
			}
		}
		apiRequest.result = resultText
		setResult(resultText)
	}
}
