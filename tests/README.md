# Testing Setup

This project uses Playwright for end-to-end tests targeting the built extension UI.

## Prerequisites

- Install `bun` (or use Node with `npx`).
- Install Playwright browsers: `bunx playwright install --with-deps`.

## Build the extension

- Run `bun run build` to produce the `dist` folder used in tests.
- Tests load the built extension from `dist` (`tests/extension.spec.ts:12`–`tests/extension.spec.ts:22`).

## Configure test credentials

- Copy `tests/config.example.ts` to `tests/config.ts`.
- Set your endpoint values:
  - `apiKey`: your API key.
  - `model`: e.g. `z-ai/glm-4.5v`.
  - `url`: e.g. `https://openrouter.ai/api/v1/chat/completions`.
- The file is consumed by tests (`tests/extension.spec.ts:3`). Avoid committing secrets.

## Run tests

- `bun run test` or `bunx playwright test`.
- Tests open the extension popup, skip intro if present, and configure an endpoint using values from `tests/config.ts`. They then perform fact checks and verify responses.

## Notes

- Service worker detection and extension ID extraction: `tests/extension.spec.ts:25`–`tests/extension.spec.ts:35`.
- A persistent Chromium context is launched with the built extension: `tests/extension.spec.ts:17`–`tests/extension.spec.ts:23`.
- Clipboard tests grant permissions within Playwright and verify copied text: `tests/extension.spec.ts:248`–`tests/extension.spec.ts:260`.
