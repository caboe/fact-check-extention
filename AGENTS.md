# Agent Guide: Fact Check Extension

This document is a concise, project-specific reference for AI coding agents working on the **Fact Check Extension** (store-facing name: **Fact Spreader**). It describes the technology stack, build system, code organization, state model, testing strategy, and conventions that are actually in use. Read this first before making changes.

## Project Overview

This is a cross-browser browser extension (Chrome/Firefox, Manifest V3) that lets users fact-check selected text or images on any web page by sending them to a configurable Large Language Model (LLM) endpoint. The extension itself does not perform fact-checking; it provides the UI, context-menu integration, image preprocessing, prompt assembly, and streaming response handling that connect the user to their chosen model.

Key capabilities:

- Highlight text or right-click an image to fact-check via the browser context menu.
- Supports OpenAI-compatible cloud endpoints (OpenRouter, Mistral, Kimi, ChatGPT, Gemini, DeepSeek, MiniMax, Qwen), local endpoints (Ollama, LM Studio), and the Anthropic Messages API (Claude) via a per-endpoint `apiType` switch.
- Streaming LLM responses with OpenAI-compatible, Gemini, and Anthropic SSE parsing, including reasoning/thinking output.
- Built-in (`scientist`, `satirist`) and user-defined custom fact-checking roles/personas.
- Adjustable sampling parameters (temperature, top_p, frequency/presence penalty) per request.
- Optional lightRAG integration for knowledge-graph-augmented context.
- Internationalization for `de`, `en`, `es`, `fr`, `pt`.
- All user data (endpoints, API keys, roles, RAG config) is stored locally in the browser; nothing is sent anywhere except to the user's chosen LLM/RAG endpoint.

Internal package name: `fact-check-extension`. Version numbers are maintained in `public/manifest.json` (Chrome) and `public/manifest.firefox.json` (Firefox) — currently `4.0.6` — not in `package.json`. Notable changes are recorded in `CHANGELOG.md`.

## Technology Stack

- **Language:** TypeScript 5.5+ (strict mode)
- **UI Framework:** Svelte 5 (runes API: `$state`, `$derived`, `$effect`, `$props`, snippets)
- **App Framework:** SvelteKit 2 with `sveltekit-adapter-chrome-extension` (used only for type generation / `svelte-kit sync`; the extension is not a traditional SvelteKit app)
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3.4 + `@tailwindcss/forms` + Skeleton UI (`@skeletonlabs/skeleton`, `@skeletonlabs/tw-plugin`), theme preset `rocket`, class-based dark mode
- **i18n:** `typesafe-i18n` 5.26, base locale `en` (config: `.typesafe-i18n.json`)
- **Testing:** Playwright 1.57 with Chromium (headed)
- **Package Manager:** `bun` is the project preference (`bun.lockb` is present; `package-lock.json` also exists)
- **Browser APIs:** Chrome Extension Manifest V3 (`storage`, `activeTab`, `clipboardWrite`, `contextMenus`, `host_permissions: <all_urls>`)

## Repository Layout

