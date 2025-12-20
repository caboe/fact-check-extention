<script lang="ts">
	interface Props {
		class?: string
		onclick: () => void
	}

	let { class: className = '', onclick }: Props = $props()
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<button type="button" class="variant-filled-primary btn-icon btn-icon-sm {className}" {onclick}>
	<svg
		class="h-4 w-4"
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
		/>
	</svg>
</button>
