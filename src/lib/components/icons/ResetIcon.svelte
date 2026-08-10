<script lang="ts">
	import L from '../../state/L.svelte'

	const { onclick }: { onclick: () => void } = $props()
</script>

<button
	type="button"
	class="btn-icon btn-icon-sm"
	title={L.resetToDefault()}
	aria-label={L.resetToDefault()}
	{onclick}
>
	<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M4 4V9H9"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M4.5 9a8 8 0 1 1-1.2 5"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
</button>
