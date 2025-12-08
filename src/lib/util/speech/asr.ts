let _pipeline: any
let _mediaStream: MediaStream | null = null
let _mediaRecorder: MediaRecorder | null = null
let _chunks: BlobPart[] = []
let _envConfigured = false

export async function initASR(onProgress?: (info: { status: string; progress?: number }) => void) {
  if (_pipeline) return
  const stub = (globalThis as any).__ASR_STUB__
  const mod = stub ?? (await import('@xenova/transformers'))
  if (!_envConfigured && !stub) {
    try {
      const env = (mod as any).env
      env.allowRemoteModels = true
      if ('allowLocalModels' in env) env.allowLocalModels = false
      // keep default localModelPath to avoid undefined .replace in internal code
      env.remoteModels = true
      // Force non-threaded WASM in extension context to avoid COOP/COEP/SharedArrayBuffer issues
      if (env.backends?.onnx) {
        env.backends.onnx.logLevel = 'error'
      }
      if (env.backends?.onnx?.wasm) {
        env.backends.onnx.wasm.numThreads = 1
        env.backends.onnx.wasm.multiThreading = false
        env.backends.onnx.wasm.simd = false
        env.backends.onnx.wasm.proxy = false
        env.backends.onnx.wasm.wasmPaths =
          'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/'
      }
      _envConfigured = true
    } catch {}
  }
  const progress_callback = (data: any) => {
    if (onProgress) {
      let p = typeof data?.progress === 'number' ? data.progress : undefined
      if (typeof p === 'number') {
        p = p > 1 ? p / 100 : p
        if (p < 0) p = 0
        if (p > 1) p = 1
      }
      onProgress({ status: data?.status || 'loading', progress: p })
    }
  }
  try {
    _pipeline = await mod.pipeline(
      'automatic-speech-recognition',
      'Xenova/whisper-tiny.en',
      { progress_callback }
    )
  } catch (e) {
    try {
      _pipeline = await mod.pipeline(
        'automatic-speech-recognition',
        'Xenova/whisper-tiny',
        { progress_callback }
      )
    } catch (e2) {
      _pipeline = await mod.pipeline(
        'automatic-speech-recognition',
        'Xenova/whisper-base',
        { progress_callback }
      )
    }
  }
}

export async function startRecording() {
  _chunks = []
  _mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const mime = 'audio/webm'
  _mediaRecorder = new MediaRecorder(_mediaStream, { mimeType: mime })
  _mediaRecorder.ondataavailable = (e: BlobEvent) => {
    if (e.data && e.data.size > 0) _chunks.push(e.data)
  }
  _mediaRecorder.start()
}

export async function stopAndTranscribe(options?: { chunk_length_s?: number; stride_length_s?: number }) {
  const recorder = _mediaRecorder
  const stream = _mediaStream
  _mediaRecorder = null
  _mediaStream = null
  return new Promise<{ text: string }>((resolve, reject) => {
    if (!recorder) return reject(new Error('Not recording'))
    recorder.onstop = async () => {
      try {
        const blob = new Blob(_chunks, { type: 'audio/webm' })
        _chunks = []
        if (!_pipeline) await initASR()
        const res = await _pipeline(blob, options || {})
        resolve({ text: res?.text || '' })
      } catch (e) {
        reject(e)
      } finally {
        stream?.getTracks().forEach((t) => t.stop())
      }
    }
    recorder.stop()
  })
}

export function isRecording() {
  return !!_mediaRecorder && _mediaRecorder.state === 'recording'
}

export function hasASR() {
  return true
}
