import { PersistState } from './lib/util/PersistState.svelte'

const popupState = new PersistState<'CONFIG' | 'TONE' | 'DEFAULT'>('popupState', 'DEFAULT')

export default popupState
