import type { BaseTranslation } from '../i18n-types'

const de = {
	introduction: `Dieses Tool soll dir helfen, Informationen im Netz schneller zu überprüfen und die Glaubwürdigkeit von Texten besser einzuschätzen.</p>
	<p>Konfiguriere eine GPT, die den Fact Check durchführen soll.</p>
<p><strong>Wichtiger Hinweis:</strong> Obwohl diese Erweiterung auf fortschrittlicher KI basiert, ist sie nicht unfehlbar. Künstliche Intelligenz kann in manchen Fällen „halluzinieren“, d.h. falsche oder irreführende Informationen liefern. Daher ist es wichtig, die Ergebnisse kritisch zu hinterfragen und im Zweifelsfall zusätzliche Recherchen anzustellen, insbesondere wenn die Ergebnisse unerwartet oder „suspekt“ erscheinen. Betrachte die Ergebnisse des Faktenchecks immer als ersten Anhaltspunkt und nicht als endgültige Wahrheit. Nutze die Erweiterung als Unterstützung für deine eigene kritische Auseinandersetzung mit Informationen.</p>`,
	letsGo: "Los geht's",
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
	darkMode: 'Dark Mode',
	title: 'Titel',
	titelPlaceholder: 'Beispiel: Faktencheck-API',
	url: 'URL',
	urlPlaceholder: 'https://api.example.com/factcheck',
	apiKey: 'API-Schlüssel',
	apiKeyPlaceholder: 'Ihr API-Schlüssel',
	cancel: 'Abbrechen',
	add: 'Hinzufügen',
	updateEndpoint: 'Endpunkt aktualisieren',
	noConfiguredEndpoints: 'Noch keine Endpunkte hinzugefügt',
	selectedText: 'Text direkt eingeben oder auf der Seite auswählen.',
	notChecked: 'Nicht geprüft',
	enterText: 'Text hier eingeben.',
	personLabel: 'Im Stil dieser Person antworten (optional)',
	personPlaceholder: 'Edgar Allan Poe',
	chooseTemplate: 'Wählen Sie eine Vorlage (optional)',
	choose: 'Wählen ...',
	endpointExists: 'Endpoint mit diesem Namen existiert schon.',
	saveAnyway: 'Kein API-Key angegeben, trotzdem speichern?',
	fieldsMissing: 'Bitte alle Felder ausfüllen.',
	copied: 'Ergebnis in die Zwischenablage kopiert!',
	copyError: 'Fehler beim Kopieren: {error:string}' as `${string}{error}${string}`,
	fillAllFieldsAlert: 'Bitte füllen Sie alle Felder aus',
	selectText: 'Text auswählen',
	resetSelection: 'Auswahl zurücksetzen',
	imageSelected: 'Bild ausgewählt',
	selectImage: 'Bild auswählen',
	pleaseSelectImage: 'Bitte wählen Sie ein Bild aus.',
	selectTextOrImage: 'Text oder Bild auswählen',
	canProcessImages: 'Kann Bilder verarbeiten?',
	noImageEndpoint: 'Kein konfigurierter Endpunkt unterstützt Bildanalyse.',
	configureButton: 'Konfigurieren',
	defaultPerson: 'Kritischer Wissenschaftler',
	useShortRoleLabel:
		'Kurze Systemrolle verwenden. Dies kann helfen, wenn der Kontext des Modells zu kurz ist, z.B. bei langen Texten, die an Ollama gesendet werden.',
	rolePlacementLabel: 'Rolle',
	rolePlacementSystem: 'Systemnachricht',
	rolePlacementInline: 'Inline in Benutzernachricht',
	inlineUserMessage: 'Inline System Prompt (empfohlen für Ollama)',
	contextPlaceholder:
		'Zusätzlichen Kontext zur Unterstützung der Faktenprüfung bereitstellen (z.B. Zeitraum, Ort, spezifische Behauptungen, auf die sich konzentriert werden soll)...',
	// Role Configuration
	roleConfiguration: 'Rollenkonfiguration',
	basicRoles: 'Grundrollen (Nur-Lesen)',
	customRoles: 'Benutzerdefinierte Rollen',
	builtIn: 'Eingebaut',
	createFromThis: 'Daraus erstellen',
	addRole: 'Rolle hinzufügen',
	addNewRole: 'Neue Rolle hinzufügen',
	roleName: 'Rollenname',
	roleDescription: `Rollenbeschreibung und Anweisungen.
Beispiel:

Deine Persona ist der Philosoph Immanuel Kant.
1. Ton: Streng, komplex und moralisch ernst. Verwende dichte Satzstrukturen des 18. Jahrhunderts.
2. Methode: Überprüfe nicht nur Fakten; analysiere, ob die Behauptung des Nutzers dem "Kategorischen Imperativ" (Universelles Gesetz) folgt.
3. Fokus: Weise Unwahrheiten nicht nur als inkorrekt zurück, sondern als Verletzung der Vernunft.`,
	saveRole: 'Speichern',
	cancelRole: 'Abbrechen',
	copyRole: 'Kopieren',
	noCustomRoles: 'Noch keine benutzerdefinierten Rollen erstellt. Klicken Sie auf "Rolle hinzufügen", um Ihre erste benutzerdefinierte Rolle zu erstellen.',
	deleteRoleConfirm: 'Sind Sie sicher, dass Sie diese Rolle löschen möchten?',
	createFromTemplate: 'Benutzerdefinierte Rolle aus dieser Vorlage erstellen',
	createFromExisting: 'Neue Rolle aus dieser Vorlage erstellen',
	scientistName: 'Wissenschaftler',
	satiristName: 'Scharfsinniger Rationalist',
} satisfies BaseTranslation

export default de