```
├── public/                      # Static extension assets copied to dist
│   ├── manifest.json            # Chrome MV3 manifest (background.service_worker)
│   ├── manifest.firefox.json    # Firefox MV3 manifest (background.scripts + gecko settings)
│   ├── popup.html               # Extension popup entry HTML (loads popup.js + popup.css)
│   └── icons/                   # Extension icons
├── src/                         # All TypeScript / Svelte source
│   ├── main.ts                  # Popup entry used by the build (mounts Popup, imports app.css)
│   ├── popup.ts                 # Legacy popup variant; NOT referenced by any build config or HTML
│   ├── background.ts            # Service worker: context menus + open popup
│   ├── content.ts               # Content script: image/text selection + page messaging
│   ├── TSelectedContent.ts      # SelectedContent union type (SelectedImage | SelectedText) + guards
│   ├── popupState.svelte.ts     # Top-level popup view state (persisted)
│   ├── routes/                  # SvelteKit adapter placeholder (+page.svelte is default)
│   ├── app.html / app.css       # SvelteKit app shell + global styles (Tailwind)
│   ├── i18n/                    # typesafe-i18n locales + generated utilities
│   └── lib/
│       ├── components/          # Svelte UI components
│       ├── components/steps/    # Accordion steps (Selected, Connection, Response, AdvancedParams)
│       ├── components/icons/    # Inline SVG icon components
│       ├── state/               # Reactive persistent state classes
│       └── util/                # Business logic utilities
├── tests/                       # Playwright E2E tests
│   ├── config.example.ts        # Example test credentials (copy to config.ts)
│   ├── extension.spec.ts        # Main extension E2E suite (12 tests)
│   ├── rag_duplicate.spec.ts    # RAG duplicate-title test
│   └── README.md                # Test setup documentation
├── scripts/
│   └── source-firefox.mjs       # Packages Firefox source archive for Mozilla review
├── www/                         # Static documentation website (also see README.md)
├── dist-chrome/                 # Chrome build output (gitignored)
├── dist-firefox/                # Firefox build output (gitignored)
├── vite.config.ts               # Popup UI build config
├── vite.scripts.config.ts       # Background + content script build config
├── svelte.config.js             # SvelteKit adapter config
├── tailwind.config.ts           # Tailwind + Skeleton theme config
├── postcss.config.js            # PostCSS (tailwindcss, autoprefixer)
├── tsconfig.json                # TypeScript config (extends .svelte-kit/tsconfig.json)
├── eslint.config.js             # ESLint flat config
├── .prettierrc                  # Prettier config
├── playwright.config.ts         # Playwright config
├── CHANGELOG.md                 # Release notes per manifest version
└── .typesafe-i18n.json          # i18n generator config
```

## Build System

The extension is built in **three separate Vite passes**:

1. `vite.config.ts` builds the popup UI from `src/main.ts` (rollup input aliased to `popup`) into `popup.js` + `popup.css` (`cssCodeSplit: true`). `public/` is copied verbatim into the output.
2. `vite.scripts.config.ts` with `SCRIPT_ENTRY=content` builds `src/content.ts` into `content.js`.
3. `vite.scripts.config.ts` with `SCRIPT_ENTRY=background` builds `src/background.ts` into `background.js`.

Output directory is controlled by `OUT_DIR` (`dist-chrome` or `dist-firefox`).

### Important Scripts

```bash
# Install dependencies
bun install

# Development server (serves the popup standalone, not as an extension)
bun run dev

# Type-check and Svelte check (svelte-kit sync + svelte-check)
bun run check

# Build for Chrome (outputs to dist-chrome/)
bun run build

# Build for Firefox (outputs to dist-firefox/, then copies manifest.firefox.json over manifest.json)
bun run build:firefox

# Lint and format checks (Prettier check + ESLint)
bun run lint

# Auto-format with Prettier
bun run format

# Run Playwright E2E tests (requires dist-chrome/ and tests/config.ts)
bun run test

# Create a Chrome release zip (check + build + zip)
bun run release

# Create a Firefox release zip + source archive
bun run release:firefox

# Regenerate i18n utilities (typesafe-i18n watcher; run after changing translation keys)
bun run typesafe-i18n
```

### Build Notes

- `build:firefox` copies `public/manifest.firefox.json` over `dist-firefox/manifest.json` because Firefox requires `background.scripts` instead of `background.service_worker` and adds `browser_specific_settings.gecko` (id, `strict_min_version`, data-collection permissions).
- `vite.scripts.config.ts` outputs scripts in `iife` format, targets `chrome87` / `firefox102`, and sets `emptyOutDir: false` so the three passes do not wipe each other's output.
- The popup entry in production is `public/popup.html`, which loads `popup.js` and `popup.css`. `src/popup.ts` exists but is unused — the built popup entry is `src/main.ts`.
- Do not treat `dist-chrome/` or `dist-firefox/` as source; they are generated and gitignored.

## Runtime Architecture

### Components

