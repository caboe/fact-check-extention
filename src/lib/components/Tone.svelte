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

<form onsubmit={saveEntries}>
	{#each newTone.value as item}
		<input type="text" bind:value={item.thesis} placeholder="Enter controversial statement..." />
		<input type="text" bind:value={item.answer} placeholder="Enter factual response..." />
	{/each}
	<button type="button" onclick={addNewEntry}>New Item +</button>
	<button type="submit">Save</button>
</form>
