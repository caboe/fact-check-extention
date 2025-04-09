<script lang="ts">
	interface Props {
		size?: string
		color?: string
	}

	let { size = '18', color = 'currentColor' }: Props = $props()
</script>

<svg width={size} height={size} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
	<path d="M16 1H4V11H8L10 13L12 11H16V1Z" />
	<path d="M2 5V13H7.17157L8.70711 14.5355L7.29289 15.9497L6.34315 15H0V5H2Z" />
</svg>
