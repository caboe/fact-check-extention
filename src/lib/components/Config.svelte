<script lang="ts">
	import endpoints from '../state/endpoints.svelte'
	import L from '../state/L.svelte'
	import view from '../state/view.svelte'
	import AddEndpointForm from './AddEndpointForm.svelte'
	import EndpointList from './EndpointList.svelte'
	import CloseIcon from './icons/CloseIcon.svelte'
	import LocalModelManager from './LocalModelManager.svelte'
	import { SlideToggle } from '@skeletonlabs/skeleton'
	import { themeState, toggleTheme } from '../state/theme.svelte'

	function deleteEndpoint(title: string) {
		endpoints.delete(title)
		view.showAddEndpointForm = false
	}

	let isDarkMode = $derived(themeState.value === 'dark')
	let activeTab = $state<'endpoints' | 'local'>('endpoints')
</script>

<div class="mx-1 p-3">
	<div class="mb-4 flex items-center justify-between">
		<div class="text-md font-bold">Settings</div>
		<CloseIcon />
	</div>

	<!-- Dark Mode Toggle -->
	<div class="mb-4 flex items-center justify-between">
		<label for="dark-mode-toggle" class="text-sm font-medium">{L.darkMode() ?? 'Dark Mode'}</label>
		<SlideToggle
			name="dark-mode-toggle"
			id="dark-mode-toggle"
			checked={isDarkMode}
			onchange={toggleTheme}
		/>
	</div>

	<!-- Tab Navigation -->
	<div class="mb-4 flex border-b border-surface-300">
		<button
			class="border-b-2 px-4 py-2 text-sm font-medium {activeTab === 'endpoints'
				? 'border-primary-500 text-primary-600'
				: 'border-transparent text-surface-600 hover:text-surface-800'}"
			onclick={() => (activeTab = 'endpoints')}
		>
			{L.apiEndpoint()}
		</button>
		<button
			class="border-b-2 px-4 py-2 text-sm font-medium {activeTab === 'local'
				? 'border-primary-500 text-primary-600'
				: 'border-transparent text-surface-600 hover:text-surface-800'}"
			onclick={() => (activeTab = 'local')}
		>
			Local Models
		</button>
	</div>

	<!-- Tab Content -->
	{#if activeTab === 'endpoints'}
		{#if view.showAddEndpointForm}
			<AddEndpointForm />
		{:else}
			<EndpointList on:delete={(event: CustomEvent<string>) => deleteEndpoint(event.detail)} />
			<button
				class="variant-filled-success btn w-full"
				onclick={() => (view.showAddEndpointForm = true)}
			>
				{L.newEndpoint()}
			</button>
		{/if}
	{:else if activeTab === 'local'}
		<LocalModelManager />
	{/if}
</div>
