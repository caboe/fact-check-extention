import L from '../state/L.svelte'
import { full } from './role.svelte'

export default function getSystemRole(person: string | null, range: number): string {
	const systemRole = full.replace(/{word_count}/g, String(range))

	return systemRole.replace(/{person}/g, person || L.defaultPerson())
}
