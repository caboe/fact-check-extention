// static/background.ts
// Derzeit keine spezifische Logik erforderlich

/// <reference types="chrome" />

// src/background.ts
chrome.runtime.onInstalled.addListener(() => {
	console.log('Fact Check Extension installiert.');
});
