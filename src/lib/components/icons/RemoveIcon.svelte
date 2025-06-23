<script lang="ts">
	const { onclick }: { onclick: () => void } = $props()
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<button type="button" class="variant-filled-error btn-icon btn-icon-sm" {onclick}>
	<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M6 12L18 12"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
</button>
