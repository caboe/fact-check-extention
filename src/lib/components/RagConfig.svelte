<script lang="ts">
	import popupState from '../../popupState.svelte'
	import L from '../state/L.svelte'
	import RagEndpointList from './RagEndpointList.svelte'
	import CloseIcon from './icons/CloseIcon.svelte'
</script>

<div class="flex flex-col gap-4 p-4">
	<div class="flex items-center gap-4">
		<CloseIcon
			onclick={() => {
				popupState.value = 'DEFAULT'
			}}
		/>
		<h2 class="h2 text-xl font-bold">{L.ragConfiguration()}</h2>
	</div>

	<RagEndpointList />
</div>
