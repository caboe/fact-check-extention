import { PersistState } from './PersistState.svelte'
import type { Role } from './role.svelte'

interface ICustomRolesState {
	customRoles: Role[]
}

class CustomRolesStorage extends PersistState<ICustomRolesState> {
	constructor() {
		const initialValue: ICustomRolesState = {
			customRoles: [],
		}
		super('customRoles', initialValue)

		// Migration: Convert 'name' to 'id' for existing roles
		$effect.root(() => {
			$effect(() => {
				let hasChanges = false
				const migratedRoles = this.value.customRoles.map((role: any) => {
					if (role.name && !role.id) {
						hasChanges = true
						return { ...role, id: role.name, name: undefined }
					}
					return role
				})

				if (hasChanges) {
					this.value = { ...this.value, customRoles: migratedRoles }
				}
			})
		})
	}

	addRole(role: Role) {
		this.value = {
			...this.value,
			customRoles: [...this.value.customRoles, role],
		}
	}

	updateRole(index: number, role: Role) {
		const newCustomRoles = [...this.value.customRoles]
		newCustomRoles[index] = role
		this.value = {
			...this.value,
			customRoles: newCustomRoles,
		}
	}

	deleteRole(index: number) {
		const newCustomRoles = this.value.customRoles.filter((_, i) => i !== index)
		this.value = {
			...this.value,
			customRoles: newCustomRoles,
		}
	}

	copyRole(index: number): Role {
		const originalRole = this.value.customRoles[index]
		return {
			id: `${originalRole.id} (Copy)`,
			role: originalRole.role,
		}
	}

	getRoles(): Role[] {
		return this.value.customRoles
	}
}

const customRoles = new CustomRolesStorage()

export default customRoles
