<script lang="ts">
	import { AccordionItem } from '@skeletonlabs/skeleton'
	import { fade } from 'svelte/transition'
	import apiRequest from '../../state/apiRequest.svelte'
	import L from '../../state/L.svelte'
	import unifiedStorage from '../../util/unifiedStorage.svelte'
	import ResponseIcon from '../icons/ResponseIcon.svelte'

	interface Props {
		open: boolean
	}

	let { open }: Props = $props()

	let textareaEl: HTMLTextAreaElement | null = $state(null)
	let message: string = $state('')

	function copyResult() {
		if (!unifiedStorage.value.result) return

		navigator.clipboard
			.writeText(unifiedStorage.value.result)
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
		unifiedStorage.value.result
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
			<ResponseIcon />
			<span>
				{L.response()}
			</span>
		</label>
	{/snippet}
	{#snippet content()}
		{#if (apiRequest.value.state === 'FINISHED' || apiRequest.value.state === 'STREAMING') && unifiedStorage.value.result}
			<textarea
				id="selected-text"
				bind:this={textareaEl}
				oninput={autoGrow}
				bind:value={unifiedStorage.value.result}
				class="textarea max-h-64 min-h-8"
				rows="1"
			></textarea>
			{#if apiRequest.value.state === 'FINISHED'}
				<button class="variant-filled-success btn w-full" onclick={copyResult}>
					{L.copy()}
				</button>
			{/if}
		{:else if apiRequest.value.state === 'LOADING'}
			{L.checkingProgress()}
		{:else if apiRequest.value.state === 'ERROR'}
			<div class="font-bold text-red-500">Error:</div>
			{@html unifiedStorage.value.result}
		{:else}
			{L.notChecked()}
		{/if}
		{#if message}
			<div
				class="flex h-full items-center justify-center bg-white/80 text-lg font-bold text-lime-700"
				transition:fade
			>
				<span>
					{message}
				</span>
			</div>
		{/if}
	{/snippet}
</AccordionItem>
