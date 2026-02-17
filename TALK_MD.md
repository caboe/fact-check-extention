# Fact Check Extension – Eine SvelteKit-basierte Browser-Erweiterung

## Inhaltsverzeichnis

1. [Einführung und Zweck der Erweiterung](#1-einführung-und-zweck-der-erweiterung)
2. [Technischer Aufbau und Architektur](#2-technischer-aufbau-und-architektur)
3. [Funktionsweise von Browser-Erweiterungen](#3-funktionsweise-von-browser-erweiterungen)
4. [Entwicklung und Debugging](#4-entwicklung-und-debugging)
5. [Build und Veröffentlichung](#5-build-und-veröffentlichung)

---

## 1. Einführung und Zweck der Erweiterung

### 1.1 Was ist die Fact Check Extension?

Die Fact Check Extension ist eine moderne Browser-Erweiterung, die den Prozess der Informationsüberprüfung im Web revolutioniert. Sie ermöglicht Nutzern, Texte und Bilder direkt in der Seite auszuwählen und durch KI-Modelle faktisch überprüfen zu lassen.

**Hauptfunktionen:**

- **Text-basierte Faktenprüfung**: Markieren Sie beliebigen Text auf einer Webseite und lassen Sie ihn durch LLMs (Large Language Models) verifizieren
- **Bild-basierte Analyse**: Rechte Maustaste auf Bilder → automatische Faktenprüfung durch multimodale Modelle
- **Multi-Provider Support**: Unterstützung für OpenAI, OpenRouter, Ollama, LM Studio und mehr
- **Kontext-erweiterte Anfragen**: Optionale Hinzufügung von Kontextinformationen für präzisere Ergebnisse
- **Rollenspezifische Antworten**: Konfigurierbare Personas (z.B. "Wissenschaftler", "Kritischer Rationalist")

### 1.2 Use Cases und Vorteile

**Für Journalisten und Content-Ersteller:**
- Schnelle Verifizierung von Aussagen in Artikeln
- Quellenkritik vor der Veröffentlichung
- Erkennung von Fake News und Falschinformationen

**Für Forscher und Akademiker:**
- Validierung von Studienbehauptungen
- Schnelle Literaturüberprüfung
- Unterstützung bei Quellenarbeit

**Für den täglichen Gebrauch:**
- Überprüfung von News-Artikeln
- Analyse von Social-Media-Posts
- Fakt-Check von E-Mails und Dokumenten

**Technische Vorteile:**
- **Privacy-fokussiert**: Alle Konfigurationen werden lokal im Browser gespeichert
- **Offline-fähig**: Unterstützung für lokale LLMs (Ollama, LM Studio)
- **Modular**: Erweiterbar durch neue Endpunkte und Rollen
- **Internationalisierung**: Unterstützung für Deutsch, Englisch, Spanisch, Französisch und Portugiesisch

### 1.3 Arbeitsweise

Der Prozess besteht aus drei einfachen Schritten:

1. **Auswahl**: Nutzer wählt Text oder Bild auf einer Webseite aus
2. **Verarbeitung**: Die Erweiterung sendet den Inhalt inklusive Fact-Check-Kommando und optionalem Kontext an ein LLM
3. **Ergebnis**: Das LLM analysiert den Inhalt und sendet das Ergebnis zurück an die Erweiterung

```typescript
// Beispiel des internen Workflows
const selectedContent = await getSelectedContent()
const response = await sendToLLM(selectedContent, context, endpoint)
displayResult(response)
```

### 1.4 Warum SvelteKit für Browser-Erweiterungen?

SvelteKit bietet entscheidende Vorteile für die Entwicklung von Browser-Erweiterungen:

- **Kleine Bundle-Größe**: Perfekt für Erweiterungen mit Speicherbeschränkungen
- **Reaktive Komponenten**: Nahtloses State-Management zwischen Popup und Content Script
- **TypeScript-Support**: Typsicherheit für die komplexe Extension API
- **Svelte 5 Runes**: Moderne reaktive API für deklarativen Code

---

## 2. Technischer Aufbau und Architektur

### 2.1 Tech-Stack Overview

Die Erweiterung basiert auf einer modernen, typsicheren Architektur:

```
┌─────────────────────────────────────────────────────────┐
│                    Browser Extension                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │   Popup     │  │ Background  │  │  Content    │      │
│  │  (Svelte)   │  │  Service    │  │   Script    │      │
│  │             │  │   Worker    │  │  (IIFE)     │      │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘      │
│         │                │                │             │
│         └────────────────┴────────────────┘             │
│                          │                               │
│                  ┌───────▼────────┐                     │
│                  │  Chrome Storage │                     │
│                  └────────────────┘                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Bun als Runtime und Package Manager

**Warum Bun?**

```bash
# Installieren und Bauen
bun install          # Schnellere Installation als npm/pnpm
bun run dev          # Entwicklungsserver
bun run build        # Produktions-Build
bun run release      # Vollständiger Release-Build
```

**Vorteile:**
- **Extreme Performance**: 10-20x schneller als npm für Installationen
- **Natives TypeScript**: Kein zusätzliches `tsc` erforderlich
- **JavaScript-Engine**: Built-in bundler und test runner
- **Kompakte Binaries**: Perfekt für CI/CD-Pipelines

**Integration im Projekt:**

```json
// package.json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build && vite build -c vite.content.config.ts",
    "release": "bun run check && bun run build && cd dist && zip -r ../release-$(date +%Y-%m-%d).zip .",
    "test": "bunx playwright test"
  }
}
```

### 2.3 SvelteKit als Framework

**SvelteKit-Konfiguration für Extensions:**

```javascript
// svelte.config.js
import adapter from 'sveltekit-adapter-chrome-extension'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

const config = {
  preprocess: [vitePreprocess()],
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: null,
      manifest: 'manifest.json',
    }),
    appDir: 'app',
  },
}
```

**Svelte 5 Runes im Einsatz:**

```svelte
<!-- src/lib/components/Popup.svelte -->
<script lang="ts">
  import popupState from '../../popupState.svelte'
  import endpoints from '../state/endpoints.svelte'

  $effect(() => {
    popupState.value = endpoints.value.list.length === 0 ? 'CONFIG' : 'DEFAULT'
  })
