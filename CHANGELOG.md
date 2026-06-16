# Changelog

All notable changes to the Fact Spreader browser extension.

## [4.0.6] – 2026-06-14

### Added

- Anthropic API support with native Messages API format, `x-api-key` auth, `max_tokens`, system prompt via top-level `system` field, image conversion from data URLs to base64 blocks, and streaming SSE parsing for `content_block_delta`/`thinking_delta` events
- API type selector (`openai` / `anthropic`) in endpoint add/edit forms
- Anthropic direct API template (`claude-sonnet-4-5-20250929`)
- Re-added Mistral endpoint template (`mistral-small-latest`)

### Changed

- Made satirist role text sound more natural
- Enhanced interest analysis with personalized rhetorical questioning

### Documentation

- Added AGENTS.md comprehensive project reference guide

## [4.0.5] – 2026-05-30

### Fixed

- Resolved endpoint selection and storage state management issues

## [4.0.4] – 2026-05-28

### Added

- Cross-browser build system refactored for Chrome and Firefox compatibility

### Fixed

- Updated manifest icon references to use correctly sized favicon files
- Fixed P0 stability issues (launch blockers)

### Changed

- Updated extension description for SEO optimization

## [4.0.3] – 2026-05-15

### Fixed

- Firefox performance problems

### Changed

- Applied consistent formatting across multiple files
- Changed default output directory to `dist-chrome`

## [4.0.2] – 2026-05-10

### Fixed

- Ensured context menu data is saved before opening popup
- Ensured reliable state persistence across browsers

### Documentation

- Added Firefox installation instructions to README

## [4.0.1] – 2026-05-05

### Fixed

- Prevented duplicate event listeners and cleaned up build config
- Trimmed whitespace from endpoint form inputs

## [4.0.0] – 2026-04-28

### Added

- LightRAG integration for fetching and using structured knowledge-graph-augmented context
- RAG endpoint management with duplicate title validation
- Toggle to enable/disable RAG usage
- Audio recording and transcription capability with language selection

### Changed

- Refactored role configuration to use popup state
- MCP JSON Playwright configuration added

### Documentation

- Updated README with improved formatting

## [3.0.2] – 2026-04-20

### Added

- Firefox browser support with improved context menu handling
- Documentation website with styles and images

### Fixed

- Improved error handling and context menu support

### Changed

- Updated default for OpenRouter endpoint
- Added data collection permissions for Firefox manifest

## [3.0.1] – 2026-04-12

### Added

- Extension installed message
- Copy endpoint functionality with new icon
- Connection UI now displays selected role and connected endpoint
- i18n extended to Spanish, French, and Portuguese
- Emojis in context menu strings for better UX
- Isolated content script build process via dedicated Vite config

### Fixed

- Reset API request state to EMPTY when content selection or context changes
- Hide edit endpoint form when close icon is triggered

### Removed

- Mistral endpoint (API problems)

## [3.0.0] – 2026-04-01

### Added

- Context menu option to fact-check selected text directly
- Context menu option to use selected text as additional context
- Auto-open extension popup for fact-checking
- i18n support for context menu titles
- ES module type for background service worker
- Help dialog explaining how to select content via context menu

### Changed

- Relocated response length range input to FactCheck component
- Improved icon and minimum height for popup

## [2.7.1] – 2026-03-24

### Added

- Image fact-checking via context menu
- Centralized notification display for status messages

### Fixed

- Removed unintended copy button

## [2.7.0] – 2026-03-18

### Added

- `thinking` state for API requests providing better user feedback
- Endpoint-specific system prompt role placement configuration (system vs inline message)
- E2E tests with Playwright framework
- `data-testid` attributes for stable test selectors

### Changed

- Centralized fact-check button in UI
- Updated UI labels and translations

### Documentation

- Updated extension description and web store marketing content

## [2.6.0] – 2026-03-10

### Added

- Streaming reasoning display for models that support it
- Role identification refactored to use `id` instead of `name`
- Enhanced role description examples and new role name translations

### Fixed

- Ignored SSE comments when handling stream responses
- Minor typos fixed

### Changed

- Role configuration improvements
- Content Security Policy added to Vite dev server

## [2.5.1] – 2026-03-04

### Fixed

- Ensured message channels remain open for async responses

## [2.5.0] – 2026-02-28

### Added

- Multiple role options (Scientist as default, Satirist, and more)
- "Create from this role" functionality for custom roles
- Role key translations
- Length-optimized LLM outputs

### Changed

- Updated model templates
- Better satirist role persona
- Accordion icons aligned left

## [2.1.1] – 2026-02-15

### Changed

- Switched to style input for request configuration

## [2.1.0] – 2026-02-10

### Added

- Option to add user context to fact-checking requests
- API key URL links in endpoint form with improved validation

## [2.0.1] – 2026-02-05

### Added

- MiniMax endpoint template
- Better error messages across the board
- Abort current request when starting a new one
- More detailed request state tracking
- Configurable role size selection

### Fixed

- Visibility and switch component issues
- Empty state handling
- Minimum height layout fixes
- Last used endpoint selection persistence
- Improved Ollama local model support
- Submit button no longer blocked during checking

### Changed

- New favicon
- Use inline role placement for local models
- Improved system role definition wording

## [2.0.0] – 2026-01-28

### Added

- Streaming LLM response support with real-time text display
- Role system with configurable styles/tones (Scientist, Satirist)
- Dark mode with automatic browser preference detection
- Image fact-checking via content script with hover selection
- Internationalization (i18n) framework with English and German
- Endpoint management with built-in templates (OpenRouter, Kimi, ChatGPT, Gemini, DeepSeek, Ollama, LM Studio, Qwen, Claude, Mistral)
- Persistent local storage for endpoints, roles, and state
- Context menu integration for text and image selection
- Accordion workflow UI (Selected → Connection → Response)
- Copy-to-clipboard with visual confirmation overlay
- Toggle for image selection mode in-page
- Auto-growing textarea for content input
- Extension popup with emoji-enhanced UI

### Changed

- Upgraded to Svelte 5 runes API
- Cross-browser storage abstraction (chrome.storage.local with localStorage fallback)
- Crimson theme with Skeleton UI component library

## [1.0.3] – 2026-01-15

- Initial public release
- Basic text fact-checking via LLM endpoints
- Chrome Extension Manifest V3
- Endpoint configuration with API key management
- Configurable settings page
