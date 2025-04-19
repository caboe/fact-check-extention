import role from './role.svelte'
import { ITone } from './tone.svelte'

export default function getSystemRole(tone: ITone, range: number): string {
	const toneExamples = tone.value
		.map(
			(t) => `Thesis: ${t.thesis}
Answer: ${t.answer}
    `,
		)
		.join('\n')

	return role.replace('{tone}', toneExamples).replace('{range}', String(range))
}
