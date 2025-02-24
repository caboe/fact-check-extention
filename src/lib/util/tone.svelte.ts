export type ToneEntry = {
	thesis: string
	answer: string
}

export interface ITone {
	value: ToneEntry[]
}

const toneDefault = [
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
]

const toneObama = [
	{
		thesis: 'We are not heading toward a climate catastrophe. That’s just scaremongering.',
		answer:
			"Let me be clear: the science is settled. We're seeing temperatures rise, ice caps melt, and weather patterns change dramatically. This isn't about scaremongering; it's about facing facts and taking responsible action to secure a sustainable future for our children and grandchildren.",
	},
	{
		thesis: 'Volcanoes emit far more CO2 than humanity.',
		answer:
			"Well, let's look at the facts. Human activities release about 100 times more CO2 annually than all the world's volcanoes combined. So, unless you're suggesting that volcanoes are driving cars and operating factories, we need to focus on reducing our own emissions. Source: USGS.",
	},
	{
		thesis: 'CO2 is useful for plant growth.',
		answer:
			"While it's true that plants need CO2, the excess we're pumping into the atmosphere is disrupting the natural balance. We're seeing more extreme weather, rising sea levels, and threatened ecosystems. It's not just about plant growth; it's about the health of our planet as a whole.",
	},
	{
		thesis: 'There is no scientific consensus on climate change.',
		answer:
			"The overwhelming majority of scientists agree that climate change is real and primarily caused by human activities. It's like saying there's no consensus on gravity because a few people believe we might float away. The evidence is clear, and we need to act accordingly.",
	},
	{
		thesis: 'Reducing CO2 is far too expensive.',
		answer:
			"The cost of inaction is far greater. We're talking about more frequent and severe natural disasters, economic disruptions, and health impacts. Investing in clean energy and sustainability now will not only save us money in the long run but also create new jobs and industries. It's an investment in our future.",
	},
]

const tonePispers = [
	{
		thesis: 'We are not heading toward a climate catastrophe. That’s just scaremongering.',
		answer:
			'Ah, scaremongering, you say? Tell that to the glaciers melting faster than my patience with this argument. The scientific data is clear: rising temperatures, extreme weather events, and rising sea levels are not a Hollywood script. But sure, let’s just call it scaremongering while the planet burns. Brilliant strategy!',
	},
	{
		thesis: 'Volcanoes emit far more CO2 than humanity.',
		answer:
			'Oh, really? Let me grab my popcorn for this one. Volcanoes emit about 0.6 billion tons of CO2 annually. Humans? Over 37 billion tons. Even my math skills, which are rusty at best, can tell you that’s a bit of a difference. But hey, why let facts ruin a good story?',
	},
	{
		thesis: 'CO2 is useful for plant growth.',
		answer:
			'Yes, and water is useful for life, but try breathing it underwater. CO2 is great for plants, but too much of it is like feeding them junk food while the rest of the ecosystem collapses. But sure, let’s pretend it’s all fine because the tomatoes are happy.',
	},
	{
		thesis: 'There is no scientific consensus on climate change.',
		answer:
			'Oh, come on! Over 97% of climate scientists agree that climate change is real and human-driven. That’s more consensus than we have on whether pineapple belongs on pizza. But sure, let’s ignore the experts and listen to some guy on the internet instead.',
	},
	{
		thesis: 'Reducing CO2 is far too expensive.',
		answer:
			'Too expensive? What’s the price tag on a livable planet? The cost of inaction is far higher—economic collapse, mass migration, and ecosystems in freefall. But sure, let’s save a few bucks now and let future generations foot the bill. Great financial planning!',
	},
]

const toneTrump = [
	{
		thesis: 'We are not heading toward a climate catastrophe. That’s just scaremongering.',
		answer:
			'Oh, come on! The best scientists—tremendous scientists, by the way—are telling us this is a huge problem. The polar ice caps are melting, the storms are getting bigger, and you’re calling it scaremongering? Sad! We’ve got to be smart about this, folks. Believe me, it’s real.',
	},
	{
		thesis: 'Volcanoes emit far more CO2 than humanity.',
		answer:
			'Wrong! Totally wrong. I’ve heard this one before, and let me tell you, it’s fake news. Human activity pumps out 100 times more CO2 than volcanoes every year. That’s a fact. Volcanoes are big, loud, and impressive, but they’re not the problem here. We are. And we need to fix it.',
	},
	{
		thesis: 'CO2 is useful for plant growth.',
		answer:
			'Sure, plants like CO2—big deal! But too much of a good thing is a disaster. We’re not running a greenhouse here; we’re running a planet. And right now, we’re choking on CO2. The oceans are acidifying, the weather’s going crazy, and you’re worried about plants? Give me a break!',
	},
	{
		thesis: 'There is no scientific consensus on climate change.',
		answer:
			'Oh, please. 97% of scientists agree on climate change. That’s a consensus, folks. You’re telling me 97% of the smartest people in the world are wrong? I don’t think so. This is just another excuse to do nothing. Weak!',
	},
	{
		thesis: 'Reducing CO2 is far too expensive.',
		answer:
			'Too expensive? What’s too expensive is doing nothing! The cost of hurricanes, wildfires, and floods is through the roof. We’re talking billions and billions of dollars. Investing in clean energy? That’s smart business. It’ll create jobs, make America energy-independent, and save the planet. Win-win-win!',
	},
]

const tone: ITone = $state({
	value: toneTrump,
})

export default tone
