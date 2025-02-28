<!-- src/components/Popup.svelte -->
<script lang="ts">
	import popupState from '../../popupState.svelte'
	import endpoints from '../state/endpoints.svelte'
	import { PersistState } from '../util/unifiedState.svelte'
	import Config from './Config.svelte'
	import FactCheck from './FactCheck.svelte'
	import Introduction from './Introduction.svelte'
	import Tone from './Tone.svelte'

	const hasSeenIntroduction = new PersistState<boolean>('hasSeenIntroduction', false)

	function onclick() {
		hasSeenIntroduction.value = true
		console.log(123, hasSeenIntroduction.value)
	}

	$effect(() => {
		if (!endpoints.value.list.length) popupState.view = 'CONFIG'
	})
</script>

<span class:hidden={popupState.view !== 'CONFIG'}>
	<Config />
</span>
<span class:hidden={popupState.view !== 'DEFAULT'}>
	<FactCheck />
</span>
<span class:hidden={popupState.view !== 'TONE'}>
	<Tone />
</span>
{#if !hasSeenIntroduction.value}
	<Introduction {onclick} />
{/if}
