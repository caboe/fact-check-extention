import type { Translation } from '../i18n-types';

const de = {
	markedText: 'Markierter Text ({wordCount:number} Wörter)' as `${string}{wordCount}${string}`,
	apiEndpoint: 'API-Endpunkt',
	configureApi: 'Konfigurieren',
	factCheck: 'Faktencheck',
	response: 'Antwort',
	responseLength:
		'Antwortlänge ca. {responseLength: number} Wörter' as `${string}{responseLength}${string}`,
	apiCta: 'Prüfen',
	result: 'Ergebnis',
	checkingProgress: 'Überprüfung läuft...',
	copy: 'Kopieren',
	configuredEndpoints: 'Konfigurierte Endpunkte',
	newEndpoint: 'Neuer Endpunkt',
	title: 'Titel',
	titelPlaceholder: 'Beispiel: Faktencheck-API',
	url: 'URL',
	urlPlaceholder: 'https://api.example.com/factcheck',
	apiKey: 'API-Schlüssel',
	apiKeyPlaceholder: 'Ihr API-Schlüssel',
	cancel: 'Abbrechen',
	add: 'Hinzufügen',
	noConfiguredEndpoints: 'Noch keine Endpunkte hinzugefügt',
	editText: 'Text hier bearbeiten...',
	notChecked: 'Nicht geprüft',
	enterText: 'Text hier eingeben.',
	characterLabel: 'Im Stil dieser Person antworten (optional)',
	characterPlaceholder: 'Edgar Allan Poe',
	chooseTemplate: 'Wählen Sie eine Vorlage (optional)',
	choose: 'Wählen ...',
	endpointExists: 'Endpoint mit diesem Namen existiert schon.',
	saveAnyway: 'Kein API-Key angegeben, trotzdem speichern?',
	fieldsMissing: 'Bitte alle Felder ausfüllen.'
} satisfies Translation;

export default de;
