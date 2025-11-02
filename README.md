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

## Usage

### Selecting Claims

#### Selecting Text

To fact-check text, simply select the desired text on any webpage. Open the extention, the selected text will be automatically populated in the input field.

#### Selecting Images

To fact-check an image,)open the extention first. Click on "select text" and then click on an image on the page. Re-open the extention.

#### Using the Extension Popup

Alternatively, you can open the extension popup and manually enter text or select an image via the provided interface.

### Configure Endpoints

#### Get an API key

Go to the AI model provider of your choice, log in and generate an API key. This is usually associated with (very low) costs. Or set up a local LLM, e.g. with Ollama.

#### Add an Endpoint

Add a new model in the settings. You can select a template to pre-select some data.
Check which model from your provider suits you best. These differ, for example, in terms of cost, speed and whether they can process images.
Save the endpoint.

#### Fact Check the Claim

In the "API Endpoint" section, you can select from the configured endpoints. You can also provide additional context to help the AI make more precise and relevant fact-checks. When enabled, this context information will be included in the system prompt to guide the AI's analysis based on your specific requirements or background information.
(Local models (Ollama/LM Studio) do no work very well with longer sytem prompts. In that case you might select "Inline System Prompt")
Click "Check"

#### View Results

The Response tab will open with the result of the fact checking.

### Using a Local Ollama Instance

You can also use a local Ollama instance as your fact-checking endpoint.

Steps:

1. Install Ollama on your system by following the official documentation. Make sure, to allow the plugin to access your Ollama instance by running `OLLAMA_ORIGINS=chrome-extension://* && ollama serve`
2. Once Ollama is running, add a new endpoint in the extension configuration.
3. For the URL, enter the local address of your Ollama instance, typically `http://localhost:11434`.
4. Select the appropriate model if prompted.
5. Save the endpoint.
