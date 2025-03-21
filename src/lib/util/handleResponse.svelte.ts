import apiRequest from '../state/apiRequest.svelte'
import unifiedStorage from './unifiedStorage.svelte'

export default async function handleResponse(response: Response) {
	const parsed = await response.json()
	unifiedStorage.value.result = parsed.output.text
	apiRequest.value.loading = false
}
