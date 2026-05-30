import type { SelectedContent } from '../../TSelectedContent'
import { PersistState } from './PersistState.svelte'
import { basicRoles } from './role.svelte'

interface IUnifiedState {
	selectedRole: string
	hasSeenIntroduction: boolean
	selectedContent: SelectedContent | null
	result: string | undefined // Use string | undefined instead of any | null
	reasoning: string | undefined
	contextEnabled: boolean
	contextText: string
	selectedRagEndpoints: string[]
	useRag: boolean
}

class UnifiedStorage extends PersistState<IUnifiedState> {
	constructor() {
		const initialValue: IUnifiedState = {
			selectedRole: basicRoles[0].id,
			hasSeenIntroduction: false,
			selectedContent: null,
			result: undefined, // Initialize with undefined
			reasoning: undefined,
			contextEnabled: false,
			contextText: '',
			selectedRagEndpoints: [],
			useRag: true,
		}
		super('unifiedState', initialValue)
	}
}

const unifiedStorage = new UnifiedStorage()

export default unifiedStorage
