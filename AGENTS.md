# Agent Guide: Fact Check Extension

This document is a concise, project-specific reference for AI coding agents working on the **Fact Check Extension** (also referred to as **Fact Spreader** in store listings). It describes the technology stack, build system, code organization, state model, testing strategy, and conventions that are actually in use. Read this first before making changes.

## Project Overview

This is a cross-browser browser extension (Chrome/Firefox) that lets users fact-check selected text or images on any web page by sending them to a configurable Large Language Model (LLM) endpoint. The extension itself does not perform fact-checking; it provides the UI, context-menu integration, image preprocessing, prompt assembly, and streaming response handling that connect the user to their chosen model.

Key capabilities:

- Highlight text or right-click an image to fact-check.
- Supports cloud endpoints (OpenRouter, Kimi, ChatGPT, Gemini, DeepSeek, MiniMax, Qwen) and local endpoints (Ollama, LM Studio).
- Streaming LLM responses with OpenAI-compatible and Gemini response parsing.
- Built-in and custom fact-checking roles/personas.
- Optional lightRAG integration for knowledge-graph-augmented context.
- Internationalization for `de`, `en`, `es`, `fr`, `pt`.
- All user data (endpoints, API keys, roles, RAG config) is stored locally in the browser; nothing is sent to a backend except the user's chosen LLM/RAG endpoint.

Store-facing name: `Fact Spreader`. Internal package name: `fact-check-extension`. Version numbers are maintained in `public/manifest.json` (Chrome) and `public/manifest.firefox.json` (Firefox), not in `package.json`.

## Technology Stack

- **Language:** TypeScript 5.5+
- **UI Framework:** Svelte 5 (runes API: `$state`, `$derived`, `$effect`, `$props`, snippets)
- **App Framework:** SvelteKit 2 with `sveltekit-adapter-chrome-extension` (used only for type generation / sync; the extension is not a traditional SvelteKit app)
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3.4 + `@tailwindcss/forms` + Skeleton UI (`@skeletonlabs/skeleton`, `@skeletonlabs/tw-plugin`), theme preset `rocket`
- **i18n:** `typesafe-i18n` 5.26, base locale `en`
- **Testing:** Playwright 1.57 with Chromium
- **Package Manager:** `bun` is used for scripts and CI-like checks (`bun.lockb` is present; `package-lock.json` also exists but `bun` is the project preference)
- **Browser APIs:** Chrome Extension Manifest V3 (`storage`, `activeTab`, `clipboardWrite`, `contextMenus`, `host_permissions: <all_urls>`)

## Repository Layout

```
/Users/caboe/project/fact-check-extension-2
├── public/                      # Static extension assets copied to dist
│   ├── manifest.json            # Chrome MV3 manifest
│   ├── manifest.firefox.json    # Firefox MV3 manifest
│   ├── popup.html               # Extension popup entry HTML
│   └── icons/                   # Extension icons
├── src/                         # All TypeScript / Svelte source
│   ├── main.ts                  # Dev-mode Vite entry (mounts Popup)
│   ├── popup.ts                 # Extension popup entry (mounts Popup, unmounts on unload)
│   ├── background.ts            # Service worker: context menus + open popup
│   ├── content.ts               # Content script: image/text selection + page messaging
│   ├── TSelectedContent.ts      # SelectedContent union type + guards
│   ├── popupState.svelte.ts     # Top-level popup view state
│   ├── routes/                  # SvelteKit adapter placeholder (+page.svelte is default)
│   ├── app.html / app.css       # SvelteKit app shell + global styles
│   ├── i18n/                    # typesafe-i18n translations + generated utilities
│   └── lib/
│       ├── components/          # Svelte UI components
│       ├── components/steps/    # Accordion steps (Selected, Connection, Response)
│       ├── components/icons/    # Inline SVG icon components
│       ├── state/               # Reactive persistent state classes
│       └── util/                # Business logic utilities
├── tests/                       # Playwright E2E tests
│   ├── config.example.ts        # Example test credentials (copy to config.ts)
│   ├── extension.spec.ts        # Main extension E2E suite
│   └── rag_duplicate.spec.ts    # RAG duplicate-title test
├── scripts/
│   └── source-firefox.mjs       # Packages Firefox source archive
├── dist-chrome/                 # Chrome build output (gitignored)
├── dist-firefox/                # Firefox build output (gitignored)
├── vite.config.ts               # Popup UI build config
├── vite.scripts.config.ts       # Background + content script build config
├── svelte.config.js             # SvelteKit adapter config
├── tailwind.config.ts           # Tailwind + Skeleton theme config
├── postcss.config.js            # PostCSS (tailwindcss, autoprefixer)
├── tsconfig.json                # TypeScript config
├── eslint.config.js             # ESLint flat config
├── .prettierrc                  # Prettier config
├── playwright.config.ts         # Playwright config
└── .typesafe-i18n.json          # i18n generator config
```

