import { PersistState } from '../util/PersistState.svelte'

export const MODEL_PARAM_DEFAULTS = {
	temperature: 0.9,
	top_p: 0.93,
	frequency_penalty: 0.5,
	presence_penalty: 0.4,
} as const

interface ModelParam {
	value: number
	enabled: boolean
}

interface IModelParams {
	temperature: ModelParam
	top_p: ModelParam
	frequency_penalty: ModelParam
	presence_penalty: ModelParam
}

class ModelParams extends PersistState<IModelParams> {
	constructor() {
		const initialValue: IModelParams = {
			temperature: { value: MODEL_PARAM_DEFAULTS.temperature, enabled: true },
			top_p: { value: MODEL_PARAM_DEFAULTS.top_p, enabled: true },
			frequency_penalty: { value: MODEL_PARAM_DEFAULTS.frequency_penalty, enabled: true },
			presence_penalty: { value: MODEL_PARAM_DEFAULTS.presence_penalty, enabled: true },
		}
		super('modelParams', initialValue)
	}
}

const modelParams = new ModelParams()

export default modelParams
