<script lang="ts">
	import endpoints from '../state/endpoints.svelte'
	import L from '../state/L.svelte'
	import view from '../state/view.svelte'
	import AddEndpointForm from './AddEndpointForm.svelte'
	import EndpointList from './EndpointList.svelte'
	import CloseIcon from './icons/CloseIcon.svelte'
	import { SlideToggle } from '@skeletonlabs/skeleton'
	import { themeState, toggleTheme } from '../state/theme.svelte'

	function deleteEndpoint(title: string) {
		endpoints.delete(title)
		view.showAddEndpointForm = false
	}

	let isDarkMode = $derived(themeState.value === 'dark')
</script>

<div class="mx-1 p-3">
	<div class="mb-4 flex items-center justify-between">
		<div class="text-md font-bold">{L.apiEndpoint()}</div>
		<CloseIcon />
	</div>

	{#if view.showAddEndpointForm}
		<AddEndpointForm />
	{:else}
		<!-- Dark Mode Toggle -->
		<div class="mb-4 flex items-center justify-between">
			<label for="dark-mode-toggle" class="text-sm font-medium">{L.darkMode() ?? 'Dark Mode'}</label
			>
			<SlideToggle
				name="dark-mode-toggle"
				id="dark-mode-toggle"
				checked={isDarkMode}
				onchange={toggleTheme}
			/>
		</div>
		<EndpointList on:delete={(event: CustomEvent<string>) => deleteEndpoint(event.detail)} />
		<button
			class="variant-filled-success btn w-full"
			onclick={() => (view.showAddEndpointForm = true)}
			data-testid="config-new-endpoint-btn"
		>
			{L.newEndpoint()}
		</button>
	{/if}
</div>
