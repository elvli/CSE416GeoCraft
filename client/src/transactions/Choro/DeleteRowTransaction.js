import jsTPS_Transaction from "../../common/jsTPS.js"

export default class AddRowTransaction extends jsTPS_Transaction {
  constructor(rowIndex, deletedRow, setTableData) {
    super();
    this.rowIndex = rowIndex;
    this.deletedRow = deletedRow;
    this.setTableData = setTableData;
  }

  doTransaction() {
    this.setTableData((prevTableData) => {
      const updatedData = [...prevTableData];
      updatedData.splice(this.rowIndex, 1);
      return updatedData;
    });
  }

  undoTransaction() {
    this.setTableData((prevTableData) => {
      const updatedData = [...prevTableData];
      updatedData.splice(this.rowIndex, 0, this.deletedRow);
      return updatedData;
    });
  }
}