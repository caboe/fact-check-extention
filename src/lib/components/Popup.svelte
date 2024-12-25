<!-- src/components/Popup.svelte -->
<script lang="ts">
	import { onMount } from 'svelte'
	import popupState from '../../popupState.svelte'
	import endpoints from '../state/endpoints.svelte'
	import { getHasSeenIntroduction, setHasSeenIntroduction } from '../util/unifiedStorage.svelte'
	import Config from './Config.svelte'
	import FactCheck from './FactCheck.svelte'
	import Introduction from './Introduction.svelte'

	let showIntroduction = $state(false)

	function onclick() {
		showIntroduction = false
		setHasSeenIntroduction()
	}

	onMount(async () => {
		await endpoints.load()
		if (!endpoints.value.length) popupState.showConfig = true
		showIntroduction = !(await getHasSeenIntroduction())
	})
</script>

<span class:hidden={!popupState.showConfig}>
	<Config />
</span>
<span class:hidden={popupState.showConfig}>
	<FactCheck />
</span>
{#if showIntroduction}
	<Introduction {onclick} />
{/if}