</script>
```

**Vorteile für Extensions:**
- **Serverless-ready**: Kein Server-Backend erforderlich
- **Client-only Rendering**: Perfekt für Popup-UI
- **Modular**: Getrennte Build-Targets für Popup, Background und Content Scripts

### 2.4 Tailwind CSS für das Styling

**Konfiguration:**

```typescript
// tailwind.config.ts
import forms from '@tailwindcss/forms'
import { skeleton } from '@skeletonlabs/tw-plugin'

const config = {
  darkMode: 'class',
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './public/**/*.html',
  ],
  plugins: [
    forms,
    skeleton({
      themes: { preset: ['rocket'] },
    }),
  ],
}
```

**Verwendung in Komponenten:**

```svelte
<div class="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-900 rounded-lg">
  <button class="btn btn-primary">Check</button>
  <button class="btn btn-secondary">Cancel</button>
</div>
```

### 2.5 Skeleton UI als Komponentenbibliothek

**Integrierte Komponenten:**

```svelte
<!-- Buttons -->
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-outline">Outline Button</button>

<!-- Inputs -->
<input type="text" class="input" placeholder="Enter text..." />

<!-- Modals -->
<dialog class="modal">
  <div class="modal-box">
    <h3 class="font-bold">Modal Title</h3>
    <p>Modal content here...</p>
  </div>
</dialog>

<!-- Toggle -->
<label class="toggle toggle-primary">
  <input type="checkbox" />
  <span class="toggle-label">Enable</span>
</label>
```

**Warum Skeleton UI?**
- Tailwind-basiert: Kein zusätzliches CSS-Framework
- Accessible: ARIA-Standard-konform
- Themeable: Dark Mode out-of-the-box
- Leichtgewichtig: Nur benötigte Komponenten im Bundle

### 2.6 sveltekit-adapter-chrome-extension

**Funktion:**
Der Adapter konvertiert die SvelteKit-App in ein Chrome Extension-kompatibles Format.

```javascript
// Vite-Konfiguration für Multi-Entry Build
// vite.config.ts
export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'src/main.ts'),
        background: path.resolve(__dirname, 'src/background.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]',
      },
    },
  },
})
```

**Separater Build für Content Scripts:**

```typescript
// vite.content.config.ts
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        content: path.resolve(__dirname, 'src/content.ts'),
      },
      output: {
        format: 'iife', // IIFE für Content Scripts
        entryFileNames: 'content.js',
      },
    },
  },
})
```

### 2.7 typesafe-i18n für Internationalisierung

**Setup:**

```typescript
// src/i18n/de/index.ts
export default {
  extensionInstalled: 'Fact Check Extension installiert!',
  contextMenuImage: '🖼️ Bild überprüfen',
  contextMenuText: '✍️ Text überprüfen',
  checkButton: 'Überprüfen',
  // ... mehr Übersetzungen
}
```

**Verwendung in Svelte-Komponenten:**

```svelte
<script lang="ts">
  import { L } from '../i18n/i18n-svelte'
</script>

