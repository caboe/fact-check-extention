<script lang="ts">
	import L from '../state/L.svelte'
	import customRoles from '../util/customRoles.svelte'
	import popupState from '../../popupState.svelte'
	import { basicRoles, type Role } from '../util/role.svelte'
	import CloseIcon from './icons/CloseIcon.svelte'
	import EditIcon from './icons/EditIcon.svelte'
	import RemoveIcon from './icons/RemoveIcon.svelte'

	let editingRole = $state<{ role: Role; index: number } | null>(null)
	let showAddForm = $state(false)
	let newRoleName = $state('')
	let newRoleContent = $state('')

	function addRole() {
		if (newRoleName.trim() && newRoleContent.trim()) {
			const newRole: Role = {
				id: newRoleName.trim(),
				role: newRoleContent.trim(),
			}
			customRoles.addRole(newRole)
			newRoleName = ''
			newRoleContent = ''
			showAddForm = false
		}
	}

	function editRole(role: Role, index: number) {
		editingRole = { role: { ...role }, index }
	}

	function saveEditedRole() {
		if (editingRole && editingRole.role.id.trim() && editingRole.role.role.trim()) {
			customRoles.updateRole(editingRole.index, editingRole.role)
			editingRole = null
		}
	}

	function cancelEdit() {
		editingRole = null
	}

	function deleteRole(index: number) {
		if (confirm(L.deleteRoleConfirm())) {
			customRoles.deleteRole(index)
		}
	}

	function copyRole(index: number) {
		const copiedRole = customRoles.copyRole(index)
		customRoles.addRole(copiedRole)
	}

	function createFromRole(role: Role) {
		newRoleName = `${getRoleName(role)} (Custom)`
		newRoleContent = role.role
		showAddForm = true
	}

	function isBasicRole(roleId: string): boolean {
		return basicRoles.some((role) => role.id === roleId)
	}

	function getRoleName(role: Role): string {
		if (role.id === 'scientist') return L.scientistName()
		if (role.id === 'satirist') return L.satiristName()
		return role.id
	}
</script>

<div class="mx-1 p-3">
	<div class="mb-4 flex items-center justify-between">
		<div class="text-md font-bold">{L.roleConfiguration()}</div>
		<CloseIcon onclick={() => (popupState.value = 'DEFAULT')} data-testid="role-config-close-btn" />
	</div>

	<!-- Basic Roles Section -->
	<div class="mb-6">
		<h3 class="mb-3 text-lg font-semibold text-gray-900 dark:text-white">{L.basicRoles()}</h3>
		<div class="space-y-2">
			{#each basicRoles as role (role.id)}
				<div
					class="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700"
				>
					<div class="flex items-start justify-between">
						<div class="flex-1">
							<h4 class="font-medium text-gray-900 dark:text-white">{getRoleName(role)}</h4>
							<p class="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
								{role.role.substring(0, 100)}...
							</p>
						</div>
						<div class="ml-3 flex items-center gap-2">
							<span class="text-sm text-gray-500 dark:text-gray-400">{L.builtIn()}</span>
							<button
								onclick={() => createFromRole(role)}
								class="variant-filled-success btn btn-sm"
								title={L.createFromTemplate()}
							>
								{L.createFromThis()}
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Custom Roles Section -->
	<div class="mb-6">
		<div class="mb-3 flex items-center justify-between">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">{L.customRoles()}</h3>
			<button
				onclick={() => (showAddForm = true)}
				class="variant-filled-success btn px-2 py-1"
				data-testid="role-add-btn"
			>
				{L.addRole()}
			</button>
		</div>

		{#if showAddForm}
			<div
				class="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20"
			>
				<h4 class="mb-3 font-medium text-gray-900 dark:text-white">{L.addNewRole()}</h4>
				<div class="space-y-3">
					<input
						type="text"
						placeholder={L.roleName()}
						bind:value={newRoleName}
						class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
						data-testid="role-name-input"
					/>
					<textarea
						placeholder={L.roleDescription()}
						bind:value={newRoleContent}
						rows="6"
						class="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
						data-testid="role-description-input"
					></textarea>
					<div class="flex gap-2">
						<button
							onclick={addRole}
							class="rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
							data-testid="role-save-btn"
						>
							{L.saveRole()}
						</button>
						<button
							onclick={() => {
								showAddForm = false
								newRoleName = ''
								newRoleContent = ''
							}}
							class="rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
							data-testid="role-cancel-btn"
						>
							{L.cancelRole()}
						</button>
					</div>
				</div>
			</div>
		{/if}

		<div class="space-y-2">
			{#each customRoles.value.customRoles as role, index (role.id + index)}
				<div
					class="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-gray-700"
				>
					{#if editingRole && editingRole.index === index}
						<!-- Edit Mode -->
						<div class="space-y-3">
							<input
								type="text"
								bind:value={editingRole.role.id}
								class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
							/>
							<textarea
								bind:value={editingRole.role.role}
								rows="6"
								class="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
							></textarea>
							<div class="flex gap-2">
								<button
									onclick={saveEditedRole}
									class="rounded bg-green-600 px-3 py-1 text-sm text-white transition-colors hover:bg-green-700"
								>
									{L.saveRole()}
								</button>
								<button
									onclick={cancelEdit}
									class="rounded bg-gray-600 px-3 py-1 text-sm text-white transition-colors hover:bg-gray-700"
								>
									{L.cancelRole()}
								</button>
							</div>
						</div>
					{:else}
						<!-- View Mode -->
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<h4 class="font-medium text-gray-900 dark:text-white">{role.id}</h4>
								<p class="mt-1 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
									{role.role.substring(0, 200)}...
								</p>
							</div>
							<div class="ml-3 flex gap-1">
								<button
									onclick={() => createFromRole(role)}
									class="variant-filled-success btn btn-sm"
									title={L.createFromExisting()}
								>
									{L.createFromThis()}
								</button>
								<EditIcon onclick={() => editRole(role, index)} />

								<RemoveIcon onclick={() => deleteRole(index)} />
							</div>
						</div>
					{/if}
				</div>
			{:else}
				<p class="text-gray-500 dark:text-gray-400 text-center py-8">{L.noCustomRoles()}</p>
			{/each}
		</div>
	</div>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