1. **Background service worker** (`src/background.ts`)

   - Creates context-menu entries (`fact-check-image`, `fact-check-text`, `fact-check-text-context`) both on install and at worker startup.
   - On context-menu click, stores pending content (`pendingContextMenuImage` / `pendingContextMenuText` / `pendingContextMenuContext`) in `chrome.storage.session` (falling back to `chrome.storage.local`) and calls `chrome.action.openPopup()` synchronously (required for the Firefox user-gesture context). If `openPopup()` fails for an image, it falls back to messaging the content script (`contextMenuImageSelected`).
   - Translates context-menu labels by importing the locale files directly and selecting via `chrome.i18n.getUILanguage()`.

2. **Content script** (`src/content.ts`)

   - Injected into all URLs (`<all_urls>`).
   - Supports an in-page image selection mode triggered by the popup: adds hover styles, suppresses click/pointer/touch events, captures the clicked image, resizes and base64-encodes it via `processImage`, shows an in-page notification, and notifies the extension (`imageSelected`).
   - Exposes `getSelectedContent`, `enableImageSelect`, `disableImageSelect`, `enableTextSelect`, and `contextMenuImageSelected` actions via `chrome.runtime.onMessage`.

3. **Popup UI** (`src/lib/components/Popup.svelte` and children)
   - A Svelte 5 component tree mounted into `document.body` by `src/main.ts`.
   - Root view switcher over `popupState` (`DEFAULT`, `CONFIG`, `ROLE_CONFIG`, `RAG_CONFIG`) plus a first-run `Introduction` gate (`hasSeenIntroduction`); defaults to `CONFIG` when no endpoint exists.
   - Main workflow is a Skeleton `Accordion` in `FactCheck.svelte`: **Selected** → **Connection** → **Response**, plus a response-length slider (3–500 words, `apiRequest.value.range`) and the primary "Check" button (`data-testid="fact-check-btn"`).

### Data Flow

1. User selects text/image (or adds context) via the context menu.
2. Background worker stores pending content and opens the popup.
3. Popup reads pending content, processes images through `processImage` (fetch → resize to max 512px → JPEG data URL), and stores the selection in `unifiedStorage`.
4. User chooses endpoint, role, optional RAG endpoints, response length, and (under "Advanced") sampling parameters.
5. `checkFact()` aborts any in-flight request, awaits all `PersistState.ready` promises, optionally queries the selected RAG endpoints (POST `{query, mode, top_k}` with `X-API-Key`), then builds and sends the LLM request with `stream: true`:
   - **OpenAI-compatible (`apiType: 'openai'`, default):** `Authorization: Bearer <apiKey>`, `messages` array; the role is either a `system` message or inlined into the user message depending on `rolePlacement`.
   - **Anthropic (`apiType: 'anthropic'`):** `x-api-key` + `anthropic-version: 2023-06-01` headers, `max_tokens: 4096`, role sent via the top-level `system` field, image data URLs converted to base64 `image` blocks.
   - Enabled sampling params from `modelParams` are merged in; `frequency_penalty`/`presence_penalty` are dropped for Anthropic (unsupported).
6. `handleStreamResponse()` reads the SSE stream line-by-line and accumulates text/reasoning into state. It parses OpenAI `choices[].delta.content` and `delta.reasoning`, Ollama-style `message.content`, Gemini `candidates[].content.parts[].text`, and Anthropic `content_block_start` / `content_block_delta` / `thinking_delta` events; state transitions through `THINKING` → `STREAMING` → `FINISHED`.
7. Result is rendered in the Response step; the user can copy it to the clipboard.

## Code Organization

### `src/lib/state/` — Reactive Persistent State

All long-lived state is stored in `chrome.storage.local` (or `window.localStorage` outside the extension) via the `PersistState` base class in `src/lib/util/PersistState.svelte.ts`. State classes use Svelte 5 runes and are singletons.