<button>{L.checkButton}</button>
<p>{L.welcomeMessage}</p>
```

**Automatische Typ-Sicherheit:**

```typescript
// typesafe-i18n generiert automatisch TypeScript-Typen
type TranslationKeys = 'extensionInstalled' | 'contextMenuImage' | ...
```

### 2.8 Playwright für End-to-End-Tests

**Test-Konfiguration:**

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  workers: 1,
  use: {
    headless: false, // Sichtbar für Extension-Testing
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
```

**Beispiel-Test:**

```typescript
// tests/extension.spec.ts
import { test, expect } from '@playwright/test'

test('User can check text', async ({ page }) => {
  await page.goto('https://example.com')
  await page.waitForSelector('body')

  // Text auswählen
  await page.evaluate(() => {
    const range = document.createRange()
    range.selectNodeContents(document.body)
    window.getSelection()?.removeAllRanges()
    window.getSelection()?.addRange(range)
  })

  // Context Menü öffnen
  await page.click('body', { button: 'right' })

  // Extension-Popup öffnen
  await page.evaluate(async () => {
    await chrome.action.openPopup()
  })

  // Überprüfen, dass Popup angezeigt wird
  const popup = page.context().pages().find(p => p.url().startsWith('chrome-extension://'))
  expect(popup).toBeTruthy()
})
```

---

## 3. Funktionsweise von Browser-Erweiterungen

### 3.1 Projektstruktur nach dem Build

```
dist/                                    # Build-Output
├── manifest.json                        # Extension-Manifest
├── popup.html                          # Popup-HTML
├── popup.js                            # Popup-Application (SvelteKit)
├── background.js                       # Service Worker
├── content.js                          # Content Script (IIFE)
├── favicon.png                         # Icons
├── _app/                               # SvelteKit Assets
│   ├── immutable/
│   ├── nodes/
│   └── version.json
└── app/                                # SvelteKit Internal
    ├── base.css
    └── chunks/
```

### 3.2 Manifest-Datei und Konfiguration

**manifest.json (Chrome):**

```json
{
  "manifest_version": 3,
  "name": "Fact Spreader",
  "version": "4.0.0",
  "description": "Highlight text and images and send it to LLMs",
  "permissions": [
    "storage",
    "activeTab",
    "clipboardWrite",
    "contextMenus"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "favicon.png",
      "48": "favicon.png",
      "128": "favicon.png"
    }
  },
  "background": {
    "service_worker": "background.js",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ],
  "icons": {
    "16": "favicon.png",
    "48": "favicon.png",
    "128": "favicon.png"
  }
}
```

**Wichtige Manifest-Felder erklärt:**

- **manifest_version**: Version 3 ist die aktuelle Version
- **permissions**: Erforderliche Browser-API-Berechtigungen
- **host_permissions**: Zugriff auf externe URLs (für API-Calls)
- **action**: Toolbar-Button und Popup-Konfiguration
- **background**: Service Worker für Hintergrundprozesse
- **content_scripts**: Skripte, die in Webseiten injiziert werden

### 3.3 Popup (SvelteKit-App)

**Aufbau:**

```typescript
// src/main.ts
import { mount } from 'svelte'
import Popup from './lib/components/Popup.svelte'
import './app.css'

const app = mount(Popup, {
  target: document.getElementById('app') || document.body,
})
```

**Popup-HTML (public/popup.html):**

```html
<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Fact Check Extension</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/popup.js"></script>
  </body>
</html>
```

**State-Management im Popup:**

```typescript
// src/lib/state/endpoints.svelte.ts
import { PersistState } from '../util/PersistState.svelte'

export interface Endpoint {
  title: string
  url: string
  apiKey: string
  model: string
  canProcessImages: boolean
  rolePlacement?: 'system' | 'inline'
}

class Endpoints extends PersistState<{
  selected: Endpoint | null
  list: Endpoint[]
  lastUsed: string | undefined
}> {
  constructor() {
    super('endpoints', { selected: null, list: [], lastUsed: undefined })
    this.load()
  }

  async add(newEndpoint: Endpoint) {
    this.value.list.push(newEndpoint)
    this.value.selected = newEndpoint
  }
}

export default new Endpoints()
```

### 3.4 Background Service Worker

**Hauptfunktionen:**

```typescript
// src/background.ts
import en from './i18n/en'
import de from './i18n/de'

// Kontext-Menü erstellen
function updateContextMenus() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'fact-check-image',
      title: L.contextMenuImage,
      contexts: ['image'],
    })
    chrome.contextMenus.create({
      id: 'fact-check-text',
      title: L.contextMenuText,
      contexts: ['selection'],
    })
  })
}

// Event Listener für Kontext-Menü
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'fact-check-image') {
    await chrome.action.openPopup()
    await chrome.storage.session.set({
      pendingContextMenuImage: info.srcUrl
    })
  }
})
```

