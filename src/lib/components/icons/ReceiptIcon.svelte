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
		d="M2 0H14V16H12L10 14L8 16L6 14L4 16H2V0ZM5 4H11V6H5V4ZM11 8H5V10H11V8Z"
		fill={color}
	/>
</svg>