| Module                   | Responsibility                                                                                                                                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `endpoints.svelte.ts`    | LLM endpoint list, selected endpoint, last used. `Endpoint` = `{title, url, apiKey, model, canProcessImages, rolePlacement?, apiType?}`                                                                 |
| `ragEndpoints.svelte.ts` | RAG endpoint list                                                                                                                                                                                       |
| `apiRequest.svelte.ts`   | Request state (`EMPTY`, `LOADING`, `FETCHING_RAG`, `THINKING`, `STREAMING`, `FINISHED`, `ERROR`), response-length `range`, `rolePlacement` (mirrored from the selected endpoint by `Connection.svelte`) |
| `modelParams.svelte.ts`  | Sampling params `temperature` (0.9), `top_p` (0.93), `frequency_penalty` (0.5), `presence_penalty` (0.4), each `{value, enabled}`                                                                       |
| `view.svelte.ts`         | UI-only transient state (accordion `step`, add/edit form visibility) — plain runes class, NOT persisted                                                                                                 |
| `theme.svelte.ts`        | Light/dark theme preference                                                                                                                                                                             |
| `L.svelte.ts`            | i18n accessor: loads all locales synchronously and picks one from `navigator.language`                                                                                                                  |

`src/popupState.svelte.ts` (top-level popup view) and `src/lib/util/unifiedStorage.svelte.ts` (selected content, result, reasoning, context text, selected RAG endpoints, role, `hasSeenIntroduction`) are also `PersistState` singletons.

`PersistState` serializes with `JSON.stringify` directly inside `$effect.root(() => $effect(...))` so nested property reads establish fine-grained reactive dependencies synchronously (this avoids Chrome/Firefox differences with async serialization), and exposes a `ready` promise.

### `src/lib/util/` — Business Logic

| Module                           | Responsibility                                                                                            |
| -------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `checkFact.svelte.ts`            | Orchestrates abort, RAG fetch, and the LLM fetch (OpenAI vs Anthropic branches, param collection)         |
| `handleStreamResponse.svelte.ts` | Parses streaming SSE/JSON responses (OpenAI, Ollama, Gemini, Anthropic formats; reasoning support)        |
| `getSystemRole.svelte.ts`        | Builds the system prompt from `roleTemplate` + selected role + word count + optional user context         |
| `role.svelte.ts`                 | Built-in roles (`scientist`, `satirist`) exported as `basicRoles`/`roles`, plus the master `roleTemplate` |
| `customRoles.svelte.ts`          | User-defined custom roles persistence (includes a `name` → `id` migration effect)                         |
| `imageProcessing.ts`             | Fetches, resizes (max 512px), and base64-encodes images as JPEG data URLs                                 |
| `unifiedStorage.svelte.ts`       | Central app state (see above)                                                                             |
| `PersistState.svelte.ts`         | Base class for persisted reactive state                                                                   |

### `src/lib/components/` — UI

- `Popup.svelte`: Root view switcher + introduction gate.
- `FactCheck.svelte`: Accordion wrapper, response-length slider, RAG toggle, main "Check" action.
- `steps/Selected.svelte`: Content selection / input, context, pending-content handling.
- `steps/Connection.svelte`: Endpoint selector (filtered by `canProcessImages` when an image is selected), role selector, RAG endpoint checkboxes, "Advanced" toggle hosting `AdvancedParams`.
- `steps/AdvancedParams.svelte`: Sliders + enable checkboxes for the four sampling params, with reset-to-default icons.
- `steps/Response.svelte`: Streaming result display and copy-to-clipboard.
- `Config.svelte` / `EndpointList.svelte` / `AddEndpointForm.svelte` / `EditEndpointForm.svelte`: Endpoint management with built-in templates and an API-type selector (`openai` / `anthropic`).
- `RoleConfig.svelte`: Built-in and custom role editor.
- `RagConfig.svelte` / `RagEndpointList.svelte` / `EditRagEndpointForm.svelte`: RAG endpoint management.
- `Introduction.svelte`: First-run intro screen.
- `icons/`: Inline SVG icon components.

### `src/i18n/` — Translations

- Base locale is `en`. Other locales are `de`, `es`, `fr`, `pt`.
- Each locale has an `index.ts` exporting a translation object that `satisfies BaseTranslation`.
- `i18n-types.ts`, `i18n-util.ts`, `i18n-util.async.ts`, `i18n-util.sync.ts`, `i18n-svelte.ts`, and `formatters.ts` are generated by `typesafe-i18n`. Do not hand-edit them; run `bun run typesafe-i18n` after adding or changing translation keys.
- New translation keys must be added to `src/i18n/en/index.ts` first, then mirrored in the other locale files.

