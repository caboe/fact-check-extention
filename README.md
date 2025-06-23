# Fact Check Extension Documentation

## Introduction
Welcome to the Fact Check Extension Documentation. This website provides comprehensive documentation on how to install, configure, and use the Fact Check Chrome Extension.

## Installation

### Install from Chrome Web Store
The easiest way to install the extension is directly from the Chrome Web Store.

[Fact Checker GPT Connector on Chrome Web Store](https://chromewebstore.google.com/detail/fact-checker-gpt-connecto/jikiecjhdofccpaejidggiiiejogemni)

### Install in Developer Mode (from ZIP)
If you want to install a specific version or contribute to development, you can install the extension in Chrome's developer mode using a ZIP file.

Steps:
1. Clone repo: [https://github.com/caboe/fact-check-extention](https://github.com/caboe/fact-check-extention)
2. Run the build command: `bun run build`. This will generate a `fact-check-extension.zip` file in the `dist/` directory.
3. Open Chrome and go to `chrome://extensions/`.
4. Enable "Developer mode" using the toggle in the top right corner.
5. Click the "Load unpacked" button.
6. Navigate to the `dist/` folder within the extension's directory and select it.
7. The extension should now appear in your list of installed extensions.

## Configuration

### API Endpoints
The extension requires an API endpoint to perform fact checks. You can configure this in the extension's popup.

Steps:
1. Open the extension popup by clicking its icon in the Chrome toolbar.
2. Click on "API Endpoint".
3. Click the "New Endpoint" button.
4. Fill in the details for your API endpoint. You can choose a template for common services like Gemini, OpenAI, etc., or enter a custom URL.
5. Enter your API Key if required by the service.
6. Click "add" to save the endpoint.

Example endpoint configuration:
```typescript
{
  "title": "Gemini API",
  "url": "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
  "apiKey": "YOUR_API_KEY"
}
```

### Using a Local Ollama Instance
You can also use a local Ollama instance as your fact-checking endpoint.

Steps:
1. Install Ollama on your system by following the official documentation. Make sure, to allow the plugin to access your Ollama instance by running `OLLAMA_ORIGINS=chrome-extension://* && ollama serve`
2. Once Ollama is running, add a new endpoint in the extension configuration.
3. For the URL, enter the local address of your Ollama instance, typically `http://localhost:11434`.
4. Select the appropriate model if prompted.
5. Save the endpoint.

## Usage

### Selecting Text
To fact-check text, simply select the desired text on any webpage. Open the extention, the selected text will be automatically populated in the input field.


### Selecting Images
To fact-check an image,)open the extention first. Click on "select text" and then click on an image on the page. Re-open the extention.


### Using the Extension Popup
Alternatively, you can open the extension popup and manually enter text or select an image via the provided interface.

