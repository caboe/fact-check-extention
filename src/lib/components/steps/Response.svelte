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
			class="text-md grid grid-cols-[auto_1fr] items-center gap-4 text-left font-bold"
		>
			<ResponseIcon />
			<span>
				{L.response()}:
				{#if apiRequest.value.state === 'LOADING'}
					{L.checkingProgress()}
				{:else if apiRequest.value.state === 'THINKING'}
					{L.thinking()}
				{:else if apiRequest.value.state === 'FINISHED'}
					{L.finished()}
				{:else if apiRequest.value.state === 'EMPTY'}
					{L.notChecked()}
				{/if}
			</span>
		</label>
	{/snippet}
	{#snippet content()}
		{#if (apiRequest.value.state === 'FINISHED' || apiRequest.value.state === 'STREAMING' || apiRequest.value.state === 'THINKING') && (unifiedStorage.value.result || unifiedStorage.value.reasoning)}
			{#if (apiRequest.value.state === 'STREAMING' || apiRequest.value.state === 'THINKING') && unifiedStorage.value.reasoning}
				<div class="mb-2 text-sm italic text-gray-500 dark:text-gray-400">
					{unifiedStorage.value.reasoning}
				</div>
			{/if}
			{#if unifiedStorage.value.result}
				<textarea
					id="selected-text"
					bind:this={textareaEl}
					oninput={autoGrow}
					bind:value={unifiedStorage.value.result}
					class="textarea max-h-64 min-h-8"
					rows="1"
				></textarea>
			{/if}
			{#if apiRequest.value.state === 'FINISHED'}
				<button
					class="variant-filled-success btn w-full"
					onclick={copyResult}
					data-testid="response-copy-btn"
				>
					{L.copy()}
				</button>
			{/if}
		{:else if apiRequest.value.state === 'LOADING'}
			{L.checkingProgress()}
		{:else if apiRequest.value.state === 'FETCHING_RAG'}
			{L.fetchRagData()}
		{:else if apiRequest.value.state === 'THINKING'}
			{L.thinking()}
		{:else if apiRequest.value.state === 'ERROR'}
			<div class="font-bold text-red-500">Error:</div>
			<div class="whitespace-pre-wrap">{unifiedStorage.value.result}</div>
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
