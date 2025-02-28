import { PersistState } from '../util/unifiedState.svelte'

interface IApiRequest {
	range: number
	loading: boolean
}

class ApiRequest extends PersistState<IApiRequest> {
	constructor() {
		const initialValue: IApiRequest = {
			range: 50,
			loading: false,
		}
		super('apiRequest', initialValue)
	}
}

const apiRequest = new ApiRequest()

export default apiRequest
