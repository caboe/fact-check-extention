import { pipeline, env } from '@xenova/transformers'

// Configure transformers.js
env.allowLocalModels = false
env.useBrowserCache = true
// @ts-ignore
env.backends.onnx.wasm.wasmPaths = chrome.runtime.getURL('wasm/')
env.backends.onnx.wasm.numThreads = 1
env.backends.onnx.wasm.proxy = false // Disable proxying to web worker to improve stability in extension environment

// Globals
let transcriber: any = null
let audioContext: AudioContext | null = null
let mediaStream: MediaStream | null = null
let source: MediaStreamAudioSourceNode | null = null
let processor: ScriptProcessorNode | null = null
let isRecording = false
let audioBuffer: Float32Array[] = []
let bufferLength = 0
let currentLanguage = 'en'
let isProcessing = false
let modelLoadingPromise: Promise<void> | null = null
let isStarting = false
let activeSessionId = 0

const SAMPLE_RATE = 16000
const CHUNK_LENGTH_SEC = 5 // Transcribe every 5 seconds roughly
const BUFFER_THRESHOLD = SAMPLE_RATE * CHUNK_LENGTH_SEC

// Initialize model
async function initModel() {
	if (transcriber) return
	if (modelLoadingPromise) return modelLoadingPromise

	modelLoadingPromise = (async () => {
		try {
			console.log('Loading model...')
			chrome.runtime.sendMessage({ type: 'TRANSCRIPTION_STATUS', status: 'loading', progress: 0 })

			transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-small', {
				progress_callback: (data: any) => {
					if (data.status === 'progress' || data.status === 'initiate' || data.status === 'done') {
						chrome.runtime.sendMessage({
							type: 'TRANSCRIPTION_STATUS',
							status: 'loading',
							progress:
								data.status === 'initiate'
									? 0
									: data.status === 'done'
										? 100
										: Math.round(data.progress || 0),
							file: data.file,
						})
					}
				},
			})

			console.log('Model loaded')
			chrome.runtime.sendMessage({ type: 'TRANSCRIPTION_STATUS', status: 'ready' })
		} catch (err: any) {
			console.error('Failed to load model:', err)
			chrome.runtime.sendMessage({ type: 'TRANSCRIPTION_ERROR', error: err.message })
		} finally {
			modelLoadingPromise = null
		}
	})()

	await modelLoadingPromise
}

// Start Recording
async function startRecording(targetTabId: number, streamId: string, language: string) {
	if (isRecording || isStarting) return
	isStarting = true
	const currentSessionId = ++activeSessionId

	try {
		currentLanguage = language
		await initModel()
		if (currentSessionId !== activeSessionId) return
		if (!transcriber) return

		mediaStream = await navigator.mediaDevices.getUserMedia({
			audio: {
				mandatory: {
					chromeMediaSource: 'tab',
					chromeMediaSourceId: streamId,
				},
			} as any,
			video: false,
		})
		if (currentSessionId !== activeSessionId) {
			if (mediaStream) mediaStream.getTracks().forEach((track) => track.stop())
			return
		}

		audioContext = new AudioContext({ sampleRate: SAMPLE_RATE })
		await audioContext.resume()
		source = audioContext.createMediaStreamSource(mediaStream)

		// Use ScriptProcessor for simplicity (AudioWorklet is better but requires separate file/setup)
		processor = audioContext.createScriptProcessor(4096, 1, 1)

		source.connect(processor)
		processor.connect(audioContext.destination) // Connect to destination to keep it alive, but mute if needed?
		// Actually connecting to destination might output audio to speakers.
		// We want to capture it, but maybe not hear it double?
		// Tab capture usually mutes the tab unless we play it back.
		// If we connect to destination, we hear it.
		// If we don't, we might not process? ScriptProcessor needs connection.
		// We can connect to a GainNode with gain 0?
		// Let's check tabCapture behavior. It mutes the original tab.
		// So we *should* play it if we want the user to hear it.
		// But for now, let's just process.

		processor.onaudioprocess = (e) => {
			if (!isRecording) return
			const inputData = e.inputBuffer.getChannelData(0)
			const outputData = e.outputBuffer.getChannelData(0)

			// Pass through audio to output so user can hear it
			outputData.set(inputData)

			// Clone data because inputBuffer is reused
			const data = new Float32Array(inputData)
			audioBuffer.push(data)
			bufferLength += data.length

			if (bufferLength >= BUFFER_THRESHOLD) {
				processBuffer()
			}
		}

		isRecording = true
		chrome.runtime.sendMessage({ type: 'TRANSCRIPTION_STATUS', status: 'recording' })
	} catch (err: any) {
		console.error('Error starting recording:', err)
		chrome.runtime.sendMessage({ type: 'TRANSCRIPTION_ERROR', error: err.message })
	} finally {
		isStarting = false
	}
}

async function processBuffer() {
	if (isProcessing) return
	isProcessing = true

	try {
		if (audioBuffer.length === 0) return

		// Concatenate buffer
		const fullBuffer = new Float32Array(bufferLength)
		let offset = 0
		for (const chunk of audioBuffer) {
			fullBuffer.set(chunk, offset)
			offset += chunk.length
		}

		// Reset buffer
		audioBuffer = []
		bufferLength = 0

		// Transcribe
		try {
			const result = await transcriber(fullBuffer, {
				language: currentLanguage,
				// task: 'transcribe',
				chunk_length_s: 30,
				stride_length_s: 5,
			})

			// result.text is the transcription
			if (result && result.text) {
				chrome.runtime.sendMessage({
					type: 'TRANSCRIPTION_RESULT',
					text: result.text.trim(),
				})
			}
		} catch (err) {
			console.error('Transcription error:', err)
		}
	} finally {
		isProcessing = false
	}
}

async function stopRecording() {
	// Invalidate any starting sessions
	activeSessionId++
	isRecording = false

	// Wait for any ongoing processing (with timeout)
	let attempts = 0
	while (isProcessing && attempts < 20) {
		await new Promise((resolve) => setTimeout(resolve, 50))
		attempts++
	}

	// Process remaining buffer if possible and not stuck
	if (bufferLength > 0 && !isProcessing) {
		try {
			await processBuffer()
		} catch (e) {
			console.error('Error processing final buffer:', e)
		}
	}

	if (processor) {
		processor.disconnect()
		processor = null
	}
	if (source) {
		source.disconnect()
		source = null
	}
	if (mediaStream) {
		mediaStream.getTracks().forEach((track) => track.stop())
		mediaStream = null
	}
	if (audioContext) {
		try {
			await audioContext.close()
		} catch (e) {
			console.error('Error closing audio context:', e)
		}
		audioContext = null
	}

	chrome.runtime.sendMessage({ type: 'TRANSCRIPTION_STATUS', status: 'stopped' })
}

// Listen for messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === 'START_RECORDING') {
		startRecording(message.targetTabId, message.streamId, message.language)
	} else if (message.type === 'STOP_RECORDING') {
		stopRecording()
	}
	// Return true if async response needed
})
