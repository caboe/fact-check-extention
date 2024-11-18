<!-- src/components/Popup.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import state from '../../popupState.svelte';
	import Config from './Config.svelte';
	import endpoints from './Endpoints.svelte';
	import FactCheck from './FactCheck.svelte';

	interface Endpoint {
		title: string;
		url: string;
		apiKey: string;
	}

	onMount(() => {
		if (!endpoints.value.length) state.showConfig = true;
	});
</script>

{#if state.showConfig}
	<Config />
{:else}
	<FactCheck />
{/if}
