import type { SelectedContent } from '../../TSelectedContent'
import { PersistState } from './PersistState.svelte'
import { basicRoles } from './role.svelte'

interface IUnifiedState {
	lastUsed: string | null
	selectedRole: string
	hasSeenIntroduction: boolean
	selectedContent: SelectedContent | null
	result: string | undefined // Use string | undefined instead of any | null
	reasoning: string | undefined
	contextEnabled: boolean
	contextText?: string // Deprecated
	contexts: { id: string; name: string; content: string }[]
	activeContextId: string | null
	selectedRagEndpoints: string[]
	useRag: boolean
}

class UnifiedStorage extends PersistState<IUnifiedState> {
	constructor() {
		const initialValue: IUnifiedState = {
			lastUsed: null,
			selectedRole: basicRoles[0].id,
			hasSeenIntroduction: false,
			selectedContent: null,
			result: undefined, // Initialize with undefined
			reasoning: undefined,
			contextEnabled: false,
			contextText: '',
			contexts: [],
			activeContextId: null,
			selectedRagEndpoints: [],
			useRag: true,
		}
		super('unifiedState', initialValue)

		this.ready.then(() => {
			if (!this.value.contexts) {
				this.value.contexts = []
			}

			if (this.value.contextText && this.value.contexts.length === 0) {
				const id = crypto.randomUUID()
				this.value.contexts.push({
					id,
					name: 'Default Context',
					content: this.value.contextText,
				})
				this.value.activeContextId = id
			}

			if (this.value.contexts.length > 0 && !this.value.activeContextId) {
				this.value.activeContextId = this.value.contexts[0].id
			}
		})
	}
}

const unifiedStorage = new UnifiedStorage()

export default unifiedStorage
