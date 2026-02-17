# Browser-Erweiterungen mit SvelteKit entwickeln: Fact Check Extension

Diese Präsentation richtet sich an Svelte-Entwickler und stellt die Architektur, Entwicklung und Veröffentlichung der Fact Check Browser-Erweiterung vor.

## 1. Einführung und Zweck der Erweiterung

Die **Fact Check Extension** dient dazu, Informationen im Web schnell und einfach zu verifizieren, ohne den Kontext der aktuellen Seite verlassen zu müssen.

### Hauptfunktionen
*   **Selektion**: Benutzer markieren Text oder Bilder auf einer Webseite.
*   **Verarbeitung**: Der ausgewählte Inhalt wird zusammen mit einem Prompt an ein Large Language Model (LLM) gesendet.
*   **Ergebnis**: Die Analyse des LLMs wird direkt in der Erweiterung angezeigt.

### Use Cases
*   **Faktencheck**: Überprüfung von Behauptungen in Artikeln oder Social-Media-Posts.
*   **Kontextualisierung**: Abruf von Hintergrundinformationen zu spezifischen Themen.
*   **Bildanalyse**: Überprüfung von Bildinhalten (wenn das Modell dies unterstützt).

### Datenschutz & Lokale Kontrolle
*   **Local Storage**: Alle Einstellungen und API-Keys werden lokal im Browser gespeichert.
*   **Modell-Wahl**: Unterstützung für diverse Provider (OpenRouter, OpenAI, Anthropic, Google) sowie **lokale Modelle** (via Ollama/LM Studio) für maximalen Datenschutz.

---

## 2. Technischer Aufbau und Architektur

Der Tech-Stack wurde modern und effizient gewählt, um eine schnelle Entwicklung und hohe Performance zu gewährleisten.

### Core Stack
*   **Runtime & Package Manager**: [Bun](https://bun.sh/) – Für extrem schnelle Install- und Build-Zeiten.
*   **Framework**: [SvelteKit](https://kit.svelte.dev/) (mit Svelte 5) – Bietet eine erstklassige Developer Experience und effizientes State Management.
*   **Styling**: 
    *   [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS Framework.
    *   [Skeleton UI](https://www.skeleton.dev/) – Svelte-basierte UI-Komponentenbibliothek für ein konsistentes Design.

### Erweiterungsspezifisch
*   **Adapter**: `sveltekit-adapter-chrome-extension` – Dieser Adapter generiert aus der SvelteKit-App eine statische Single-Page-App (SPA), die als Browser-Erweiterung funktioniert. Er kümmert sich um das korrekte Routing und die Manifest-Generierung.
*   **Internationalisierung**: `typesafe-i18n` – Für typsichere Übersetzungen (DE, EN, ES, FR, PT). Das ermöglicht eine fehlerfreie Lokalisierung zur Compile-Zeit.
*   **Testing**: [Playwright](https://playwright.dev/) – Für End-to-End-Tests, um sicherzustellen, dass die Kernfunktionalitäten (z.B. API-Aufrufe, UI-Interaktionen) funktionieren.

---

## 3. Funktionsweise von Browser-Erweiterungen

Eine Browser-Erweiterung unterscheidet sich strukturell von einer klassischen Web-App.

### Dateistruktur (Post-Build)
Nach dem Build (`bun run build`) entsteht ein `/dist`-Ordner, der die eigentliche Erweiterung enthält:

*   **`manifest.json`**: Das Herzstück. Es definiert Berechtigungen, Icons, Background-Scripts und Popups.
*   **`popup.html`**: Der Einstiegspunkt für das UI (das kleine Fenster, das sich öffnet).
*   **`service-worker.js` (Background Script)**: Läuft im Hintergrund, handhabt Events (z.B. Kontextmenü-Klicks) und API-Kommunikation, die persistieren muss.
*   **`content-script.js`**: JavaScript, das im Kontext der besuchten Webseite läuft (um DOM-Zugriff zu erhalten, z.B. für Text-Selektion).
*   **Assets**: Icons, CSS und JS-Bundles.

### Wichtige Konzepte
*   **Kommunikation**: Popup, Background-Script und Content-Script kommunizieren oft über `chrome.runtime.sendMessage` miteinander.
*   **Storage**: `chrome.storage.local` wird statt `localStorage` verwendet, um Daten (wie API-Keys) sicher und synchron zu speichern.

---

## 4. Entwicklung und Debugging

### Setup im Entwicklermodus
1.  Repository klonen.
2.  Abhängigkeiten installieren: `bun install`.
3.  Build ausführen: `bun run build`.
4.  In Chrome `chrome://extensions/` öffnen.
5.  "Entwicklermodus" oben rechts aktivieren.
6.  "Entpackte Erweiterung laden" klicken und den `/dist`-Ordner auswählen.

### Debugging-Optionen

#### A. Popup Debugging
*   Rechtsklick auf das Erweiterungs-Icon -> "Pop-up untersuchen".
*   Dies öffnet die DevTools speziell für das Popup-Fenster.

#### B. Background Script Debugging
*   Auf der `chrome://extensions/`-Seite bei der Erweiterung auf "Service Worker" (oder "Hintergrundseite") klicken.
*   Öffnet eine separate DevTools-Instanz für Hintergrundprozesse.

#### C. Direkter Tab-Aufruf
*   URL: `chrome-extension://<EXTENSION_ID>/popup.html`
*   **Vorteil**: Vollbild-Debugging, persistente DevTools, kein Schließen bei Fokusverlust.
*   **Nachteil**: Manche APIs (z.B. `chrome.tabs.query` für den "aktiven Tab") verhalten sich anders, da der Tab sich selbst referenziert und nicht eine externe Webseite.

---

## 5. Build und Veröffentlichung

### Der Build-Prozess
Das Projekt nutzt Skripte in der `package.json`, um den Release zu automatisieren:

```bash
# Erstellt einen produktionsbereiten Build für Chrome
bun run build

# Erstellt ein ZIP-Archiv für den Upload (inkl. Clean-up)
bun run release
```

### Chrome vs. Firefox
Da sich die Manifest-Versionen (v3 vs. v2/v3-Unterschiede) und API-Supports unterscheiden, gibt es separate Build-Prozesse:
*   **Chrome**: Nutzt `manifest.json`.
*   **Firefox**: Nutzt `manifest.firefox.json` (wird beim Build zu `manifest.json` kopiert).
*   Befehl: `bun run build:firefox` bzw. `bun run release:firefox`.

### Veröffentlichung im Chrome Web Store

1.  **Developer Dashboard**: Account erstellen (einmalige Gebühr).
2.  **Neues Element**: Das generierte `.zip`-File hochladen.
3.  **Store-Eintrag ausfüllen**:
    *   **Beschreibung**: Detaillierte Erklärung der Funktionen.
    *   **Grafiken**:
        *   Icon (128x128 px).
        *   Screenshots (1280x800 px) – Zeigen Sie die Hauptfeatures.
        *   Promo-Kachel (440x280 px).
4.  **Datenschutzerklärung**: Muss angeben, welche Daten gesammelt werden (hier: keine personenbezogenen Daten, alles lokal).
5.  **Prüfung**: Einreichen zur Überprüfung. Dauert meist 24-48 Stunden.
6.  **Updates**: Einfach Versionsnummer in `package.json` erhöhen, neu bauen und ZIP erneut hochladen.

---

**Fazit**: Mit SvelteKit und modernen Tools wie Bun lässt sich eine leistungsfähige, typsichere und wartbare Browser-Erweiterung entwickeln, die eine hervorragende User Experience bietet.
