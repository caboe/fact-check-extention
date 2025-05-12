import L from '../state/L.svelte'
import { short, full } from './role.svelte'

export type RoleSize = 'short' | 'full'

export default function getSystemRole(
	person: string | null,
	range: number,
	size: RoleSize = 'full',
): string {
	const role = size === 'full' ? full : short

	const systemRole = role.replace(/{word_count}/g, String(range))

	return systemRole.replace(/{person}/g, person || L.defaultPerson())
}
