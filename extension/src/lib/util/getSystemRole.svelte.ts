import role from './role.svelte'
export default function getSystemRole(person: string | null, range: number): string {
	let systemRole = role.replace('{range}', String(range))

	if (person) {
		systemRole += `\n\nRespond in the style of ${person}.`
	}

	return systemRole
}
