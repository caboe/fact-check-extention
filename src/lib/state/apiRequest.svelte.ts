class ApiRequest {
	range = $state(50)
	isAnswer = $state(false)
	person = $state('')
	loading = $state(false)
	result = $state('')
	selectedText = $state('')
}

const apiRequest = new ApiRequest()

export default apiRequest