## Conventions and Style

### TypeScript / Svelte

- Strict TypeScript is enabled (`strict: true`; `tsconfig.json` extends `.svelte-kit/tsconfig.json`, so run `bun run check` — not bare `tsc`).
- Extension scripts reference Chrome types with `/// <reference types="chrome" />` (global `chrome` types come from `tsconfig.json` `"types": ["chrome", "node"]`).
- Svelte 5 runes are required for new code. Do not introduce the legacy `$:` reactive syntax; prefer `onclick` over the legacy `on:click` directive (some existing components still use `on:click` — leave them unless you are editing them anyway).
- Use `$state` for mutable state, `$derived` / `$derived.by` for computed values, and `$effect` for side effects.
- Components receive props via `$props()`.
- Snippets are used inside Skeleton `AccordionItem` components.

### Formatting

Prettier configuration (`.prettierrc`):

- Tabs (not spaces)
- Single quotes
- Trailing commas
- No semicolons
- Print width 100
- `prettier-plugin-svelte` and `prettier-plugin-tailwindcss` are loaded

Run `bun run format` before finishing. Run `bun run lint` (Prettier check + ESLint) to verify.

### ESLint

Flat config in `eslint.config.js`:

- `@eslint/js` recommended
- `typescript-eslint` recommended
- `eslint-plugin-svelte` recommended + prettier
- `eslint-config-prettier`
- Globals: browser, node, webextensions

Ignored directories: `build/`, `.svelte-kit/`, `dist-chrome/`, `dist-firefox/`.

### State Mutation Conventions

- Prefer mutating `PersistState` values through direct property mutation for nested reactivity (`endpoints.value.list.push(...)` works for arrays).
- When replacing a top-level persisted object (e.g., `unifiedStorage.value = { ...unifiedStorage.value, selectedContent: ... }`), spread the existing object to avoid losing fields.
- Always `await state.ready` before reading or writing persisted state in async logic (`checkFact()` awaits all four relevant stores up front).

### Endpoint Templates

`AddEndpointForm.svelte` contains a hard-coded `endpointTemplateMap` with presets for OpenRouter, Mistral, Kimi, LM Studio, Ollama, DeepSeek, Gemini, MiniMax, Qwen, ChatGPT, and Anthropic. When adding a new provider:

1. Add the template to `endpointTemplateMap` (`title`, `url`, `model`, optional `apiKeyUrl`).
2. Local templates (`ollama`, `lmstudio`) default `rolePlacement` to `inline`; all others default to `system`.
3. The `anthropic` template sets `apiType: 'anthropic'`; everything else is `'openai'`.

### Prompt Construction

- The master prompt template lives in `src/lib/util/role.svelte.ts` (`roleTemplate`). Placeholders: `{roleStyle}` and `{wordCount}` (filled from the selected role and the response-length slider).
- The template mandates answering in the user's query language and contains safety protocols that prioritize factual accuracy over style requests.
- Optional user context is appended in `getSystemRole.svelte.ts` (`--ADDITIONAL CONTEXT--`).
- RAG context is injected as `ADDITIONAL CONTEXT FROM KNOWLEDGE GRAPH:` (entities / relationships / chunks per source) in `checkFact.svelte.ts`.
- With `rolePlacement: 'inline'`, the role and content are merged into a single user message prefixed with the German headers `DEINE AUFGABE:` / `CHECKE DIE FOLGENDE AUSSAGE:` (this is intentional, used mainly for local models).
- For Anthropic endpoints, the role is sent via the top-level `system` field instead of a `system` message.

## Testing Strategy

The project uses Playwright for end-to-end testing against a real built Chrome extension. There is no unit-test setup.

### Setup

1. Build the extension: `bun run build`
2. Copy `tests/config.example.ts` to `tests/config.ts`.
3. Add a real endpoint/API key/model in `tests/config.ts` (the example targets OpenRouter).
4. Install Playwright browsers: `bunx playwright install --with-deps`

