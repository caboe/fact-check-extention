import { initASR, startRecording, stopAndTranscribe, hasASR } from './lib/util/speech/asr'

type InitMsg = { type: 'init' }
type StartMsg = { type: 'start' }
type StopMsg = { type: 'stop'; target: 'selected' | 'context' }
type InMsg = InitMsg | StartMsg | StopMsg

const channel = new BroadcastChannel('asr-channel')

function send(type: string, payload: any = {}) {
  channel.postMessage({ source: 'asr-sandbox', type, ...payload })
}

let initialized = false

channel.onmessage = async (ev: MessageEvent) => {
  const data = ev.data as InMsg | any
  if (!data || (data.source && data.source !== 'popup')) return
  try {
    if (data.type === 'init') {
      if (!hasASR()) throw new Error('ASR not available')
      if (initialized) {
        send('ready')
        return
      }
      await initASR((p) => {
        send('progress', { progress: p.progress, status: p.status })
      })
      initialized = true
      send('ready')
    } else if (data.type === 'start') {
      if (!initialized) {
        await initASR((p) => send('progress', { progress: p.progress, status: p.status }))
        initialized = true
        send('ready')
      }
      await startRecording()
      send('recording-started')
    } else if (data.type === 'stop') {
      const res = await stopAndTranscribe()
      send('result', { text: res.text, target: data.target })
    }
  } catch (e: any) {
    send('error', { message: e?.message || String(e) })
  }
}
