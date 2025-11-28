<script lang="ts">
	import { AccordionItem } from '@skeletonlabs/skeleton'
	import popupState from '../../../popupState.svelte'
	import { isSelectedImage } from '../../../TSelectedContent'
	import apiRequest from '../../state/apiRequest.svelte'
	import endpoints from '../../state/endpoints.svelte'
	import L from '../../state/L.svelte'
	import view from '../../state/view.svelte'
	import unifiedStorage from '../../util/unifiedStorage.svelte'
	import ConnectionIcon from '../icons/ConnectionIcon.svelte'
	import Settings from '../icons/SettingsIcon.svelte'
	import { basicRoles } from '../../util/role.svelte'
	import customRoles from '../../util/customRoles.svelte'

	interface Props {
		open: boolean
		checkFact: () => Promise<void>
	}

	let { open, checkFact }: Props = $props()

	let endpointSelect: HTMLSelectElement | null = $state(null)

	// Combine basic and custom roles reactively
	const allRoles = $derived([...basicRoles, ...customRoles.value.customRoles])

	$effect(() => {
		apiRequest.value.rolePlacement = endpoints.value.selected?.rolePlacement ?? 'system'
	})

	if (unifiedStorage.value.selectedContent && view.step === 0) {
		view.step = 1
	}

	let isImageSelected = $derived(isSelectedImage(unifiedStorage.value.selectedContent))

	let availableEndpoints = $derived(
		isImageSelected
			? endpoints.value.list.filter((ep) => ep.canProcessImages)
			: endpoints.value.list,
	)

	let selectedRoleName = $derived.by(() => {
		const roleId = unifiedStorage.value.selectedRole
		if (roleId === 'scientist') return L.scientistName()
		if (roleId === 'satirist') return L.satiristName()
		return roleId
	})

	$effect(() => {
		// Automatically select an endpoint when the available list changes
		const currentSelected = endpoints.value.selected
		const isCurrentSelectedAvailable =
			currentSelected && availableEndpoints.some((ep) => ep.title === currentSelected.title)

		if (!isCurrentSelectedAvailable) {
			if (availableEndpoints.length) {
				// Select the first available endpoint if the current one is not available
				endpoints.value.selected = availableEndpoints[0]
			} else {
				// No endpoints available (e.g., image selected, none support it)
				endpoints.value.selected = null
			}
		}
	})
</script>

<AccordionItem {open} on:click>
	{#snippet summary()}
		<label
			for={availableEndpoints.length > 0 ? 'endpoints' : null}
			class="text-md grid grid-cols-[16px_1fr] items-center gap-4 text-left font-bold"
		>
			<ConnectionIcon />
			{L.rolePlacementLabel()}: {selectedRoleName}
		</label>
	{/snippet}
	{#snippet content()}
		<div class="mt-3 flex flex-col gap-2">
			<div class="flex items-center justify-between">
				<div class="text-md">{L.configureApi()}</div>
				<Settings />
			</div>
			{#if isImageSelected && availableEndpoints.length === 0}
				<div class="alert variant-soft-warning flex flex-col items-center gap-2 p-2 text-center">
					<span>{L.noImageEndpoint()}</span>
					<button
						class="variant-filled-primary btn btn-sm"
						onclick={() => (popupState.value = 'CONFIG')}
					>
						{L.configureButton()}
					</button>
				</div>
			{:else if availableEndpoints.length > 0}
				<select
					bind:this={endpointSelect}
					class="select"
					id="endpoints"
					onchange={(event) => {
						const selectedEndpoint = availableEndpoints.find(
							(ep) => ep.title === (event.target as HTMLSelectElement).value,
						)
						endpoints.value.selected = selectedEndpoint || null
					}}
					value={endpoints.value.selected?.title || ''}
				>
					{#each availableEndpoints as endpoint (endpoint.title)}
						<option value={endpoint.title}>{endpoint.title}</option>
					{/each}
				</select>
			{/if}

			<div class="flex items-center justify-between">
				<div class="text-md">{L.rolePlacementLabel()}</div>
				<Settings onclick={() => (view.showRoleConfig = true)} />
			</div>
			<label class="flex flex-col gap-2">
				<select class="select" bind:value={unifiedStorage.value.selectedRole}>
					{#each allRoles as role (role.id)}
						<option value={role.id}>
							{role.id === 'scientist'
								? L.scientistName()
								: role.id === 'satirist'
									? L.satiristName()
									: role.id}
						</option>
					{/each}
				</select>
			</label>
			<div class="flex flex-col items-center justify-between gap-2">
				<input type="range" min="3" max="500" bind:value={apiRequest.value.range} class="mt-2" />
				<div class="text-sm">{L.responseLength({ responseLength: apiRequest.value.range })}</div>
			</div>
		</div>
	{/snippet}
</AccordionItem>
