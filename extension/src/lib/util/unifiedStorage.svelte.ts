import { SelectedContent } from '../../TSelectedContent'
import { PersistState } from './PersistState.svelte'
interface IUnifiedState {
	lastUsed: string | null
	person: string | null
	hasSeenIntroduction: boolean
	selectedContent: SelectedContent | null
	result: any | null
}

class UnifiedStorage extends PersistState<IUnifiedState> {
	constructor() {
		const initialValue: IUnifiedState = {
			lastUsed: null,
			person: null,
			hasSeenIntroduction: false,
			selectedContent: null,
			result: null,
		}
		super('unifiedState', initialValue)
	}
}

const unifiedStorage = new UnifiedStorage()

export default unifiedStorage