## Build System

The extension is built in **three separate Vite passes**:

1. `vite.config.ts` builds the popup UI from `src/main.ts` (or `src/popup.ts` is mapped via `popup.html`) into `popup.js` + `popup.css`.
2. `vite.scripts.config.ts` builds `src/content.ts` into `content.js`.
3. `vite.scripts.config.ts` builds `src/background.ts` into `background.js`.

Output directory is controlled by `OUT_DIR` (`dist-chrome` or `dist-firefox`).

### Important Scripts

```bash
# Install dependencies
bun install

# Development server (loads popup.html standalone, not as an extension)
bun run dev

# Type-check and Svelte check
bun run check

# Build for Chrome (outputs to dist-chrome/)
bun run build

# Build for Firefox (outputs to dist-firefox/)
bun run build:firefox

# Lint and format checks
bun run lint

# Auto-format with Prettier
bun run format

# Run Playwright E2E tests (requires dist-chrome/ and tests/config.ts)
bun run test

# Create a release zip from dist-chrome/
bun run release

# Create a Firefox release zip + source archive
bun run release:firefox

# Generate/regenerate i18n utilities (typesafe-i18n)
bun run typesafe-i18n
```

### Build Notes

- `build:firefox` copies `public/manifest.firefox.json` over `dist-firefox/manifest.json` because Firefox requires `background.scripts` instead of `background.service_worker` and adds `browser_specific_settings.gecko`.
- `vite.scripts.config.ts` outputs scripts in `iife` format and targets `chrome87` / `firefox102`.
- The popup entry in production is `public/popup.html`, which loads `popup.js` and `popup.css`. In dev mode `index.html` loads `src/main.ts`.
- Do not treat `dist-chrome/` or `dist-firefox/` as source; they are generated and gitignored.

## Runtime Architecture

### Components

1. **Background service worker** (`src/background.ts`)
   - Creates context-menu entries on install: "Fact Check this image", "Fact Check marked text", "Add as Context".
   - On context-menu click, stores pending content in `chrome.storage.session` (or `local` as fallback) and calls `chrome.action.openPopup()`.
   - Translates context-menu labels using the browser UI language.

2. **Content script** (`src/content.ts`)
   - Injected into all URLs (`<all_urls>`).
   - Supports an in-page image selection mode triggered by the popup: adds hover styles, suppresses click events, captures the clicked image, resizes it, base64-encodes it, and notifies the extension.
   - Exposes `getSelectedContent`, `enableImageSelect`, `disableImageSelect`, `enableTextSelect`, and `contextMenuImageSelected` actions via `chrome.runtime.onMessage`.

3. **Popup UI** (`src/lib/components/Popup.svelte` and children)
   - A Svelte 5 component tree rendered into `document.body`.
   - Uses an accordion workflow: **Selected** → **Connection** → **Response**.
   - Reads pending content from `chrome.storage.session` on mount.

### Data Flow

1. User selects text/image or adds context via the context menu.
2. Background worker stores pending content and opens the popup.
3. Popup reads pending content, processes images through `processImage`, and stores the selection in reactive state.
4. User chooses endpoint, role, optional RAG endpoints, and response length.
5. `checkFact()` builds a system prompt from the role template, optionally fetches RAG context, then `fetch()`es the LLM endpoint with streaming enabled.
6. `handleStreamResponse()` parses SSE chunks, supports OpenAI `choices[].delta.content`, `delta.reasoning`, and Gemini `candidates[].content.parts[].text` formats, and writes accumulating text/reasoning back to state.
7. Result is rendered; user can copy it to the clipboard.

