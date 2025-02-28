import { PersistState } from './lib/util/unifiedState.svelte'

const popupState = new PersistState<'CONFIG' | 'TONE' | 'DEFAULT'>('popupState', 'DEFAULT')

export default popupState