**Communication Patterns:**

```typescript
// Message Passing zwischen Background und Content Script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSelectedContent') {
    // Antwort zurücksenden
    sendResponse(selectedContent)
  }
})

// Asynchrone Kommunikation
chrome.tabs.sendMessage(tabId, { action: 'enableImageSelect' })
```

### 3.5 Content Script

**Eingabe in die Webseite:**

```typescript
// src/content.ts
const suppessEvents = ['mousedown', 'mouseup', 'pointerdown', 'pointerup']

function addImageSelectStyles() {
  const style = document.createElement('style')
  style.textContent = `
    img { cursor: crosshair !important; }
    img:hover { box-shadow: 0 0 1px 1px red !important; }
  `
  document.head.appendChild(style)
}

const imageClickHandler = async (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (target.tagName === 'IMG') {
    const image = await processImage((target as HTMLImageElement).src)
    chrome.runtime.sendMessage({ action: 'imageSelected' })
  }
}

// Event Listener für Messages vom Background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'enableImageSelect') {
    addImageSelectStyles()
    document.addEventListener('click', imageClickHandler)
  }
})
```

**IIFE-Format für Content Scripts:**

Das Content Script wird als IIFE (Immediately Invoked Function Expression) gebaut, um Konflikte mit existierenden Skripten auf der Seite zu vermeiden:

```javascript
// Dist-Format (content.js)
(function() {
  'use strict';
  // Content Script Code
})();
```

### 3.6 Storage und Persistenz

**Chrome Storage API:**

```typescript
// Lokale Speicherung (persistiert)
await chrome.storage.local.set({ settings: { ... } })
const data = await chrome.storage.local.get(['settings'])

// Session Storage (nur während der Session)
await chrome.storage.session.set({ pendingText: '...' })
```

**PersistState Utility:**

```typescript
// src/lib/util/PersistState.svelte.ts
export class PersistState<T> {
  constructor(
    private key: string,
    private defaultValue: T
  ) {}

  get value(): T {
    return this.internalValue ?? this.defaultValue
  }

  set value(newValue: T) {
    this.internalValue = newValue
    chrome.storage.local.set({ [this.key]: newValue })
  }

  async load() {
    const data = await chrome.storage.local.get([this.key])
    this.internalValue = data[this.key] ?? this.defaultValue
  }
}
```

### 3.7 Kommunikations-Fluss

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Webseite   │         │ Content      │         │ Background   │
│              │         │ Script       │         │ Service      │
└──────┬───────┘         └──────┬───────┘         └──────┬───────┘
       │                        │                        │
       │  User selects text     │                        │
       ├───────────────────────>│                        │
       │                        │                        │
       │                        │  Message: content     │
       │                        │  selected             │
       │                        ├──────────────────────>│
       │                        │                        │
       │                        │                        │  Storage:
       │                        │                        │  pendingText
       │                        │                        │  saved
       │                        │                        │
       │  User clicks toolbar   │                        │
       ├────────────────────────────────────────────────>│
       │                        │                        │
       │                        │                        │  Open Popup
       │                        │                        │
       │                        │                        ├──────────────┐
       │                        │                        │              │
       │                        │                        │              ▼
       │                        │                        │         ┌─────────┐
       │                        │                        │         │ Popup   │
       │                        │                        │         │ (Svelte)│
       │                        │                        │         └────┬────┘
       │                        │                        │              │
       │                        │                        │  Storage:     │
       │                        │                        │  read data   │
       │                        │                        │<─────────────┘
       │                        │                        │
       │                        │  Message: get content  │
       │                        │<───────────────────────┤
       │                        │                        │
       │  Get selected text     │                        │
       │<───────────────────────┤                        │
       │                        │                        │
       │  Send text back        │                        │
       ├───────────────────────>│                        │
       │                        │                        │
       │                        │  Send text to popup    │
       │                        ├──────────────────────>│
       │                        │                        │
       │                        │                        │  Forward to
       │                        │                        │  popup
       │                        │                        ├──────────────>│
       │                        │                        │              │
       │                        │                        │              ▼
       │                        │                        │         ┌─────────┐
       │                        │                        │         │ Display │
       │                        │                        │         │ content │
       │                        │                        │         └─────────┘