## Code Organization

### `src/lib/state/` — Reactive Persistent State

All long-lived state is stored in `chrome.storage.local` via the `PersistState` class in `src/lib/util/PersistState.svelte.ts`. State classes use Svelte 5 runes and are singletons.

| Module | Responsibility |
|--------|----------------|
| `endpoints.svelte.ts` | LLM endpoint list, selected endpoint, last used |
| `ragEndpoints.svelte.ts` | RAG endpoint list |
| `apiRequest.svelte.ts` | Request state (`EMPTY`, `LOADING`, `FETCHING_RAG`, `THINKING`, `STREAMING`, `FINISHED`, `ERROR`) and response-length slider |
| `unifiedStorage.svelte.ts` | Selected content, result, reasoning, context text, selected RAG endpoints, role |
| `view.svelte.ts` | UI-only transient state (accordion step, add/edit form visibility) |
| `theme.svelte.ts` | Light/dark theme preference |
| `L.svelte.ts` | i18n loader/translation accessor |

`PersistState` handles the cross-browser differences between `chrome.storage.local` and `window.localStorage`, serializes inside `$effect` to establish fine-grained reactivity, and exposes a `ready` promise.

### `src/lib/util/` — Business Logic

| Module | Responsibility |
|--------|----------------|
| `checkFact.svelte.ts` | Orchestrates RAG fetch (if enabled) and LLM fetch; handles abort |
| `handleStreamResponse.svelte.ts` | Parses streaming SSE/JSON responses |
| `getSystemRole.svelte.ts` | Builds the system prompt from role template + context |
| `role.svelte.ts` | Built-in roles (`scientist`, `satirist`) and role template |
| `customRoles.svelte.ts` | User-defined custom roles persistence |
| `imageProcessing.ts` | Fetches, resizes (max 512px), and base64-encodes images |
| `unifiedStorage.svelte.ts` | Central app state (also listed above) |
| `PersistState.svelte.ts` | Base class for persisted reactive state |

### `src/lib/components/` — UI

- `Popup.svelte`: Root view switcher (`DEFAULT`, `CONFIG`, `ROLE_CONFIG`, `RAG_CONFIG`) and introduction gate.
- `FactCheck.svelte`: Accordion wrapper + main "Check" action.
- `steps/Selected.svelte`: Content selection / input, context, pending-content handling.
- `steps/Connection.svelte`: Endpoint selector, role selector, RAG toggle.
- `steps/Response.svelte`: Streaming result display and copy-to-clipboard.
- `Config.svelte` / `AddEndpointForm.svelte` / `EditEndpointForm.svelte`: Endpoint management with built-in templates.
- `RoleConfig.svelte`: Built-in and custom role editor.
- `RagConfig.svelte` / `RagEndpointList.svelte` / `EditRagEndpointForm.svelte`: RAG endpoint management.

### `src/i18n/` — Translations

- Base locale is `en`. Other locales are `de`, `es`, `fr`, `pt`.
- Each locale has an `index.ts` exporting a translation object that `satisfies BaseTranslation`.
- `i18n-types.ts`, `i18n-util.ts`, `i18n-util.async.ts`, `i18n-util.sync.ts`, and `i18n-svelte.ts` are generated by `typesafe-i18n`. Do not hand-edit them; run `bun run typesafe-i18n` after adding or changing translation keys.
- New translation keys must be added to `src/i18n/en/index.ts` first, then mirrored in the other locale files.

## Conventions and Style

### TypeScript / Svelte

- Strict TypeScript is enabled (`strict: true`).
- All extension scripts reference Chrome types with `/// <reference types="chrome" />`.
- Svelte 5 runes are required. Do not use the legacy `$:` reactive syntax for new code.
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
- Always `await state.ready` before reading or writing persisted state in async logic.

### Endpoint Templates

