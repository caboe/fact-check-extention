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

			for (const rawLine of lines) {
				if (rawLine.trim() === '') continue
				// TODO: For unknown resaons, ChatGPT needs thsi
				const line = rawLine.replace('data: ', '')

				const parsed = await JSON.parse(line)
				if (!parsed) continue

				if (parsed.choices?.[0].finish_reason) break
				try {
					if (parsed.message) {
						resultText += parsed.message.content
					} else if (parsed.choices[0].delta.content) {
						resultText += parsed.choices[0].delta.content
					}
				} catch (e) {
					console.error('Parsing error:', e)
				}
			}
		}
		apiRequest.result = resultText
	}
}
