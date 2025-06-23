<script lang="ts">
	interface Props {
		size?: string
		color?: string
	}

	let { size = '18', color = 'currentColor' }: Props = $props()
</script>

<svg width={size} height={size} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
	<path d="M15 1H1V7H3.38197L4.88196 4L7.11803 4L10 9.76393L11.382 7H15V1Z" />
	<path d="M15 9H12.618L11.118 12L8.88197 12L6 6.23607L4.61803 9H1V15H15V9Z" />
</svg>
