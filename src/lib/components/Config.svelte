<script lang="ts">
	import endpoints from '../state/endpoints.svelte'
	import L from '../state/L.svelte'
	import view from '../state/view.svelte'
	import AddEndpointForm from './AddEndpointForm.svelte'
	import EndpointList from './EndpointList.svelte'
	import CloseIcon from './icons/CloseIcon.svelte'
	import { SlideToggle } from '@skeletonlabs/skeleton'
	import { themeState, toggleTheme } from '../state/theme.svelte'
	import unifiedStorage from '../util/unifiedStorage.svelte'

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

		<div class="mb-4">
			<div class="mb-2 flex items-center justify-between">
				<label for="speech-toggle" class="text-sm font-medium">{L.speechInput() ?? 'Speech Input'}</label>
				<SlideToggle
					name="speech-toggle"
					id="speech-toggle"
					checked={unifiedStorage.value.speechEnabled}
					onchange={(e: Event) => {
						const t = e.target as HTMLInputElement
						unifiedStorage.value.speechEnabled = t.checked
					}}
				/>
			</div>
        <div class="grid grid-cols-2 gap-2">
            <label for="transcript-update" class="text-sm">{L.transcriptUpdate() ?? 'Transcript Update'}</label>
            <select
                id="transcript-update"
                class="select"
                bind:value={unifiedStorage.value.speechAppend}
            >
                <option value="append">{L.append() ?? 'Append'}</option>
                <option value="replace">{L.replace() ?? 'Replace'}</option>
            </select>
        </div>
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
