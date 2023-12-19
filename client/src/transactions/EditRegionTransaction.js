import jsTPS_Transaction from "../common/jsTPS.js"

export default class EditRegionTransaction extends jsTPS_Transaction {
	constructor(functions, mapId, newName, oldName) {
		super();
		this.functions = functions
        this.mapId = mapId
        this.newName = newName
        this.oldName = oldName
	}

	doTransaction() {
		this.functions(this.mapId, this.newName, this.oldName)
	}

	undoTransaction() {
		this.functions(this.mapId, this.oldName, this.newName)
	}
}