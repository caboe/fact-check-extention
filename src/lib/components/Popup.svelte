<!-- src/components/Popup.svelte -->
<script lang="ts">
	import { onMount } from 'svelte'
	import state from '../../popupState.svelte'
	import Config from './Config.svelte'
	import endpoints from '../state/endpoints.svelte'
	import FactCheck from './FactCheck.svelte'

	onMount(async () => {
		await endpoints.load()
		if (!endpoints.value.length) state.showConfig = true
	})
</script>

<span class:hidden={!state.showConfig}>
	<Config />
</span>
<span class:hidden={state.showConfig}>
	<FactCheck />
</span>
