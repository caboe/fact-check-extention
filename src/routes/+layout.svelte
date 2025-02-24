<script lang="ts">
	import '../app.css'
	import { onMount } from 'svelte'
	import { autoModeWatcher } from '@skeletonlabs/skeleton'

	let { children } = $props()

	onMount(() => {
		autoModeWatcher()
	})
</script>

{@render children()}
