import jsTPS_Transaction from "../../common/jsTPS.js"

export default class HeatEditTransaction extends jsTPS_Transaction {
    constructor(doFunction, undoFunction) {
      super();
      this.doFunction = doFunction;
      this.undoFunction = undoFunction;
    }
  
    doTransaction() {
      this.doFunction()
    }
  
    undoTransaction() {
      this.undoFunction()
    }
  }