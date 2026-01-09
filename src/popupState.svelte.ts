import { PersistState } from './lib/util/PersistState.svelte'

const popupState = new PersistState<'CONFIG' | 'DEFAULT' | 'ROLE_CONFIG' | 'RAG_CONFIG'>(
	'popupState',
	'DEFAULT',
)

export default popupState
