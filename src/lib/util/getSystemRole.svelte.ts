import L from '../state/L.svelte'
import { roleTemplate, basicRoles } from './role.svelte'
import customRoles from './customRoles.svelte'
import unifiedStorage from './unifiedStorage.svelte'

export default function getSystemRole(person: string | null, range: number): string {
	// Combine basic and custom roles
	const allRoles = [...basicRoles, ...customRoles.value.customRoles]

	// Find the selected role or use empty string as default
	const selectedRole = person ? allRoles.find((role) => role.id === person) : basicRoles[0]

	let finalRole = roleTemplate.replace(/{roleStyle}/g, selectedRole?.role || '')
	finalRole = finalRole.replace(/{wordCount}/g, String(range))

	// Add context information if enabled and contains content
	let contextContent = ''
	if (unifiedStorage.value.activeContextId) {
		const activeContext = unifiedStorage.value.contexts?.find(
			(c) => c.id === unifiedStorage.value.activeContextId,
		)
		if (activeContext) {
			contextContent = activeContext.content
		}
	} else if (unifiedStorage.value.contextText) {
		contextContent = unifiedStorage.value.contextText
	}

	if (unifiedStorage.value.contextEnabled && contextContent.trim()) {
		finalRole += `\n\n--ADDITIONAL CONTEXT--:\nThe user has provided the following context, which should be taken into account when fact-checking: "${contextContent.trim()}". Use this information to make your fact-checking more precise and relevant.`
	}

	return finalRole
}