`AddEndpointForm.svelte` contains a hard-coded `endpointTemplateMap` with presets for OpenRouter, Kimi, LM Studio, Ollama, DeepSeek, Gemini, MiniMax, Qwen, and ChatGPT. When adding a new provider:

1. Add the template to `endpointTemplateMap`.
2. Ensure the `title`, `url`, `model`, and optional `apiKeyUrl` are correct.
3. Local templates (`ollama`, `lmstudio`) default `rolePlacement` to `inline`.

### Prompt Construction

- The master prompt template lives in `src/lib/util/role.svelte.ts` (`roleTemplate`).
- Placeholders: `{roleStyle}` and `{wordCount}`.
- Optional user context is appended in `getSystemRole.svelte.ts`.
- RAG context is injected as `ADDITIONAL CONTEXT FROM KNOWLEDGE GRAPH:` in `checkFact.svelte.ts`.
- The role can be placed either as a `system` message or inline in the user message (`rolePlacement`).

## Testing Strategy

The project uses Playwright for end-to-end testing against a real built Chrome extension.

### Setup

1. Build the extension: `bun run build`
2. Copy `tests/config.example.ts` to `tests/config.ts`.
3. Add a real endpoint/API key/model in `tests/config.ts`.
4. Install Playwright browsers: `bunx playwright install --with-deps`

### Running Tests

```bash
bun run test
# or
bunx playwright test
```

### Test Characteristics

- Tests launch Chromium with `--load-extension=dist-chrome` and extract the extension ID from the service worker URL.
- They open `chrome-extension://${extensionId}/popup.html` directly.
- `initializeExtension()` skips the intro screen and adds an endpoint if none exists.
- Tests run in **headed** mode (`headless: false`) so the extension popup can render.
- Workers are set to 1 (`workers: 1`) because the suite uses a single persistent browser context.
- Clipboard tests explicitly grant `clipboard-read` / `clipboard-write` permissions.

### Adding Tests

- Add new test files under `tests/`; Playwright picks them up automatically.
- Use `data-testid` attributes for stable selectors (existing IDs are used throughout components).
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

This builds for Firefox, creates `release-firefox-YYYY-MM-DD.zip`, and also runs `scripts/source-firefox.mjs`, which packages source files into `source-firefox-YYYY-MM-DD.zip` for Mozilla review.

### Version Bumping

Update the `"version"` field in both `public/manifest.json` and `public/manifest.firefox.json`. The two manifests are kept in sync except where Firefox requires different keys.

## Security Considerations

- **API keys are stored in `chrome.storage.local` in plaintext.** This is consistent with local-browser extension storage, but do not log or expose keys.
- The extension requests `<all_urls>` host permission and `activeTab` so it can read page selections and send them to user-configured endpoints.
- All LLM/RAG requests use `fetch` from the extension context, sending the selected content and API key to the user-specified URL only.
- Image processing happens in the content script using a canvas; images are resized to max 512px and sent as base64 data URLs.
- Content-script injection is skipped on `chrome://`, `chrome-extension://`, and `chrome.google.com` URLs to avoid restricted-scheme errors.
- The system prompt includes safety instructions that prioritize factual accuracy over style requests.

## Common Pitfalls

- **Do not rely on `dist-chrome/` or `dist-firefox/` being present.** They are gitignored and must be regenerated with `bun run build` or `bun run build:firefox`.
- **Do not edit generated i18n files** (`i18n-types.ts`, `i18n-util*.ts`, `i18n-svelte.ts`). Change `src/i18n/en/index.ts` and run `bun run typesafe-i18n`.
- **The popup entry in production is `public/popup.html`**, not `index.html`. `index.html` is for dev mode only.
- **Firefox and Chrome manifests differ.** Chrome uses `background.service_worker`; Firefox uses `background.scripts` plus `browser_specific_settings.gecko`. Keep both files updated when adding permissions or changing metadata.
- **Svelte 5 runes only.** Legacy reactivity may still compile but should not be introduced in new code.
- **Always run `bun run check` after non-trivial changes.** Svelte-check catches type errors in `.svelte` files that `tsc` alone misses.
