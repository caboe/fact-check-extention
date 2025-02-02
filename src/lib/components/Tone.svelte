<script lang="ts">
	import tone, { type ITone } from '../util/tone.svelte'

	const newTone: ITone = { value: [...tone.value] }

	function addNewEntry() {
		newTone.value = [...newTone.value, { thesis: '', answer: '' }]
	}

	function checkNotEmptyFields() {
		return newTone.value.some((e) => !e.thesis.trim() || !e.answer.trim())
	}

	function saveEntries(e: Event) {
		if (checkNotEmptyFields()) {
			alert('Please fill in all fields')
			e.preventDefault()
			return
		}
		tone.value = newTone.value
	}
</script>

<div class="container mx-auto p-4">
	<form onsubmit={saveEntries}>
		{#each newTone.value as item}
			<fieldset class="mb-4 grid grid-cols-1 gap-1">
				<label class="label">
					<span>Statement</span>
					<input
						type="text"
						bind:value={item.thesis}
						placeholder="Enter controversial statement..."
						class="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</label>
				<label class="label">
					<span>Response</span>
					<input
						type="text"
						bind:value={item.answer}
						placeholder="Enter factual response..."
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
				New Item
			</button>
			<button
				type="submit"
				class="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-600"
			>
				Save
			</button>
		</div>
	</form>
</div>
