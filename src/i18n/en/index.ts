import type { BaseTranslation } from '../i18n-types'

const en = {
	introduction: `This tool is designed to help you verify information on the web more quickly and better assess the credibility of texts.</p>
	<p>Configure a GPT that will conduct the Fact Check.</p>
	<p><strong>Important note:</strong> Although this extension is based on advanced AI, it is not infallible. Artificial intelligence can sometimes 'hallucinate,' i.e., provide false or misleading information. Therefore, it is important to critically question the results and, in case of doubt, conduct additional research, especially if the results seem unexpected or 'suspicious.' Always consider the fact-check results as a first point of reference rather than the final truth. Use the extension as support for your own critical examination of information.</p>`,
	letsGo: "Let's get started!",
	markedText: 'Marked text ({wordCount:number} words)',
	apiEndpoint: 'API Endpoint',
	configureApi: 'Configure',
	factCheck: 'Fact Check',
	response: 'Response',
	responseLength: 'Answer length approx. {responseLength: number} words',
	apiCta: 'Check',
	result: 'Result',
	checkingProgress: 'Checking...',
	copy: 'Copy',
	configuredEndpoints: 'Configured Endpoints',
	newEndpoint: 'New Endpoint',
	darkMode: 'Dark Mode',
	title: 'Titel',
	titelPlaceholder: 'Example: Fact Check API',
	url: 'URL',
	urlPlaceholder: 'https://api.example.com/factcheck',
	apiKey: 'API Key',
	apiKeyPlaceholder: 'Your API key',
	cancel: 'Cancel',
	add: 'add',
	updateEndpoint: 'Update Endpoint',
	noConfiguredEndpoints: 'No endpoints added',
	selectedText: 'Enter text directly or select on page.',
	notChecked: 'Not checked',
	enterText: 'Enter text here.',
	personLabel: 'Enter a person (optional)',
	personPlaceholder: 'Edgar Allen Poe',
	chooseTemplate: 'Choose a template (optional)',
	choose: 'Choose ...',
	endpointExists: 'An endpoint with this name already exists.',
	saveAnyway: 'No API key provided, save anyway?',
	fieldsMissing: 'Please fill in all fields.',
	copied: 'Result copied to clipboard!',
	copyError: 'Error copying: {error:string}',
	fillAllFieldsAlert: 'Please fill in all fields',
	imageSelected: 'Image selected',
	selectImage: 'Select image',
	selectText: 'Select text',
	resetSelection: 'Reset selection',
	pleaseSelectImage: 'Please select an image.',
	selectTextOrImage: 'Select text or image',
	canProcessImages: 'Can process images?',
	noImageEndpoint: 'No configured endpoint supports image analysis.',
	configureButton: 'Configure',
	defaultPerson: 'Critical scientist',
	useShortRoleLabel:
		'Use short system role. This might help, if the context of the model is too short, for example for long texts send to Ollama',
	rolePlacementLabel: 'Role Placement',
	rolePlacementSystem: 'System Message',
	rolePlacementInline: 'Inline in User Message',
	inlineUserMessage: 'Inline System Prompt (recommended for Ollama)',
} satisfies BaseTranslation

export default en
