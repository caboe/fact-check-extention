<script lang="ts">
	import view from '../state/view.svelte'
	import L from '../state/L.svelte'
	import customRoles from '../util/customRoles.svelte'
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
				name: newRoleName.trim(),
				role: newRoleContent.trim()
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
		if (editingRole && editingRole.role.name.trim() && editingRole.role.role.trim()) {
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
		newRoleName = `${role.name} (Custom)`
		newRoleContent = role.role
		showAddForm = true
	}

	function closeConfig() {
		view.showRoleConfig = false
		editingRole = null
		showAddForm = false
	}

	function isBasicRole(roleName: string): boolean {
		return basicRoles.some(role => role.name === roleName)
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
		<!-- Header -->
		<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
			<h2 class="text-xl font-bold text-gray-900 dark:text-white">{L.roleConfiguration()}</h2>
			<button
				onclick={closeConfig}
				class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
			>
				<CloseIcon />
			</button>
		</div>

		<!-- Content -->
		<div class="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
			<!-- Basic Roles Section -->
			<div class="mb-6">
				<h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">{L.basicRoles()}</h3>
				<div class="space-y-2">
					{#each basicRoles as role (role.name)}
						<div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<h4 class="font-medium text-gray-900 dark:text-white">{role.name}</h4>
									<p class="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{role.role.substring(0, 100)}...</p>
								</div>
								<div class="flex items-center gap-2 ml-3">
									<span class="text-sm text-gray-500 dark:text-gray-400">{L.builtIn()}</span>
									<button
										onclick={() => createFromRole(role)}
										class="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
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
				<div class="flex items-center justify-between mb-3">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">{L.customRoles()}</h3>
					<button
						onclick={() => showAddForm = true}
						class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						{L.addRole()}
					</button>
				</div>

				{#if showAddForm}
					<div class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
						<h4 class="font-medium mb-3 text-gray-900 dark:text-white">{L.addNewRole()}</h4>
						<div class="space-y-3">
							<input
								type="text"
								placeholder={L.roleName()}
								bind:value={newRoleName}
								class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							/>
							<textarea
								placeholder={L.roleDescription()}
								bind:value={newRoleContent}
								rows="6"
								class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
							></textarea>
							<div class="flex gap-2">
								<button
									onclick={addRole}
									class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
								>
									{L.saveRole()}
								</button>
								<button
									onclick={() => { showAddForm = false; newRoleName = ''; newRoleContent = '' }}
									class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
								>
									{L.cancelRole()}
								</button>
							</div>
						</div>
					</div>
				{/if}

				<div class="space-y-2">
					{#each customRoles.value.customRoles as role, index (role.name + index)}
						<div class="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
							{#if editingRole && editingRole.index === index}
								<!-- Edit Mode -->
								<div class="space-y-3">
									<input
										type="text"
										bind:value={editingRole.role.name}
										class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
									/>
									<textarea
										bind:value={editingRole.role.role}
										rows="6"
										class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
									></textarea>
									<div class="flex gap-2">
										<button
											onclick={saveEditedRole}
											class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
										>
											{L.saveRole()}
										</button>
										<button
											onclick={cancelEdit}
											class="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
										>
											{L.cancelRole()}
										</button>
									</div>
								</div>
							{:else}
								<!-- View Mode -->
								<div class="flex items-start justify-between">
									<div class="flex-1">
										<h4 class="font-medium text-gray-900 dark:text-white">{role.name}</h4>
										<p class="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-3">{role.role.substring(0, 200)}...</p>
									</div>
									<div class="flex gap-1 ml-3">
										<button
											onclick={() => createFromRole(role)}
											class="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
											title={L.createFromExisting()}
										>
											{L.createFromThis()}
										</button>
										<EditIcon onclick={() => editRole(role, index)} />
										<button
											onclick={() => copyRole(index)}
											class="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
											title={L.copyRole()}
										>
											📋
										</button>
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
	</div>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>