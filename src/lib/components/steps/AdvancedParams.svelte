<script lang="ts">
	import L from '../../state/L.svelte'
	import modelParams, { MODEL_PARAM_DEFAULTS } from '../../state/modelParams.svelte'
	import ResetIcon from '../icons/ResetIcon.svelte'

	type ParamKey = 'temperature' | 'top_p' | 'frequency_penalty' | 'presence_penalty'

	interface ParamConfig {
		key: ParamKey
		label: () => string
		min: number
		max: number
		step: number
	}

	const params: ParamConfig[] = [
		{ key: 'temperature', label: () => L.temperature(), min: 0, max: 2, step: 0.01 },
		{ key: 'top_p', label: () => L.topP(), min: 0, max: 1, step: 0.01 },
		{ key: 'frequency_penalty', label: () => L.frequencyPenalty(), min: -2, max: 2, step: 0.1 },
		{ key: 'presence_penalty', label: () => L.presencePenalty(), min: -2, max: 2, step: 0.1 },
	]
</script>

<fieldset class="flex flex-col gap-3 border-t border-surface-500/20 pt-3">
	<legend class="text-md px-1 font-semibold">{L.parameters()}</legend>
	{#each params as param (param.key)}
		{@const modelParam = modelParams.value[param.key]}
		<div class="flex flex-col gap-1">
			<div class="flex items-center justify-between">
				<label for={`param-${param.key}`} class="text-sm font-medium">{param.label()}</label>
				<div class="flex items-center gap-2">
					<span class="text-sm tabular-nums">{modelParam.value.toFixed(2)}</span>
					<ResetIcon
						onclick={() => (modelParams.value[param.key].value = MODEL_PARAM_DEFAULTS[param.key])}
					/>
				</div>
			</div>
			<input
				id={`param-${param.key}`}
				type="range"
				min={param.min}
				max={param.max}
				step={param.step}
				bind:value={modelParam.value}
				class="w-full"
			/>
			<label class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
				<input type="checkbox" class="checkbox" bind:checked={modelParam.enabled} />
				{L.includeInRequest()}
			</label>
		</div>
	{/each}
</fieldset>
