class PopupState {
	public view: 'CONFIG' | 'TONE' | 'DEFAULT' = $state('DEFAULT')
}

const popupState = new PopupState()

export default popupState
