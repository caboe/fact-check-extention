import { PersistState } from '../util/PersistState.svelte'

type ApiRequestState = 'EMPTY' | 'LOADING' | 'STREAMING' | 'FINISHED' | 'ERROR'

interface IApiRequest {
	range: number
	state: ApiRequestState
	roleSize: 'short' | 'full'
}

class ApiRequest extends PersistState<IApiRequest> {
	constructor() {
		const initialValue: IApiRequest = {
			range: 50,
			state: 'EMPTY',
			roleSize: 'short',
		}
		super('apiRequest', initialValue)
	}
}

const apiRequest = new ApiRequest()

export default apiRequest
