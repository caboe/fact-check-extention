import type { RoleSize } from '../util/getSystemRole.svelte'
import { PersistState } from '../util/PersistState.svelte'

type ApiRequestState = 'EMPTY' | 'LOADING' | 'STREAMING' | 'FINISHED' | 'ERROR'

interface IApiRequest {
	range: number
	state: ApiRequestState
	roleSize: RoleSize // Use the updated RoleSize type
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
