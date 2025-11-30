export const testConfig: TestConfig = {
	apiKey: '<YOUR_API_KEY>',
	model: 'z-ai/glm-4.5v',
	url: 'https://openrouter.ai/api/v1/chat/completions',
	texts: {
		default: 'The earth is flat.',
		complex: 'Climate change is a hoax invented by the government to control the population.',
	},
}

export interface TestConfig {
	apiKey: string
	model: string
	url: string
	texts: {
		default: string
		complex: string
	}
}
