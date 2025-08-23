import type { SelectedContent } from '../../TSelectedContent'
import { PersistState } from './PersistState.svelte'
interface IUnifiedState {
	lastUsed: string | null
	person: string | null
	hasSeenIntroduction: boolean
	selectedContent: SelectedContent | null
	result: string | undefined // Use string | undefined instead of any | null
	contextEnabled: boolean
	contextText: string
}

class UnifiedStorage extends PersistState<IUnifiedState> {
	constructor() {
		const initialValue: IUnifiedState = {
			lastUsed: null,
			person: null,
			hasSeenIntroduction: false,
			selectedContent: null,
			result: undefined, // Initialize with undefined
			contextEnabled: false,
			contextText: ''
		}
		super('unifiedState', initialValue)
	}
}

const unifiedStorage = new UnifiedStorage()

export default unifiedStorage
