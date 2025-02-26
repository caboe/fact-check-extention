<script lang="ts">
	import { AccordionItem } from '@skeletonlabs/skeleton'
	import { fade } from 'svelte/transition'
	import apiRequest from '../../state/apiRequest.svelte'
	import L from '../../state/L.svelte'
	import response from '../svg/response.svg'

	interface Props {
		open: boolean
	}

	let { open }: Props = $props()

	let textareaEl: HTMLTextAreaElement | null = $state(null)
	let message: string = $state('')

	function copyResult() {
		if (!apiRequest.result) return

		navigator.clipboard
			.writeText(apiRequest.result)
			.then(() => {
				message = L.copied()
				setTimeout(() => {
					message = ''
				}, 2000)
			})
			.catch((err: Error) => {
				alert(L.copyError({ error: err.message }))
			})
	}

	$effect(() => {
		apiRequest.result
		autoGrow()
	})

	function autoGrow() {
		if (!textareaEl) return
		textareaEl.style.height = '5px'
		textareaEl.style.height = (textareaEl.scrollHeight || 100) + 'px'
	}
</script>

<AccordionItem {open} on:click>
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
		{#if apiRequest.result !== undefined}
			<textarea
				id="selected-text"
				bind:this={textareaEl}
				oninput={autoGrow}
				bind:value={apiRequest.result}
				class="textarea max-h-64 min-h-8"
				rows="1"
			></textarea>
			<button class="variant-filled-success btn w-full" onclick={copyResult}>
				{L.copy()}
			</button>
		{:else if apiRequest.loading}
			{L.checkingProgress()}
		{:else}
			{L.notChecked()}
		{/if}
		{#if message}
			<div
				class="absolute inset-0 flex h-full items-center justify-center bg-white/80 text-lg font-bold text-lime-700"
				transition:fade
			>
				<span>
					{message}
				</span>
			</div>
		{/if}
	{/snippet}
</AccordionItem>
