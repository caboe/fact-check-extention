<script lang="ts">
	import popupState from '../../../popupState.svelte'

	interface Props {
		class?: string
		onclick?: () => void
	}

	let {
		class: className = '',
		onclick = () => (popupState.view = popupState.view === 'CONFIG' ? 'DEFAULT' : 'CONFIG'),
	}: Props = $props()
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<button type="button" class={className} {onclick}>
	<svg
		class="currentColor h-6 w-6"
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			d="M10.83 5a3.001 3.001 0 0 0-5.66 0H4a1 1 0 1 0 0 2h1.17a3.001 3.001 0 0 0 5.66 0H20a1 1 0 1 0 0-2h-9.17ZM4 11h9.17a3.001 3.001 0 0 1 5.66 0H20a1 1 0 1 1 0 2h-1.17a3.001 3.001 0 0 1-5.66 0H4a1 1 0 1 1 0-2Zm1.17 6H4a1 1 0 1 0 0 2h1.17a3.001 3.001 0 0 0 5.66 0H20a1 1 0 1 0 0-2h-9.17a3.001 3.001 0 0 0-5.66 0Z"
		/>
	</svg>
</button>
