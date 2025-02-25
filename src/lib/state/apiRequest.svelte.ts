import { getResult, getSelectedContent } from '../util/unifiedStorage.svelte'

class ApiRequest {
	range: number = $state(50)
	tone: string = $state('')
	person: string = $state('')
	loading: boolean = $state(false)
	result: string = $state('')
	selectedContent: string = $state('')

	constructor() {
		this.readFromStorage()
	}

	async readFromStorage() {
		this.selectedContent = (await getSelectedContent()) || ''
		this.result = (await getResult()) || ''
	}
}

const apiRequest = new ApiRequest()

export default apiRequest
