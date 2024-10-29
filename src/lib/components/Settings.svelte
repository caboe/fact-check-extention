<script lang="ts">
	import popupState from '../../popupState.svelte';
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<button
	type="button"
	class="btn-icon btn-icon-sm variant-filled"
	onclick={() => (popupState.showConfig = !popupState.showConfig)}
>
	<svg
		class="h-6 w-6 text-gray-50 dark:text-gray-900"
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		fill="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			d="M10.83 5a3.001 3.001 0 0 0-5.66 0H4a1 1 0 1 0 0 2h1.17a3.001 3.001 0 0 0 5.66 0H20a1 1 0 1 0 0-2h-9.17ZM4 11h9.17a3.001 3.001 0 0 1 5.66 0H20a1 1 0 1 1 0 2h-1.17a3.001 3.001 0 0 1-5.66 0H4a1 1 0 1 1 0-2Zm1.17 6H4a1 1 0 1 0 0 2h1.17a3.001 3.001 0 0 0 5.66 0H20a1 1 0 1 0 0-2h-9.17a3.001 3.001 0 0 0-5.66 0Z"
		/>
	</svg>
</button>
