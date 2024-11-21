<script lang="ts">
	import { AccordionItem } from '@skeletonlabs/skeleton';
	import L from '../L.svelte';
	import response from '../svg/response.svg';

	interface Props {
		open: boolean;
		result: string;
		loading: boolean;
	}

	let { open, result, loading }: Props = $props();

	function copyResult() {
		navigator.clipboard
			.writeText(result)
			.then(() => {
				alert(L.copied());
			})
			.catch((err) => {
				alert(L.copyError({ error: err.message }));
			});
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
		{#if result}
			<textarea id="selected-text" bind:value={result} class="textarea" rows="4"></textarea>
			<button class="variant-filled-success btn w-full" onclick={copyResult}>
				{L.copy()}
			</button>
		{:else if loading}
			{L.checkingProgress()}
		{:else}
			{L.notChecked()}
		{/if}
	{/snippet}
</AccordionItem>
