# Plan: Add Anthropic API Support

## Summary

Add a new `apiType` field (`'openai' | 'anthropic'`) to endpoint configuration, supporting Anthropic's native Messages API format for both request construction and streaming response parsing. Add Anthropic direct API as a template provider.

## Key Differences: OpenAI vs Anthropic

### Request

- **OpenAI**: `Authorization: Bearer` header, system role in `messages[]`, `content` can be string or array
- **Anthropic**: `x-api-key` header + `anthropic-version: 2023-06-01`, system prompt in top-level `system` field, `messages[]` only `user`/`assistant` roles, `content` must be array of content blocks, requires `max_tokens`

### Streaming

- **OpenAI**: `data: {"choices":[{"delta":{"content":"..."}}]}` SSE lines
- **Anthropic**: `event: content_block_delta` / `data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"..."}}` SSE format. Reasoning uses `thinking_delta` type.

## Files to Change

### 1. `src/lib/state/endpoints.svelte.ts`

- Add `apiType?: 'openai' | 'anthropic'` to `Endpoint` interface
- Defaults to `'openai'` for backward compatibility with existing endpoints

### 2. `src/lib/components/AddEndpointForm.svelte`

- Add `apiType` state variable, default `'openai'`
- Add Anthropic template to `endpointTemplateMap`:
  - `anthropic`: title=`Anthropic`, url=`https://api.anthropic.com/v1/messages`, model=`claude-sonnet-4-5-20250929`, apiKeyUrl=`https://console.anthropic.com/settings/keys`
- When `anthropic` template selected, set `apiType = 'anthropic'`
- When `openai`-compatible templates selected, set `apiType = 'openai'`
- Add a dropdown/select for `apiType` in the form UI (below the model field, with options "OpenAI-compatible" and "Anthropic")
- Include `apiType` in the `newEndpoint` object on save

### 3. `src/lib/components/EditEndpointForm.svelte`

- Add `apiType` state variable (initialized from `endpoint.apiType ?? 'openai'`)
- Add the same `apiType` dropdown in the form
- Include `apiType` in `updatedEndpoint`

### 4. `src/lib/util/checkFact.svelte.ts`

- Modify `fetchModel()` to branch on `endpoints.value.selected.apiType`:
  - **When `'anthropic'`**:
    - Set `max_tokens: 4096` in request body
    - Move system role to top-level `system` field (when `rolePlacement === 'system'`)
    - Remove system message from `messages[]` (Anthropic rejects it)
    - Convert string `content` to `[{ type: 'text', text: contentStr }]` array format
    - Convert image content from OpenAI format `{ type: 'image_url', image_url: { url } }` to Anthropic format `{ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data } }`
    - Use `x-api-key` header instead of `Authorization: Bearer`
    - Add `anthropic-version: 2023-06-01` header
  - **When `'openai'`** (default): existing behavior unchanged

### 5. `src/lib/util/handleStreamResponse.svelte.ts`

- After the existing Gemini block, add an Anthropic branch in SSE line parsing:
  - Parse `event:` lines to track current event type
  - On `content_block_delta` data: extract `parsed.delta.text` for content
  - On `thinking_delta` data: extract `parsed.delta.thinking` for reasoning
  - On `content_block_start` data: extract `parsed.content_block.text` for initial content (non-streaming start)
- Keep existing OpenAI and Gemini parsing as-is

### 6. i18n files (optional - only if new labels are needed)

- May add labels for `apiType` dropdown options if desired, but can hardcode "OpenAI-compatible" / "Anthropic" strings initially

## Template Details

New Anthropic template:

```ts
anthropic: {
  title: 'Anthropic',
  url: 'https://api.anthropic.com/v1/messages',
  model: 'claude-sonnet-4-5-20250929',
  apiKeyUrl: 'https://console.anthropic.com/settings/keys',
}
```

## Backward Compatibility

- Existing endpoints without `apiType` field default to `'openai'` at runtime, preserving all current behavior
- The `apiType` field is optional in the interface (`apiType?: 'openai' | 'anthropic'`)

## Edge Cases

- **Image handling**: Anthropic requires image data in `{ type: 'image', source: { type: 'base64', media_type, data } }` format. Need to convert from the current base64 data URL format (extract media type and raw base64).
- **Inline role placement with Anthropic**: When `rolePlacement === 'inline'`, the system prompt is folded into user content (same as current behavior), no system field needed.
- **Error handling**: Anthropic errors come in a different JSON shape; the existing `response.json()` error parsing in `checkFact` should still work for most cases.
