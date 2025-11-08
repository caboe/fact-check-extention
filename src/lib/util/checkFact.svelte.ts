import { isSelectedImage, isSelectedText } from '../../TSelectedContent'
import apiRequest from '../state/apiRequest.svelte'
import endpoints from '../state/endpoints.svelte'
import view from '../state/view.svelte'
import getSystemRole from './getSystemRole.svelte'
import handleStreamResponse from './handleStreamResponse.svelte'
import unifiedStorage from './unifiedStorage.svelte'

let currentAbortController: AbortController | null = null

// Local model cache and pipeline
let localModelCache = new Map<string, any>()
let localModelsLoading = new Set<string>()

export default async function checkFact() {
	// Abort any ongoing request
	if (currentAbortController) {
		currentAbortController.abort()
		console.log('Previous fact check request aborted.')
	}

	// Create a new AbortController for this request
	currentAbortController = new AbortController()
	const signal = currentAbortController.signal

	if (!endpoints.value.selected) {
		view.step = 1
		return
	}
	view.step = 2

	unifiedStorage.value.lastUsed = endpoints.value.selected.title
	apiRequest.value.state = 'LOADING'
	unifiedStorage.value.result = undefined

	type Content =
		| string
		| {
				type: string
				image_url: {
					url: string
				}
		  }[]
		| null

	let content: Content = null

	if (isSelectedImage(unifiedStorage.value.selectedContent)) {
		content = [
			{
				type: 'image_url',
				image_url: {
					url: unifiedStorage.value.selectedContent.image,
				},
			},
		]
	}

	if (isSelectedText(unifiedStorage.value.selectedContent)) {
		content = unifiedStorage.value.selectedContent.text
	}

	if (!content) throw new Error('No content selected')

	// Check if we're using a local model
	const isLocalModel = endpoints.value.selected?.isLocal

	if (isLocalModel) {
		await handleLocalModelRequest(content, signal)
	} else {
		await handleRemoteModelRequest(content, signal)
	}
}

async function handleLocalModelRequest(content: any, signal: AbortSignal) {
	try {
		if (!endpoints.value.selected?.localModelId) {
			throw new Error('No local model ID specified')
		}

		const modelId = endpoints.value.selected.localModelId

		// Check for ONNX models and provide better error handling
		if (modelId.includes('onnx-community')) {
			throw new Error(
				'ONNX models may have compatibility issues in this browser. Try a different model.',
			)
		}

		// Load transformer.js pipeline if not already loaded
		if (!localModelCache.has(modelId) && !localModelsLoading.has(modelId)) {
			localModelsLoading.add(modelId)
			console.log(`Loading local model: ${modelId}`)

			try {
				// Verify the model is actually downloaded before trying to load it
				const isDownloaded = await endpoints.verifyModelDownload(modelId)
				if (!isDownloaded) {
					throw new Error(`Model ${modelId} is not downloaded. Please download it first.`)
				}

				// Initialize shared transformers configuration
				const { initTransformers } = await import('./transformersInit')
				const transformersModule = await initTransformers()

				// Get the dtype for this model
				const localModel = endpoints.value.localModels.find((m) => m.id === modelId)
				const dtype = localModel?.dtype

				console.log(`Loading model ${modelId} from cache with dtype: ${dtype}`)

				const model = await transformersModule.pipeline('text-generation', modelId, {
					// Use the same configuration as the download manager
					dtype: dtype,
					progress_callback: (progress: any) => {
						console.log('Model loading progress:', progress)
						apiRequest.value.state = progress.status === 'initiate' ? 'LOADING' : 'STREAMING'
					},
				})

				localModelCache.set(modelId, model)
				console.log(`Local model ${modelId} loaded successfully from cache`)
			} catch (err) {
				localModelsLoading.delete(modelId)

				// If the model fails to load, mark it as not downloaded
				if (err instanceof Error && err.message.includes('not downloaded')) {
					await endpoints.updateLocalModelProgress(modelId, 0, false)
				}

				throw new Error(
					`Failed to load local model: ${err instanceof Error ? err.message : 'Unknown error'}`,
				)
			} finally {
				localModelsLoading.delete(modelId)
			}
		}

		// Get the model from cache
		const model = localModelCache.get(modelId)
		if (!model) {
			throw new Error(`Model ${modelId} not available in cache`)
		}

		// Prepare the prompt
		const prompt = buildPrompt(content)
		console.log({ content, prompt })

		// Generate text using the local model
		apiRequest.value.state = 'STREAMING'

		// For now, we'll generate the full response at once
		// In a more advanced implementation, you could stream token by token
		const result = await model(prompt, {
			max_new_tokens: 100, // TODO
			temperature: 0.7,
			do_sample: true,
			pad_token_id: 50256, // Common padding token for many models
		})

		// Extract the generated text
		let generatedText = ''
		if (result && result.length > 0) {
			if (typeof result[0] === 'string') {
				generatedText = result[0]
			} else if (result[0].generated_text) {
				generatedText = result[0].generated_text
			} else {
				generatedText = JSON.stringify(result[0])
			}
		}

		if (generatedText) {
			// Store the result
			unifiedStorage.value.result = generatedText
			apiRequest.value.state = 'FINISHED'
		} else {
			throw new Error('No text generated from local model')
		}
	} catch (err: unknown) {
		console.error('Error with local model:', err)
		unifiedStorage.value.result = 'Error with local model: ' + (err as Error).message
		apiRequest.value.state = 'ERROR'
	} finally {
		// Clear the controller if this specific request instance finished or was aborted
		if (currentAbortController?.signal === signal) {
			currentAbortController = null
		}
	}
}

