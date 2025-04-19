import type { Translation } from '../i18n-types';

const de: Translation = {
	general: {
		title: 'Dokumentation der Fact Check Erweiterung'
	},
	home: {
		welcome: 'Willkommen zur Dokumentation der {name}',
		introduction:
			'Diese Website bietet umfassende Dokumentation zur Installation, Konfiguration und Nutzung der Fact Check Chrome Erweiterung.'
	},
	nav: {
		installation: 'Installation',
		configuration: 'Konfiguration',
		usage: 'Nutzung'
	},
	installation: {
		title: 'Installation',
		web_store_heading: 'Installation aus dem Chrome Web Store',
		web_store_intro:
			'Der einfachste Weg, die Erweiterung zu installieren, ist direkt aus dem Chrome Web Store.',
		web_store_link_text: 'Fact Checker GPT Connector im Chrome Web Store',
		developer_mode_heading: 'Installation im Entwicklermodus (von ZIP)',
		developer_mode_intro:
			'Wenn Sie eine bestimmte Version installieren oder zur Entwicklung beitragen möchten, können Sie die Erweiterung im Entwicklermodus von Chrome über eine ZIP-Datei installieren.',
		developer_mode_steps: {
			step1: 'Navigieren Sie im Terminal zum Stammverzeichnis der Erweiterung.',
			step2:
				'Führen Sie den Build-Befehl aus: `{command}`. Dadurch wird eine Datei `{zipFile}` im Verzeichnis `dist/` erstellt.',
			step3: 'Öffnen Sie Chrome und gehen Sie zu `chrome://extensions/`.',
			step4: 'Aktivieren Sie den "Entwicklermodus" über den Schalter oben rechts.',
			step5: 'Klicken Sie auf die Schaltfläche "Entpackte Erweiterung laden".',
			step6:
				'Navigieren Sie zum Ordner `dist/` innerhalb des Erweiterungsverzeichnisses und wählen Sie ihn aus.',
			step7: 'Die Erweiterung sollte nun in Ihrer Liste der installierten Erweiterungen erscheinen.'
		}
	},
	configuration: {
		title: 'Konfiguration',
		endpoints_heading: 'API-Endpunkte',
		endpoints_intro:
			'Die Erweiterung benötigt einen API-Endpunkt, um Faktenprüfungen durchzuführen. Sie können dies im Popup der Erweiterung konfigurieren.',
		endpoints_steps: {
			step1:
				'Öffnen Sie das Erweiterungs-Popup, indem Sie auf das Symbol in der Chrome-Symbolleiste klicken.',
			step2: 'Klicken Sie auf "API-Endpunkt".',
			step3: 'Klicken Sie auf die Schaltfläche "Neuer Endpunkt".',
			step4:
				'Geben Sie die Details für Ihren API-Endpunkt ein. Sie können eine Vorlage für gängige Dienste wie Gemini, OpenAI usw. auswählen oder eine benutzerdefinierte URL eingeben.',
			step5: 'Geben Sie Ihren API-Schlüssel ein, falls vom Dienst benötigt.',
			step6: 'Klicken Sie auf "Hinzufügen", um den Endpunkt zu speichern.'
		},
		api_keys_heading: 'API-Schlüssel erhalten',
		api_keys_intro:
			'Viele API-Dienste erfordern einen API-Schlüssel zur Authentifizierung. Sie müssen diesen Schlüssel vom jeweiligen Dienstanbieter beziehen.',
		api_keys_advice:
			'Bitte beachten Sie die offizielle Dokumentation des API-Dienstes, den Sie verwenden möchten, um Anweisungen zum Erhalt eines API-Schlüssels zu erhalten.',
		ollama_heading: 'Verwendung einer lokalen Ollama-Instanz',
		ollama_intro:
			'Sie können auch eine lokale Ollama-Instanz als Ihren Faktenprüfungs-Endpunkt verwenden.',
		ollama_steps: {
			step1: 'Installieren Sie Ollama auf Ihrem System gemäß der offiziellen Dokumentation.',
			step2:
				'Sobald Ollama läuft, fügen Sie in der Erweiterungskonfiguration einen neuen Endpunkt hinzu.',
			step3:
				'Geben Sie als URL die lokale Adresse Ihrer Ollama-Instanz ein, typischerweise `{ollamaUrl}`.',
			step4: 'Wählen Sie das entsprechende Modell aus, falls Sie dazu aufgefordert werden.',
			step5: 'Speichern Sie den Endpunkt.'
		}
	},
	usage: {
		title: 'Nutzung',
		select_text_heading: 'Text auswählen',
		select_text_intro:
			'Um Text zu überprüfen, markieren Sie einfach den gewünschten Text auf einer beliebigen Webseite.',
		select_image_heading: 'Bilder auswählen',
		select_image_intro:
			'Um ein Bild zu überprüfen, klicken Sie mit der rechten Maustaste auf das Bild und wählen Sie die Option der Erweiterung aus (falls verfügbar und vom konfigurierten Endpunkt unterstützt).',
		select_ui_heading: 'Verwendung des Erweiterungs-Popups',
		select_ui_intro:
			'Alternativ können Sie das Erweiterungs-Popup öffnen und Text manuell eingeben oder ein Bild über die bereitgestellte Oberfläche auswählen.'
	}
};

export default de;
