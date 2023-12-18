import jsTPS_Transaction from "../../common/jsTPS.js"

export default class StepChangeTransaction extends jsTPS_Transaction {
  constructor(oldStepCount, newStepCount, setStepCount) {
    super();
    this.oldStepCount = oldStepCount;
    this.newStepCount = newStepCount;
    this.setStepCount = setStepCount;
  }

  doTransaction() {
    this.setStepCount(this.newStepCount);
  }

  undoTransaction() {
    this.setStepCount(this.oldStepCount);
  }
}