async function handleRemoteModelRequest(content: any, signal: AbortSignal) {
	type Content =
		| string
		| {
				type: string
				image_url: {
					url: string
				}
		  }[]
		| null

	type RequestBody = {
		model?: string
		stream?: boolean
		max_tokens?: number
		messages?: {
			role: 'user' | 'system'
			content: Content
		}[]
		input?: {
			prompt: string
		}
	}

	async function fetchModel(signal: AbortSignal): Promise<Response> {
		if (!endpoints.value.selected) throw new Error('No endpoint selected')

		function getInlineContent(content: Content): string {
			return `DEINE AUFGABE:\n
			${getSystemRole(unifiedStorage.value.selectedRole || '', apiRequest.value.range)}\n
			CHECKE DIE FOLGENDE AUSSAGE:\n
			${content}`
		}

		const requestBody: RequestBody = {
			model: endpoints.value.selected.model,
			stream: true,
			messages: [
				...(apiRequest.value.rolePlacement === 'system'
					? [
							{
								role: 'system' as const,
								content: getSystemRole(
									unifiedStorage.value.selectedRole || '',
									apiRequest.value.range,
								),
							},
						]
					: []),
				{
					role: 'user' as const,
					content:
						apiRequest.value.rolePlacement === 'inline' ? getInlineContent(content) : content,
				},
			],
		}

		return await fetch(endpoints.value.selected.url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${endpoints.value.selected.apiKey}`,
			},
			body: JSON.stringify(requestBody),
			signal, // Pass the signal to fetch
		})
	}

	try {
		// Pass the signal to fetchModel
		const response = await fetchModel(signal)

		// Check if the request was aborted before proceeding
		if (signal.aborted) {
			console.log('Fact check request aborted before handling response.')
			apiRequest.value.state = 'EMPTY' // Reset state to EMPTY
			return
		}

		if (response.status === 403) {
			unifiedStorage.value!.result =
				'Forbidden! If you are using Ollama, try to start it with in the console: <br><br><code>OLLAMA_ORIGINS=chrome-extension://* && ollama serve</code>'
			apiRequest.value.state = 'ERROR'
			return
		}
		if (!response.ok) {
			unifiedStorage.value.result = undefined
			try {
				const errorResponse = await response.json()
				const message =
					errorResponse[0]?.error?.message || errorResponse.error?.message || errorResponse.message
				if (message) {
					unifiedStorage.value.result = message
					apiRequest.value.state = 'ERROR'
					return
				}
			} catch (e) {
				unifiedStorage.value.result = `HTTP-Error!  ${e}`
			}
			return
		}

		// Pass the signal to handleStreamResponse
		await handleStreamResponse(response, signal)
	} catch (err: unknown) {
		if (err instanceof Error && err.name === 'AbortError') {
			console.log('Fact check fetch aborted:', err.message)
			// Reset state as the request was aborted.
			// The 'FINISHED' check is removed as svelte-check flags it as redundant within this AbortError catch block.
			apiRequest.value.state = 'EMPTY' // Reset state to EMPTY
			unifiedStorage.value.result = undefined // Clear potentially partial results
		} else {
			console.error('Error during fact check:', err)
			unifiedStorage.value.result = 'Error during fact check: ' + (err as Error).message
			apiRequest.value.state = 'ERROR'
		}
	} finally {
		// Clear the controller if this specific request instance finished or was aborted
		if (currentAbortController?.signal === signal) {
			currentAbortController = null
		}
	}
}

function buildPrompt(content: any): string {
	// if (typeof content === 'string') {
	// 	return `DEINE AUFGABE:\n${getSystemRole(unifiedStorage.value.selectedRole || '', apiRequest.value.range)}\nCHECKE DIE FOLGENDE AUSSAGE:\n${content}`
	// } else if (Array.isArray(content)) {
	// 	// Handle multimodal content if needed in the future
	// 	return `Please analyze the provided content.`
	// }
	return 'Please do the fact check on the following content:\n\n' + content
}
