import jsTPS_Transaction from "../../common/jsTPS.js"

export default class EditChangeLegendTransaction extends jsTPS_Transaction {
	constructor(oldVal, newVal, table, setTable, row, col ) {
		super();
		this.oldVal = oldVal;
		this.newVal = newVal;
		this.table = table;
        this.setTable = setTable;
        this.row = row;
        this.col = col;

	}

	doTransaction() {
        const updatedData = this.table.map((row, index) => {
        if (index === this.row) {
            return { ...row, [this.col]: this.newVal };
        }
        return row;
        });
        this.setTable(updatedData);
	}

	undoTransaction() {
		const updatedData = this.table.map((row, index) => {
            if (index === this.row) {
                return { ...row, [this.col]: this.oldVal };
            }
            return row;
            });
            this.setTable(updatedData);
	}
}