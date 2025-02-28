import { PersistState } from './unifiedState.svelte'
import { SelectedContent } from '../../TSelectedContent'
import { Endpoint } from '../state/endpoints.svelte'
import { ITone } from './tone.svelte'
interface IUnifiedState {
	endpoints: Endpoint[] | null
	lastUsed: string | null
	tone: ITone | null
	hasSeenIntroduction: boolean
	selectedContent: SelectedContent | null
	result: any | null
}

class UnifiedStorage extends PersistState<IUnifiedState> {
	constructor() {
		const initialValue: IUnifiedState = {
			endpoints: null,
			lastUsed: null,
			tone: null,
			hasSeenIntroduction: false,
			selectedContent: null,
			result: null,
		}
		super('unifiedState', initialValue)
	}
}

const unifiedStorage = new UnifiedStorage()

export default unifiedStorage