### Running Tests

```bash
bun run test
# or
bunx playwright test
```

### Test Characteristics

- Tests launch a persistent Chromium context with `--load-extension=dist-chrome` and extract the extension ID from the service worker URL.
- They open `chrome-extension://${extensionId}/popup.html` directly.
- `initializeExtension()` skips the intro screen and adds an endpoint if none exists.
- Tests run in **headed** mode (`headless: false`) so the extension popup can render; `workers: 1` and `fullyParallel: true` (the suite shares one persistent context, so parallelism is effectively serialized).
- Clipboard tests explicitly grant `clipboard-read` / `clipboard-write` permissions.
- `tests/extension.spec.ts` covers configure+check, sequential checks, custom roles, built-in roles, clipboard copy, empty input, response relevance, and endpoint selection persistence; `tests/rag_duplicate.spec.ts` covers duplicate RAG endpoint titles.

### Adding Tests

- Add new test files under `tests/`; Playwright picks them up automatically.
- Use `data-testid` attributes for stable selectors (used throughout the components).
- Keep tests independent; each test creates a new page from the shared context.
- Do not commit `tests/config.ts` (it is gitignored).

## Deployment / Release

### Chrome

```bash
bun run release
```

This runs `check`, `build`, removes `.DS_Store` files from `dist-chrome/`, and creates `release-YYYY-MM-DD.zip` in the project root. The zip is uploaded to the Chrome Web Store.

### Firefox

```bash
bun run release:firefox
```

This runs `check`, builds for Firefox, creates `release-firefox-YYYY-MM-DD.zip`, and also runs `scripts/source-firefox.mjs`, which packages source files into `source-firefox-YYYY-MM-DD.zip` for Mozilla review.

### Version Bumping

Update the `"version"` field in both `public/manifest.json` and `public/manifest.firefox.json` (kept in sync except where Firefox requires different keys), and add a corresponding entry to `CHANGELOG.md`.

## Security Considerations

- **API keys are stored in `chrome.storage.local` in plaintext.** This is consistent with local-browser extension storage, but do not log or expose keys.
- The extension requests `<all_urls>` host permission and `activeTab` so it can read page selections and send them to user-configured endpoints.
- All LLM/RAG requests use `fetch` from the extension context, sending the selected content and API key to the user-specified URL only. Anthropic endpoints receive the key as `x-api-key`; all others as `Authorization: Bearer`.
- Image processing happens in the content script using a canvas; images are resized to max 512px and sent as base64 JPEG data URLs.
- The system prompt includes safety instructions that prioritize factual accuracy over style requests.
- `tests/config.ts` (real API credentials) is gitignored — never commit it.

## Common Pitfalls

- **Do not rely on `dist-chrome/` or `dist-firefox/` being present.** They are gitignored and must be regenerated with `bun run build` or `bun run build:firefox`.
- **Do not edit generated i18n files** (`i18n-types.ts`, `i18n-util*.ts`, `i18n-svelte.ts`, `formatters.ts`). Change `src/i18n/en/index.ts` and run `bun run typesafe-i18n`.
- **The popup entry in production is `src/main.ts` (built as `popup.js`, loaded by `public/popup.html`).** `src/popup.ts` is an unused legacy variant — do not wire new code into it.
- **Firefox and Chrome manifests differ.** Chrome uses `background.service_worker`; Firefox uses `background.scripts` plus `browser_specific_settings.gecko`. Keep both files updated when adding permissions or changing metadata.
- **Anthropic endpoints are a separate request/response format.** When changing request building or stream parsing, handle both the `apiType === 'anthropic'` branch in `checkFact.svelte.ts` and the Anthropic event types in `handleStreamResponse.svelte.ts`. Never send `frequency_penalty`/`presence_penalty` to Anthropic.
- **Svelte 5 runes only** for new code; legacy reactivity/event syntax should not be introduced.
- **Always run `bun run check` after non-trivial changes.** Svelte-check catches type errors in `.svelte` files that `tsc` alone misses, and it requires `.svelte-kit/tsconfig.json` (generated by `svelte-kit sync`, which `check` runs first).
