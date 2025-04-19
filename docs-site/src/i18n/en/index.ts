import type { Translation } from '../i18n-types';

const en: Translation = {
	general: {
		title: 'Fact Check Extension Documentation'
	},
	home: {
		welcome: 'Welcome to the {name:string} Documentation',
		introduction:
			'This website provides comprehensive documentation on how to install, configure, and use the Fact Check Chrome Extension.'
	},
	nav: {
		installation: 'Installation',
		configuration: 'Configuration',
		usage: 'Usage'
	},
	installation: {
		title: 'Installation',
		web_store_heading: 'Install from Chrome Web Store',
		web_store_intro:
			'The easiest way to install the extension is directly from the Chrome Web Store.',
		web_store_link_text: 'Fact Checker GPT Connector on Chrome Web Store',
		developer_mode_heading: 'Install in Developer Mode (from ZIP)',
		developer_mode_intro:
			"If you want to install a specific version or contribute to development, you can install the extension in Chrome's developer mode using a ZIP file.",
		developer_mode_steps: {
			step1: "Navigate to the extension's root directory in your terminal.",
			step2:
				'Run the build command: `{command:string}`. This will generate a `{zipFile:string}` file in the `dist/` directory.',
			step3: 'Open Chrome and go to `chrome://extensions/`.',
			step4: 'Enable "Developer mode" using the toggle in the top right corner.',
			step5: 'Click the "Load unpacked" button.',
			step6: "Navigate to the `dist/` folder within the extension's directory and select it.",
			step7: 'The extension should now appear in your list of installed extensions.'
		}
	},
	configuration: {
		title: 'Configuration',
		endpoints_heading: 'API Endpoints',
		endpoints_intro:
			"The extension requires an API endpoint to perform fact checks. You can configure this in the extension's popup.",
		endpoints_steps: {
			step1: 'Open the extension popup by clicking its icon in the Chrome toolbar.',
			step2: 'Click on "API Endpoint".',
			step3: 'Click the "New Endpoint" button.',
			step4:
				'Fill in the details for your API endpoint. You can choose a template for common services like Gemini, OpenAI, etc., or enter a custom URL.',
			step5: 'Enter your API Key if required by the service.',
			step6: 'Click "add" to save the endpoint.'
		},
		api_keys_heading: 'Obtaining API Keys',
		api_keys_intro:
			'Many API services require an API key for authentication. You will need to obtain this key from the respective service provider.',
		api_keys_advice:
			'Please refer to the official documentation of the API service you wish to use for instructions on how to obtain an API key.',
		ollama_heading: 'Using a Local Ollama Instance',
		ollama_intro: 'You can also use a local Ollama instance as your fact-checking endpoint.',
		ollama_steps: {
			step1: 'Install Ollama on your system by following the official documentation.',
			step2: 'Once Ollama is running, add a new endpoint in the extension configuration.',
			step3:
				'For the URL, enter the local address of your Ollama instance, typically `{ollamaUrl:string}`.',
			step4: 'Select the appropriate model if prompted.',
			step5: 'Save the endpoint.'
		}
	},
	usage: {
		title: 'Usage',
		select_text_heading: 'Selecting Text',
		select_text_intro: 'To fact-check text, simply select the desired text on any webpage.',
		select_image_heading: 'Selecting Images',
		select_image_intro:
			"To fact-check an image, right-click on the image and select the extension's option (if available and supported by the configured endpoint).",
		select_ui_heading: 'Using the Extension Popup',
		select_ui_intro:
			'Alternatively, you can open the extension popup and manually enter text or select an image via the provided interface.'
	}
};

export default en;
