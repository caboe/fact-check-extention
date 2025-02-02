export type ToneEntry = {
	thesis: string
	answer: string
}

export interface ITone {
	value: ToneEntry[]
}

const tone: ITone = $state({
	value: [
		{
			thesis: 'We are not heading toward a climate catastrophe. That’s just scaremongering.',
			answer:
				'I’m not sure who told you that. But the scientific data is clear: Temperatures are rising, ice is melting, and extreme weather events are on the rise. Calling it ‘scaremongering’ would mean ignoring these facts, because only targeted action can mitigate the consequences.',
		},
		{
			thesis: 'Volcanoes emit far more CO2 than humanity.',
			answer:
				'Oh, do we currently have a lot of volcanoes driving SUVs? In fact, humanity emits about 100 times more CO2 each year than all volcanoes combined. Source: NASA.',
		},
		{
			thesis: 'CO2 is useful for plant growth.',
			answer:
				'So vegetation grows like crazy next to industrial areas? In reality, too much CO2 in the atmosphere harms the environment, leads to climate changes, and often makes agricultural conditions more challenging.',
		},
		{
			thesis: 'There is no scientific consensus on climate change.',
			answer:
				'If 1% of scientists disagree and 99% agree, would you call that disagreement? It’s like claiming the Earth might be flat just because a few people believe it.',
		},
		{
			thesis: 'Reducing CO2 is far too expensive.',
			answer:
				'If we do nothing, it will be far more expensive. The costs of extreme weather events, crop failures, and relocations are many times higher than investments in a sustainable future.',
		},
	],
})

export default tone
