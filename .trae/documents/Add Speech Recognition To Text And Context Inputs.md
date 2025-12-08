## Overview
- Implement microphone-based speech recognition using `@xenova/transformers` with a multilingual Distil‑Whisper model
- Provide mic controls and clear loading/transcribing states for both `selected` and `context` inputs
- Lazy‑load models; cache for subsequent runs

## Model & Dependencies
- Add `@xenova/transformers` dependency
- Default model: `distil-whisper/distil-small` (multilingual, faster); structure allows swapping to `distil-whisper/distil-medium` later for accuracy
- Initialize a single ASR pipeline (`automatic-speech-recognition`) on first use; reuse thereafter
- Show detailed progress (download/init) using pipeline progress callbacks (see Whisper Web: github.com/xenova/whisper-web)

## Audio Capture & Processing
- Request mic with `navigator.mediaDevices.getUserMedia({ audio: true })`
- Convert mic stream to Float32 PCM via `AudioContext` processor; accumulate frames per session
- On stop, pass a single `Float32Array`/`AudioBuffer` to the pipeline; receive transcript
- For longer audio, use chunked inference (`chunk_length_s`, `stride_length_s`) to manage memory

## UX Additions
- Mic buttons beside textareas:
  - Selected: `src/lib/components/steps/Selected.svelte:263-284`
  - Context: `src/lib/components/steps/Selected.svelte:250-260`
- State flow: idle → loading models → recording → transcribing → done
- Progress bar/percent during model load; disable selection buttons while recording
- Config preferences:
  - Enable speech input globally
  - Append vs replace transcript in fields

## State & Config Changes
- Extend `IUnifiedState` in `src/lib/util/unifiedStorage.svelte.ts:16-29`:
  - `speechEnabled: boolean`
  - `speechAppend: 'append'|'replace'`
- Update `src/lib/components/Config.svelte` to add a Speech section with toggle and append/replace selector

## Implementation Files
- `src/lib/util/speech/asr.ts`:
  - Lazy‑import `@xenova/transformers`, create/reuse multilingual Distil‑Whisper pipeline
  - APIs: `initASR(onProgress)`, `startRecording()`, `stopAndTranscribe()`
  - Robust error surfacing (permission denied, unsupported)
- Icons: `MicIcon.svelte`, `StopIcon.svelte`
- Wire into `Selected.svelte`: manage local recording states; on transcript, update `unifiedStorage` fields per preference

## i18n
- Add strings: “Speech Input”, “Start/Stop Recording”, “Loading models… {percent}%”, “Transcribing…”, “Permission denied”, “Feature unavailable”

## Performance & Caching
- Lazy load pipeline; rely on IndexedDB caching for subsequent runs
- Default to push‑to‑talk to limit memory; chunked mode for long clips

## Testing & Verification
- Playwright: provide a dynamic import stub for ASR that returns a fixed transcript; assert UI states and field updates without downloading models
- Manual test on Chrome: permission prompts, model download progress, multilingual transcription (non‑English input)

## Edge Cases
- Permission denied → show error and keep controls disabled until retried
- Unsupported audio context → show “Feature unavailable”
- Concurrent recording → ensure only one input can record at a time

## References
- Whisper Web (browser mic + Transformers.js): https://github.com/xenova/whisper-web
- Distil‑Whisper transformers.js compatibility: https://x.com/xenovacom/status/1720916876010635364