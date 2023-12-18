import jsTPS_Transaction from "../../common/jsTPS.js"

export default class ChangeTableDataTransaction extends jsTPS_Transaction {
  constructor(rowIndex, colName, oldValue, newValue, setTableData) {
    super();
    this.rowIndex = rowIndex;
    this.colName = colName;
    this.oldValue = oldValue;
    this.newValue = newValue;
    this.setTableData = setTableData;
  }

  doTransaction() {
    this.setTableData((prevTableData) => {
      const updatedData = prevTableData.map((row, index) => {
        if (index === this.rowIndex) {
          return { ...row, [this.colName]: this.newValue };
        }
        return row;
      });
      return updatedData;
    });
  }

  undoTransaction() {
    this.setTableData((prevTableData) => {
      const updatedData = prevTableData.map((row, index) => {
        if (index === this.rowIndex) {
          return { ...row, [this.colName]: this.oldValue };
        }
        return row;
      });
      return updatedData;
    });
  }
}