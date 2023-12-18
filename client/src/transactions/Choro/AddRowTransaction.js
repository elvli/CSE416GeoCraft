import jsTPS_Transaction from "../../common/jsTPS.js"

export default class AddRowTransaction extends jsTPS_Transaction {
  constructor(data, rowIndex, setTableData) {
    super();
    this.data = data;
    this.rowIndex = rowIndex;
    this.setTableData = setTableData;
  }

  doTransaction() {
    this.setTableData(prevTableData => [
      ...prevTableData,
      this.data
    ]);
  }

  undoTransaction() {
    this.setTableData(prevTableData => prevTableData.slice(0, -1));
  }
}