```

---

## 4. Entwicklung und Debugging

### 4.1 Laden der Erweiterung im Entwicklermodus

**Schritt-für-Schritt-Anleitung:**

1. **Projekt klonen:**
   ```bash
   git clone https://github.com/caboe/fact-check-extention.git
   cd fact-check-extention
   bun install
   ```

2. **Build ausführen:**
   ```bash
   bun run build
   ```
   Dies erstellt den `dist/` Ordner mit allen Extension-Dateien.

3. **Chrome öffnen:**
   - Navigieren zu `chrome://extensions/`
   - Aktivieren Sie "Developer mode" in der oberen rechten Ecke

4. **Extension laden:**
   - Klicken Sie auf "Load unpacked"
   - Navigieren Sie zum `dist/` Ordner im Projekt
   - Wählen Sie den Ordner aus

5. **Extension testen:**
   - Die Extension sollte nun in der Liste erscheinen
   - Klicken Sie auf das Extension-Icon in der Toolbar, um das Popup zu öffnen

**Für Firefox:**

```bash
bun run build:firefox
```

1. Öffnen Sie Firefox und navigieren Sie zu `about:debugging#/runtime/this-firefox`
2. Klicken Sie auf "Load Temporary Add-on..."
3. Wählen Sie `dist/manifest.json` aus

### 4.2 Debugging-Optionen

#### 4.2.1 Chrome Extensions Tab

**Zugriff:**
- Öffnen Sie `chrome://extensions/`
- Suchen Sie Ihre Extension in der Liste
- Klicken Sie auf "Inspect views: background page" für den Service Worker
- Klicken Sie auf das Popup-Symbol, dann auf "Inspect" für das Popup

**Nützliche Features:**
- **Console**: Logs aus Background Script und Popup
- **Network**: API-Requests und Responses
- **Storage**: View und Modify Chrome Storage
- **Application**: Service Worker Status und Caching

#### 4.2.2 DevTools für Popup

**Öffnen:**
1. Klicken Sie auf das Extension-Icon in der Toolbar
2. Im Popup: Rechtsklick → "Inspect"
3. Oder: F12 wenn das Popup fokussiert ist

**Debugging Svelte-Komponenten:**

```typescript
// src/lib/components/Popup.svelte
<script lang="ts">
  import popupState from '../../popupState.svelte'

  console.log('Current state:', $popupState)
  console.log('Endpoints:', endpoints.value)

  // Breakpoints in DevTools setzen
  function handleClick() {
    debugger // Stoppt hier für Debugging
    console.log('Button clicked')
  }
</script>
```

**React DevTools Alternative für Svelte:**
- Installieren Sie die "Svelte DevTools" Extension
- Ermöglicht Inspektion der Svelte-Komponenten-Hierarchie
- Zeigt reaktiven State und Props

#### 4.2.3 DevTools für Content Scripts

**Zugriff:**
1. Öffnen Sie eine beliebige Webseite (z.B. `https://example.com`)
2. Öffnen Sie DevTools (F12 oder Rechtsklick → "Inspect")
3. Gehen Sie zum "Sources" Tab
4. Suchen Sie nach "content.js" in der Dateiliste

**Logging im Content Script:**

```typescript
// src/content.ts
console.log('Content Script loaded')

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request)
  // ...
})
```

#### 4.2.4 Direkter Aufruf via chrome-extension:// URL

**Popup direkt öffnen:**

```bash
# Finden Sie die Extension ID in chrome://extensions/
# Beispiel: chrome-extension://bfkappkblcebamikhacecnjpeapofakk/popup.html
```

**Vorteile:**
- Schneller Zugriff für Debugging
- Kein Notwendigkeit, die Toolbar zu benutzen
- Einfachere Entwicklung ohne Interaktion mit Webseiten

**Nachteile:**
- Kein Zugriff auf `chrome.tabs` API
- Keine Context-Menü-Integration
- Einige APIs sind nicht verfügbar (z.B. `activeTab`)

**Beispiel für Debugging:**

```typescript
// src/lib/components/Popup.svelte
<script lang="ts">
  import { onMount } from 'svelte'

  onMount(() => {
    console.log('Popup mounted at:', window.location.href)
    console.log('Extension ID:', chrome.runtime.id)
  })
</script>
```

### 4.3 Hot Reload und Entwicklung

**Development Mode mit Watch:**

```bash
# Build mit Watch-Mode
bun run build:watch
```

**Manuelles Neuladen der Extension:**

1. Öffnen Sie `chrome://extensions/`
2. Suchen Sie Ihre Extension
3. Klicken Sie auf das "Reload"-Icon (↻) neben der Extension

**Automatisches Neuladen mit Webpack Plugin:**

```typescript
// Optional: Erweitern Sie vite.config.ts für Auto-Reload
export default defineConfig({
  plugins: [
    svelte(),
    // Fügen Sie ein Plugin hinzu, das die Extension neu lädt
    // wenn sich Dateien ändern
  ],
})
```

