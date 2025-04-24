import role from './role.svelte'
export default function getSystemRole(person: string | null, range: number): string {
	let systemRole = role.replace('{range}', String(range))

	// Replace <person> tag with the provided person's name or an empty string
	// TODO default  person
	systemRole = systemRole.replace(/<person>/g, person || '')

	return systemRole
}
