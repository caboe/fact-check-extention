class ApiRequest {
	range = $state(50)
	tone: string = $state('')
	person = $state('')
	loading = $state(false)
	result = $state('')
	selectedContent = $state('')
}

const apiRequest = new ApiRequest()

export default apiRequest
