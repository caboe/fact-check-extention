<script lang="ts">
	import popupState from '../../popupState.svelte'
	import tone, { type ITone } from '../util/tone.svelte'
	import CloseIcon from './icons/CloseIcon.svelte'
	import L from '../state/L.svelte'

	const newTone: ITone = { value: [...tone.value] }

	function addNewEntry() {
		newTone.value = [...newTone.value, { thesis: '', answer: '' }]
	}

	function checkNotEmptyFields() {
		return newTone.value.some((e) => !e.thesis.trim() || !e.answer.trim())
	}

	function close() {
		popupState.view = 'DEFAULT'
	}

	function saveEntries(e: Event) {
		if (checkNotEmptyFields()) {
			alert(L.fillAllFieldsAlert())
			e.preventDefault()
			return
		}
		tone.value = newTone.value
		close()
	}
</script>

<div class="container mx-auto p-4">
	<div class="align-items grid grid-cols-[1fr_30px]">
		<h2 class="text-2xl font-bold">Tone</h2>
		<CloseIcon />
	</div>
	<p class="my-4 text-gray-600">
		{L.toneDescription()}
	</p>
	<form onsubmit={saveEntries}>
		{#each newTone.value as item}
			<fieldset class="card mb-2 grid grid-cols-1 gap-1 rounded-md p-2">
				<label class="label">
					<span>{L.statementLabel()}</span>
					<input
						type="text"
						bind:value={item.thesis}
						placeholder={L.statementLabel()}
						class="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</label>
				<label class="label">
					<span>{L.responseLabel()}</span>
					<input
						type="text"
						bind:value={item.answer}
						placeholder={L.responseLabel()}
						class="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</label>
			</fieldset>
		{/each}
		<div class="flex space-x-4">
			<button
				type="button"
				onclick={addNewEntry}
				class="rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition-colors duration-200 hover:bg-gray-300"
			>
				{L.newItemButton()}
			</button>
			<button
				type="submit"
				class="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-600"
			>
				{L.saveButton()}
			</button>
		</div>
	</form>
</div>
