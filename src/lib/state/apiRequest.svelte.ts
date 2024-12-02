import { Key } from '../util/roles.svelte'

class ApiRequest {
	range = $state(50)
	roleKey: Key | undefined = $state(undefined)
	person = $state('')
	loading = $state(false)
	result = $state('')
	selectedText = $state('')
}

const apiRequest = new ApiRequest()

export default apiRequest