### 4.4 Fehlerbehebung

**Häufige Probleme:**

**Problem: Popup öffnet nicht**
- Überprüfen Sie `manifest.json` → `action.default_popup`
- Stellen Sie sicher, dass `popup.html` und `popup.js` im `dist/` Ordner existieren

**Problem: Content Script funktioniert nicht**
- Überprüfen Sie die Matches in `manifest.json`
- Konsolen-Logs im Content Script Tab prüfen
- CORS-Probleme beachten (CSP-Policy)

**Problem: API-Requests schlagen fehl**
- Überprüfen Sie `host_permissions` in `manifest.json`
- CORS-Header des API-Endpoints prüfen
- Netzwerk-Logs in DevTools überprüfen

**Problem: Storage wird nicht geladen**
- Überprüfen Sie `permissions` in `manifest.json` (muss `storage` enthalten)
- Prüfen Sie, ob Sie `chrome.storage.local` oder `chrome.storage.session` verwenden

---

## 5. Build und Veröffentlichung

### 5.1 Build-Prozess mit "bun run release"

**Vollständiger Release-Build:**

```bash
# 1. Type Checking
bun run check

# 2. Build (Popup, Background, Content Script)
bun run build

# 3. Package als ZIP
cd dist
find . -name ".DS_Store" -delete
zip -r ../release-$(date +%Y-%m-%d).zip . -x "**/.DS_Store"
```

**Build-Script详解:**

```json
// package.json
{
  "scripts": {
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "build": "vite build && vite build -c vite.content.config.ts",
    "release": "bun run check && bun run build && cd dist && find . -name \".DS_Store\" -delete && zip -r ../release-$(date +%Y-%m-%d).zip . -x \"**/.DS_Store\" && cd ..",
    "release:firefox": "bun run check && bun run build:firefox && cd dist && find . -name \".DS_Store\" -delete && zip -r ../release-firefox-$(date +%Y-%m-%d).zip . -x \"**/.DS_Store\" && cd .."
  }
}
```

**Build-Output:**

```
release-2026-01-09.zip
├── manifest.json
├── popup.html
├── popup.js
├── background.js
├── content.js
├── favicon.png (16, 48, 128)
├── _app/
│   ├── immutable/
│   │   ├── chunks/
│   │   └── nodes/
│   └── version.json
└── app/
    ├── base.css
    └── chunks/
```

### 5.2 Unterschiede zwischen Chrome- und Firefox-Erweiterungen

**Manifest-Versionen:**

| Feature | Chrome | Firefox |
|---------|--------|---------|
| Manifest V3 | ✅ Erforderlich | ✅ Erforderlich |
| Background | Service Worker | Service Worker |
| Content Scripts | JSON-Manifest | JSON-Manifest |
| Permissions | Standard | Standard |
| Host Permissions | Eigener Bereich | Eigener Bereich |

**Firefox-spezifische Anpassungen:**

```json
// public/manifest.firefox.json
{
  "manifest_version": 3,
  "browser_specific_settings": {
    "gecko": {
      "id": "fact-check@example.com",
      "strict_min_version": "115.0"
    }
  },
  // ... rest des Manifests
}
```

**Build-Kommandos:**

```bash
# Chrome Build
bun run build

# Firefox Build
bun run build:firefox
```

**Wichtige Unterschiede:**

1. **Icons**: Firefox unterstützt keine SVG-Icons im Manifest
2. **Permissions**: Manche Permissions haben unterschiedliche Namen
3. **API-Unterschiede**: Nicht alle Chrome APIs sind in Firefox verfügbar
4. **Content Security Policy**: Firefox hat strengere CSP-Regeln

### 5.3 Veröffentlichung im Chrome Web Store

#### 5.3.1 Vorbereitung der Assets

**Erforderliche Assets:**

```
assets/
├── icons/
│   ├── icon-16.png   (16x16 px)
│   ├── icon-48.png   (48x48 px)
│   ├── icon-128.png  (128x128 px)
│   └── icon-512.png  (512x512 px) - Für Store
├── screenshots/
│   ├── screenshot-1.png (1280x800 px, mindestens 1)
│   ├── screenshot-2.png (optional)
│   ├── screenshot-3.png (optional)
│   └── screenshot-4.png (optional)
└── promo/
    ├── small.png (440x280 px, optional)
    └── large.png (920x680 px, optional)
```

**Icon-Requirements:**
- Format: PNG oder WebP
- Keine Transparenz (für Store-Icons)
- Quadratisch
- Hoher Kontrast und Lesbarkeit

