<!-- src/components/Popup.svelte -->
<script lang="ts">
	import popupState from '../../popupState.svelte'
	import endpoints from '../state/endpoints.svelte'
	import { PersistState } from '../util/PersistState.svelte'
	import Config from './Config.svelte'
	import FactCheck from './FactCheck.svelte'
	import Introduction from './Introduction.svelte'
	import Tone from './Tone.svelte'

	const hasSeenIntroduction = new PersistState<boolean>('hasSeenIntroduction', false)

	function onclick() {
		hasSeenIntroduction.value = true
	}

	$effect(() => {
		popupState.value = endpoints.value.list.length === 0 ? 'CONFIG' : 'DEFAULT'
	})
</script>

<span class:hidden={popupState.value !== 'CONFIG' || !hasSeenIntroduction.value}>
	<Config />
</span>
<span class:hidden={popupState.value !== 'DEFAULT' || !hasSeenIntroduction.value}>
	<FactCheck />
</span>
<span class:hidden={popupState.value !== 'TONE' || !hasSeenIntroduction.value}>
	<Tone />
</span>
{#if !hasSeenIntroduction.value}
	<Introduction {onclick} />
{/if}
