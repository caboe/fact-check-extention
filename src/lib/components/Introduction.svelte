<script lang="ts">
	import L from '../state/L.svelte'

	interface Props {
		onclick: () => void
	}

	let { onclick }: Props = $props()
</script>

<div class="overflow-scroll p-4">
	{@html L.introduction()}
	<div class="pt-2 text-center">
		<button class="variant-filled btn" {onclick}>
			{L.letsGo()}
		</button>
	</div>
</div>
