import jsTPS_Transaction from "../../common/jsTPS.js"

export default class ChangeDataHeaderTransaction extends jsTPS_Transaction {
  constructor(oldTableHeaders, newTableHeaders, setTableHeaders, setIsEditing) {
    super();
    this.oldTableHeaders = oldTableHeaders;
    this.newTableHeaders = newTableHeaders;
    this.setTableHeaders = setTableHeaders;
    this.setIsEditing = setIsEditing;
  }

  doTransaction() {
    this.setTableHeaders(this.newTableHeaders);
    this.setIsEditing(null);
  }

  undoTransaction() {
    this.setTableHeaders(this.oldTableHeaders);
    this.setIsEditing(this.oldTableHeaders.indexOf('') !== -1 ? this.oldTableHeaders.indexOf('') : null);
  }
}
