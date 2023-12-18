import jsTPS_Transaction from "../../common/jsTPS.js"

export default class PointMapTransaction extends jsTPS_Transaction {
  constructor(functions, proceed, oldData, newData, rowIndex, colName) {
    super();
    this.functions = functions;
    this.proceed = proceed
    this.oldData = oldData
    this.newData  = newData
    this.rowIndex = rowIndex
    this.colName = colName
  }

  doTransaction() {
    switch (this.proceed){
        case 0:
            this.functions[0](this.newData, this.rowIndex, this.colName)
            break;
        case 1:
            this.functions[1]()
            break;
    }
  }

  undoTransaction() {
    switch (this.proceed){
        case 0:
            this.functions[0](this.oldData, this.rowIndex, this.colName)
            break;
        case 1:
            this.functions[2]()
            break;
    }
  }
}