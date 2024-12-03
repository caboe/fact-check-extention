import apiRequest from '../state/apiRequest.svelte'

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

			for (const line of lines) {
				if (line.trim() === '') continue
				try {
					const parsed = JSON.parse(line)
					if (parsed && parsed.response) {
						resultText += parsed.response
					}
					if (parsed && parsed.message.content) {
						resultText += parsed.message.content
					}
				} catch (e) {
					console.error('Parsing error:', e)
				}
			}
		}
		apiRequest.result = resultText
	}
}
