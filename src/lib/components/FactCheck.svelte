<!-- src/components/FactCheck.svelte -->
<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton'
	import view from '../state/view.svelte'
	import checkFact from '../util/checkFact.svelte'
	import Connection from './steps/Connection.svelte'
	import Response from './steps/Response.svelte'
	import Selected from './steps/Selected.svelte'
</script>

<div class="p-1">
	<Accordion autocollapse spacing="space-y-4">
		<Selected open={view.step === 0} on:click={() => (view.step = 0)} />
		<Connection open={view.step === 1} on:click={() => (view.step = 1)} {checkFact} />
		<Response open={view.step === 2} on:click={() => (view.step = 2)} />
	</Accordion>
</div>
