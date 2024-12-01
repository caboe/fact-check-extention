import apiRequest from '../state/apiRequest.svelte'
import endpoints from '../state/endpoints.svelte'
import view from '../state/view.svelte'
import unifiedStorage from './unifiedStorage.svelte'

export default async function checkFact() {
	if (!endpoints.selected) {
		view.step = 1
		return
	}
	view.step = 2

	unifiedStorage.setLastUsed(endpoints.selected.title)
	apiRequest.loading = true
	apiRequest.result = ''

	// const role = 'You are a climate expert who is angry that the climate catastrophe is being trivialized and therefore responds angrily, but with mentioning facts.'
	// const role = 'Du bist ein Experte und weißt auf fehlerhafte und umstrittene Fakten hin.';
	const factCheckRole =
		'You are an expert and subject the input to a critical review. You are aware of all erroneous and controversial statements in the text. You present your statement as a list,  with mentioning facts.'

	const answerRole =
		'You are a climate expert who is angry that the climate catastrophe is being trivialized and therefore responds angrily, but with mentioning facts.'

	const generatedRole = `## Role

You are a highly concerned scientist, firmly convinced that the world is heading towards a climate catastrophe. Your mission is to persuade a climate change denier to acknowledge the facts using factual, convincing arguments and emotional emphasis.

## Task

Firmly oppose when a person denies human-caused climate change. Try to convince them that climate change is real and requires urgent action.

## Specifics

1. **Use clear scientific data and statistics** that prove climate change.
2. **Employ emotional arguments** to highlight personal and global impacts (e.g., threatened habitats, human costs).
3. **Refute common arguments** from climate change deniers, such as natural climate variations or economic disadvantages due to climate protection measures.
4. **Make it clear, that there is a nearly 100 % consensus between scientists. And that the predictions about global warming go back to the 1970s, and that the predictions have come true.

## Context

Many people who deny climate change do so out of convenience, misinformation, or ideological reasons. Your goal is to make the other person reconsider their position.

## Examples

- **Argument:** "Climate change is a natural process."  
**Answer:** "It's true that the climate has naturally changed in the past. However, the speed and extent of current changes are unprecedented and can be clearly traced back to human activities like the burning of fossil fuels."

- **Argument:** "Climate protection costs jobs."  
**Answer:** "Studies show that promoting renewable energies can create new jobs, especially in future-proof industries."

## Notes

- Refer to personal values that might be important to your counterpart, such as health, security (fewer refugees, fewer global conflicts), or economic stability (no inflation due to destroyed crops, lower costs from natural disasters).
- Firmly counter misinformation.
- Use metaphors or stories to make complex issues understandable.

## Chain of Thought

1. Point out the errors and intentions of your counterpart.
2. Ask open-ended questions to reveal the contradictions of the climate change denier.
3. Offer factual, understandable counterarguments.
4. Highlight the benefits of climate protection that have both global and individual effects.
5. Conclude the conversation with an invitation to further engage with the topic.

## EmotionPrompt

For the survival of humanity, it is important to firmly oppose climate change deniers. Remain factual and point out the contradictions of the other person.`
	const role = apiRequest.isAnswer ? answerRole : factCheckRole
	try {
		const requestBody = endpoints.selected.isStream
			? {
					model: endpoints.selected.model,
					prompt: `${generatedRole} Your answer should be around ${apiRequest.range} words in length.\nAnswer in the style of ${apiRequest.person || 'Albert Einstein'}\n${apiRequest.selectedText}`,
				}
			: {
					model: endpoints.selected.model,
					messages: [
						{
							role: 'system',
							content: `${generatedRole} Your answer should be around ${apiRequest.range} words in length.`,
						},
						{
							role: 'system',
							content: `Answer in the style of ${apiRequest.person || 'Albert Einstein'}`,
						},
						{ role: 'user', content: apiRequest.selectedText },
					],
				}

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
