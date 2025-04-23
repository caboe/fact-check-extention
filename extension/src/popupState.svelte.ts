import { PersistState } from './lib/util/PersistState.svelte'

const popupState = new PersistState<'CONFIG' | 'DEFAULT'>('popupState', 'DEFAULT')

export default popupState
