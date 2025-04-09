<script lang="ts">
	interface Props {
		size?: string
		color?: string
	}

	let { size = '18', color = 'currentColor' }: Props = $props()
</script>

<svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path d="M5 7H3.5L0.5 4L3.5 1H5V7Z" fill={color} />
	<path d="M7 1H15V3H7V1Z" fill={color} />
	<path d="M15 5H7V7H15V5Z" fill={color} />
	<path d="M1 9H15V11H1V9Z" fill={color} />
	<path d="M1 13H15V15H1V13Z" fill={color} />
</svg>
