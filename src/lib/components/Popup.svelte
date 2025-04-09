<!-- src/components/Popup.svelte -->
<script lang="ts">
	import { onMount } from 'svelte'
	import popupState from '../../popupState.svelte'
	import endpoints from '../state/endpoints.svelte'
	import { PersistState } from '../util/PersistState.svelte'
	import Config from './Config.svelte'
	import FactCheck from './FactCheck.svelte'
	import Introduction from './Introduction.svelte'
	import Tone from './Tone.svelte'
	import {
		themeState,
		initializeTheme,
		applyTheme,
		saveThemeToStorage,
	} from '../state/theme.svelte'

	const hasSeenIntroduction = new PersistState<boolean>('hasSeenIntroduction', false)

	function onclick() {
		hasSeenIntroduction.value = true
	}

	$effect(() => {
		popupState.value = endpoints.value.list.length === 0 ? 'CONFIG' : 'DEFAULT'
	})

	// Initialize theme from storage on component mount
	onMount(() => {
		initializeTheme()
	})

	// Effect to apply theme changes to DOM and save to storage
	$effect(() => {
		const current = themeState.currentTheme
		applyTheme(current)
		saveThemeToStorage(current)
	})
</script>

<span class:hidden={popupState.value !== 'CONFIG'}>
	<Config />
</span>
<span class:hidden={popupState.value !== 'DEFAULT'}>
	<FactCheck />
</span>
<span class:hidden={popupState.value !== 'TONE'}>
	<Tone />
</span>
{#if !hasSeenIntroduction.value}
	<Introduction {onclick} />
{/if}