**Screenshot-Requirements:**
- Mindestens 1, maximal 5 Screenshots
- Format: PNG oder JPEG
- Größe: 1280x800 oder 640x400 px
- Zeigen Sie die Extension in Aktion

#### 5.3.2 Manifest-Anforderungen

**Manifest V3 Compliance:**

```json
{
  "manifest_version": 3,
  "name": "Fact Spreader",
  "version": "4.0.0",
  "version_name": "4.0.0", // Optional: detailliertere Version
  "description": "Highlight text and images and send it to LLMs...",
  "short_name": "Fact Spreader", // Optional: Max 12 Zeichen
  "permissions": [
    "storage",
    "activeTab",
    "clipboardWrite",
    "contextMenus"
  ],
  "host_permissions": [
    "https://api.openai.com/*",
    "https://openrouter.ai/*",
    "<all_urls>"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "favicon.png",
      "48": "favicon.png",
      "128": "favicon.png"
    },
    "default_title": "Fact Check Extension"
  },
  "background": {
    "service_worker": "background.js",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ],
  "icons": {
    "16": "favicon.png",
    "48": "favicon.png",
    "128": "favicon.png"
  },
  "homepage_url": "https://github.com/caboe/fact-check-extention",
  "author": "caboe",
  "offline_enabled": false
}
```

**Best Practices:**
- Verwenden Sie semantische Versionierung (Major.Minor.Patch)
- Geben Sie alle Permissions an, die Sie benötigen
- Vermeiden Sie `<all_urls>` wenn möglich
- Dokumentieren Sie alle host_permissions

#### 5.3.3 Store-Listing erstellen

**Store-Seite Details:**

1. **Basic Information:**
   - Name: "Fact Spreader" (max 45 Zeichen)
   - Short Description: "Instant fact-checking with AI" (max 132 Zeichen)
   - Long Description: Detaillierte Beschreibung
   - Category: "Productivity" oder "News & Weather"

2. **Store Listing:**
   - Screenshots hochladen (mindestens 1)
   - Promotional Graphics (optional)
   - Languages: Mehrsprachige Beschreibungen

3. **Privacy:**
   - Privacy Policy URL erforderlich
   - Datenschutzrichtlinie erstellen und hosten

4. **Distribution:**
   - Visibility: Public / Unlisted / Private
   - Target Audience: Alle Altersgruppen

#### 5.3.4 Review-Prozess

**Review-Typen:**

1. **Initial Review:** 1-3 Tage
   - Überprüfung der Funktionalität
   - Sicherheits-Scan
   - Policy-Compliance Check

2. **Routine Updates:** 1-2 Tage
   - Kleinere Änderungen
   - Bug Fixes
   - UI-Verbesserungen

3. **Major Updates:** 2-5 Tage
   - Neue Features
   - Berechtigungsänderungen
   - Architekturänderungen

**Häufige Ablehnungsgründe:**

- **Unzureichende Beschreibung**: Zu wenig Details über die Funktion
- **Fehlende Privacy Policy**: Keine Datenschutzerklärung
- **Over-Permission**: Zu viele oder zu weitreichende Permissions
- **Malware-Verdacht**: Verdächtiger Code
- **Gebrauch von eingeschränkten APIs**: Ohne ausreichende Begründung
- **Fehlende Screenshots**: Keine visuelle Darstellung

**Checkliste vor der Einreichung:**

- [ ] ZIP-Datei ist korrekt gebaut
- [ ] Alle Icons und Screenshots sind vorhanden
- [ ] Manifest ist valid und vollständig
- [ ] Privacy Policy ist verfügbar
- [ ] Extension ist lokal getestet
- [ ] Alle Permissions sind begründet
- [ ] Keine console.log() Statements im Produktionscode
- [ ] Keine Debugging-Code oder Kommentare
- [ ] Code ist minified und optimiert
- [ ] Versionsnummer ist erhöht

#### 5.3.5 Versionsverwaltung

**Semantische Versionierung:**

```json
// package.json
{
  "version": "0.0.1"
}

// manifest.json
{
  "version": "4.0.0",
  "version_name": "4.0.0-stable"
}
```

**Versionierungs-Strategie:**

- **Major (4.0.0 → 5.0.0):** Breaking Changes, große Features
- **Minor (4.0.0 → 4.1.0):** Neue Features, rückwärtskompatibel
- **Patch (4.0.0 → 4.0.1):** Bug Fixes, kleine Verbesserungen

**Changelog-Beispiel:**

