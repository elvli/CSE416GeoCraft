import jsTPS_Transaction from "../common/jsTPS.js"

export default class SetDefaultsTransaction extends jsTPS_Transaction {
	constructor(oldSettings, newSettings, setSettingsValues) {
		super();
		this.oldSettings = oldSettings;
		this.newSettings = newSettings;
		this.setSettingsValues = setSettingsValues;
	}

	doTransaction() {
		this.setSettingsValues(this.newSettings);
	}

	undoTransaction() {
		this.setSettingsValues(this.oldSettings);
	}
}