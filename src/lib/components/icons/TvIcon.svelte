<script lang="ts">
	interface Props {
		size?: string
		color?: string
	}

	let { size = '18', color = 'currentColor' }: Props = $props()
</script>

<svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M8 2.96338L5.75926 0.349182L4.24074 1.65076L6.25437 4H1V15H15V4H9.74563L11.7593 1.65076L10.2407 0.349182L8 2.96338ZM11 6H3V13H11V6Z"
		fill={color}
	/>
</svg>
