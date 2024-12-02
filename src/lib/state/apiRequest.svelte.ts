import { Key } from '../util/roles.svelte'
import unifiedStorage from '../util/unifiedStorage.svelte'

class ApiRequest {
	range = $state(50)
	roleKey: Key | undefined = $state(undefined)
	person = $state('')
	loading = $state(false)
	result = $state('')
	selectedText = $state('')

	constructor() {
		unifiedStorage.getLastRoleKey().then((key) => {
			if (key) {
				this.roleKey = key
			}
		})
	}
}

const apiRequest = new ApiRequest()

export default apiRequest
