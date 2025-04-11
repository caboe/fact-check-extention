# Dark Mode Implementation Plan

This document outlines the architectural plan for adding a user-toggleable dark mode to the Chrome Extension.

    ## 1. Update Configuration (`tailwind.config.ts`)

*   **Objective:** Configure Tailwind CSS and the Skeleton UI plugin to support class-based dark mode switching.
*   **Action:**
    *   Modify the `darkMode` property in `tailwind.config.ts` from `'media'` to `'class'`.
    *   Add a suitable dark theme (e.g., `vintage`) to the `themes.preset` array within the `skeleton` plugin configuration in `tailwind.config.ts`.

```typescript
// Example tailwind.config.ts changes
import forms from '@tailwindcss/forms'
import { join } from 'path'
import type { Config } from 'tailwindcss'
import { skeleton } from '@skeletonlabs/tw-plugin'

const config = {
    darkMode: 'class', // Changed from 'media'
    content: [
        // ... existing content paths
        join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}'),
    ],
    theme: {
        extend: {},
    },
    plugins: [
        forms,
        skeleton({
            themes: {
                preset: [
                    'crimson', // Keep existing light theme
                    'vintage', // Add a dark theme
                    // Add other themes as needed
                ],
            },
        }),
    ],
    // ... rest of config
} satisfies Config

export default config
```

## 2. Create Theme State Management (`src/lib/state/theme.svelte.ts`)

*   **Objective:** Create a persistent Svelte 5 state (`$state`) to manage the current theme preference ('light' or 'dark') and apply necessary DOM changes.
*   **Action:**
    *   Create a new file: `src/lib/state/theme.svelte.ts`.
    *   Define a `$state` object to hold the theme preference (e.g., `currentTheme: 'light' | 'dark'`).
    *   Use `chrome.storage.sync.get` to initialize the state from stored preferences on load (defaulting to 'light' or system preference if desired).
    *   Use a Svelte 5 `$effect` to:
        *   Read the `currentTheme` state.
        *   Add/remove the `dark` class on the `document.documentElement` (`<html>` tag).
        *   Set the `data-theme` attribute on `document.body` (e.g., 'crimson' for light, 'vintage' for dark).
        *   Persist the `currentTheme` value to `chrome.storage.sync.set` whenever it changes.

## 3. Add UI Toggle (`src/lib/components/Config.svelte`)

*   **Objective:** Provide a user interface element for switching between light and dark modes.
*   **Action:**
    *   Import the theme state into `src/lib/components/Config.svelte`.
    *   Add a suitable UI control (e.g., Skeleton UI's `<SlideToggle>`) within the component.
    *   Bind the control's state (checked/unchecked) to the `currentTheme` state (mapping 'dark' to checked, 'light' to unchecked, or vice-versa). Update the `currentTheme` state when the toggle is changed.

## 4. Apply Theme Dynamically

*   **Objective:** Ensure the correct theme styles are applied automatically based on the state.
*   **Action:** The `$effect` created in Step 2 handles this automatically. It listens for changes in the `currentTheme` state and updates the `<html>` class and `<body>` attribute accordingly. The initial theme set in `src/app.html` (`data-theme="skeleton"`) can be removed or ignored, as the state will override it on load.

## Visual Plan (Mermaid Diagram)

```mermaid
graph TD
    subgraph User Interaction
        A[User toggles switch in Config.svelte] --> B{Theme State};
    end

    subgraph State Management (theme.svelte.ts)
        B -- Updates --> C[currentTheme ('light'/'dark')];
        C -- Persists --> D[chrome.storage.sync];
        B -- On Load/Update --> E{$effect};
    end

    subgraph DOM Updates (via $effect)
        E --> F[Add/Remove 'dark' class on <html>];
        E --> G[Set 'data-theme' on <body> ('crimson'/'vintage')];
    end

    subgraph Initial Load
        H[Extension Starts] --> B;
        D -- Loads Initial State --> B;
    end

    subgraph Configuration
        I[tailwind.config.ts: darkMode='class']
        J[tailwind.config.ts: themes=['crimson', 'vintage']]
    end