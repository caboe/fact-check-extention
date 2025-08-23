import L from '../state/L.svelte'
import { full } from './role.svelte'
import unifiedStorage from './unifiedStorage.svelte'

export default function getSystemRole(person: string | null, range: number): string {
	const systemRole = full.replace(/{word_count}/g, String(range))
	let finalRole = systemRole.replace(/{person}/g, person || L.defaultPerson())

	// Add context information if enabled and contains content
	if (unifiedStorage.value.contextEnabled && unifiedStorage.value.contextText.trim()) {
		finalRole += `\n\nZUSÄTZLICHER KONTEXT:\nDer Nutzer hat folgenden Kontext zur Verfügung gestellt, der bei der Faktenprüfung berücksichtigt werden sollte: "${unifiedStorage.value.contextText.trim()}". Nutze diese Informationen, um deine Analyse präziser und relevanter zu gestalten.`
	}

	return finalRole
}