```markdown
# Changelog

## [4.0.0] - 2026-01-09

### Added
- Support for GPT-4o and Claude 3 models
- Custom role configuration
- Dark mode support

### Changed
- Migrated to Svelte 5
- Updated to Tailwind CSS 3.4

### Fixed
- Fixed content script injection issues
- Resolved storage permission errors

### Removed
- Legacy API endpoints
```

### 5.4 Automatisierung des Release-Prozesses

**GitHub Actions Workflow Beispiel:**

```yaml
# .github/workflows/release.yml
name: Release Extension

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Run tests
        run: bun run test

      - name: Build extension
        run: bun run release

      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          files: |
            release-*.zip
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Pre-Commit Hooks:**

```bash
# Install Husky
bun add -D husky lint-staged

# Setup
bunx husky install
bunx husky add .husky/pre-commit "bunx lint-staged"

# .lintstagedrc.json
{
  "*.{js,ts,svelte}": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"]
}
```

---

## 6. Best Practices und Tipps

### 6.1 Performance-Optimierung

**Bundle-Größe minimieren:**

```typescript
// Dynamic Imports für seltene Komponenten
const RoleConfig = lazy(() => import('./RoleConfig.svelte'))

// Tree-shaking aktivieren
import { debounce } from 'lodash-es' // statt 'lodash'
```

**Lazy Loading:**

```svelte
<script lang="ts">
  import { onMount } from 'svelte'

  let component: any

  onMount(async () => {
    const module = await import('./HeavyComponent.svelte')
    component = module.default
  })
</script>
```

### 6.2 Sicherheit

**Content Security Policy:**

```json
// manifest.json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

**API-Keys sicher speichern:**

```typescript
// NIEMALS API-Keys im Code hardcoden
// FALSCH ❌
const apiKey = 'sk-1234567890abcdef'

// RICHTIG ✅
const apiKey = await chrome.storage.local.get('apiKey')
```

### 6.3 Accessibility

**ARIA-Labels hinzufügen:**

```svelte
<button aria-label="Check text" class="btn btn-primary">
  Check
</button>
```

**Keyboard-Navigation:**

```svelte
<input
  type="text"
  placeholder="Enter endpoint URL"
  on:keydown={(e) => {
    if (e.key === 'Enter') handleSave()
  }}
/>
```

### 6.4 Testing

**Unit Tests:**

```typescript
// tests/components/Popup.test.ts
import { render, screen } from '@testing-library/svelte'
import Popup from '$lib/components/Popup.svelte'

test('renders popup', () => {
  render(Popup)
  expect(screen.getByText('Check')).toBeInTheDocument()
})
```

**Integration Tests:**

```typescript
// tests/integration/flow.test.ts
test('complete fact-check flow', async ({ page }) => {
  await page.goto('https://example.com')
  await selectText(page, 'Test text')
  await openContextmenu(page, 'Check text')
  await verifyPopupResult(page, 'Verified')
})
```

---

## 7. Ressourcen und Links

### 7.1 Offizielle Dokumentation

- [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/)
- [SvelteKit Dokumentation](https://kit.svelte.dev/)
- [Bun Dokumentation](https://bun.sh/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Skeleton UI](https://skeleton.dev/)

### 7.2 Tools und Libraries

- [sveltekit-adapter-chrome-extension](https://github.com/sveltejs/kit/tree/master/packages/adapter-chrome-extension)
- [typesafe-i18n](https://github.com/ivanhofer/typesafe-i18n)
- [Playwright](https://playwright.dev/)
- [Svelte 5 Runes](https://svelte.dev/docs/runes)

### 7.3 Community

- [Svelte Discord](https://discord.gg/svelte)
- [Chrome Extension Discord](https://discord.gg/chrome-extensions)
- [Reddit r/sveltejs](https://reddit.com/r/sveltejs)

---

## 8. Fazit

Die Fact Check Extension demonstriert, wie moderne Web-Technologien wie SvelteKit, Bun und Tailwind CSS effektiv für die Entwicklung von Browser-Erweiterungen genutzt werden können. Die Kombination aus:

- **Reaktivem State Management** (Svelte 5 Runes)
- **Typsicherheit** (TypeScript)
- **Modularer Architektur** (SvelteKit + Chrome Extension Adapter)
- **Schneller Entwicklung** (Bun)
- **Modernem UI** (Tailwind CSS + Skeleton UI)

ermöglicht eine performante, wartbare und benutzerfreundliche Extension, die professionellen Standards entspricht.

Für Svelte-Entwickler bietet dieses Projekt eine hervorragende Grundlage, um in die Entwicklung von Browser-Erweiterungen einzusteigen und modernste Web-Technologien in diesem Kontext anzuwenden.

---

**Vielen Dank für Ihre Aufmerksamkeit!**

Fragen? Diskutieren wir gemeinsam!
