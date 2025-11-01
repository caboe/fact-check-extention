import L from '../state/L.svelte'
import { roleTemplate, basicRoles } from './role.svelte'
import customRoles from './customRoles.svelte'
import unifiedStorage from './unifiedStorage.svelte'

export default function getSystemRole(person: string | null, range: number): string {
	// Combine basic and custom roles
	const allRoles = [...basicRoles, ...customRoles.value.customRoles]
	
	// Find the selected role or use empty string as default
	const selectedRole = person ? allRoles.find(role => role.name === person) : null
	
	let finalRole = roleTemplate.replace(/{roleStyle}/g, selectedRole?.role || '')
	finalRole = finalRole.replace(/{wordCount}/g, String(range))
	finalRole = finalRole.replace(/{person}/g, person || L.defaultPerson())

	// Add context information if enabled and contains content
	if (unifiedStorage.value.contextEnabled && unifiedStorage.value.contextText.trim()) {
		finalRole += `\n\nZUSÄTZLICHER KONTEXT:\nDer Nutzer hat folgenden Kontext zur Verfügung gestellt, der bei der Faktenprüfung berücksichtigt werden sollte: "${unifiedStorage.value.contextText.trim()}". Nutze diese Informationen, um deine Analyse präziser und relevanter zu gestalten.`
	}

	return finalRole
}
