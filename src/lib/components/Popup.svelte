<!-- src/components/Popup.svelte -->
<script lang="ts">
	import { onMount } from 'svelte'
	import popupState from '../../popupState.svelte'
	import endpoints from '../state/endpoints.svelte'
	import { getHasSeenIntroduction, setHasSeenIntroduction } from '../util/unifiedStorage.svelte'
	import Config from './Config.svelte'
	import FactCheck from './FactCheck.svelte'
	import Introduction from './Introduction.svelte'
	import Tone from './Tone.svelte'

	let showIntroduction = $state(false)

	function onclick() {
		showIntroduction = false
		setHasSeenIntroduction()
	}

	onMount(async () => {
		await endpoints.load()
		if (!endpoints.value.length) popupState.view = 'CONFIG'
		showIntroduction = !(await getHasSeenIntroduction())
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
{#if showIntroduction}
	<Introduction {onclick} />
{/if}
