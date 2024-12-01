<script lang="ts">
	import { AccordionItem } from '@skeletonlabs/skeleton'
	import apiRequest from '../../state/apiRequest.svelte'
	import L from '../../state/L.svelte'
	import response from '../svg/response.svg'

	interface Props {
		open: boolean
	}

	let { open }: Props = $props()

	function copyResult() {
		navigator.clipboard
			.writeText(apiRequest.result)
			.then(() => {
				alert(L.copied())
			})
			.catch((err) => {
				alert(L.copyError({ error: err.message }))
			})
	}
</script>

<AccordionItem {open}>
	{#snippet summary()}
		<label
			for="selected-text"
			class="text-md grid grid-cols-[16px_1fr] items-center gap-2 font-bold"
		>
			<img src={response} class="h-4 w-4" alt="Response Icon" />
			<span>
				{L.response()}
			</span>
		</label>
	{/snippet}
	{#snippet content()}
		{#if apiRequest.result}
			<textarea id="selected-text" bind:value={apiRequest.result} class="textarea" rows="4"
			></textarea>
			<button class="variant-filled-success btn w-full" onclick={copyResult}>
				{L.copy()}
			</button>
		{:else if apiRequest.loading}
			{L.checkingProgress()}
		{:else}
			{L.notChecked()}
		{/if}
	{/snippet}
</AccordionItem>
