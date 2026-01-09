import { PersistState } from '../util/PersistState.svelte'

export type TranscriptionLanguage = 'en' | 'de' | 'es' | 'fr' | 'pt'

function getBrowserLanguage(): TranscriptionLanguage {
	const uiLang = chrome.i18n.getUILanguage()
	if (uiLang.startsWith('de')) return 'de'
	if (uiLang.startsWith('es')) return 'es'
	if (uiLang.startsWith('fr')) return 'fr'
	if (uiLang.startsWith('pt')) return 'pt'
	return 'en'
}

const transcriptionLanguage = new PersistState<TranscriptionLanguage>(
	'transcriptionLanguage',
	getBrowserLanguage(),
)

export default transcriptionLanguage
