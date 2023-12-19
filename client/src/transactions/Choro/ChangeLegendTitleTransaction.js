import jsTPS_Transaction from "../../common/jsTPS.js"

export default class ChangeLegendTitleTransaction extends jsTPS_Transaction {
  constructor(oldLegendTitle, newLegendTitle, setLegendTitle) {
    super();
    this.oldLegendTitle = oldLegendTitle;
    this.newLegendTitle = newLegendTitle;
    this.setLegendTitle = setLegendTitle;
  }

  doTransaction() {
    this.setLegendTitle(this.newLegendTitle);
  }

  undoTransaction() {
    this.setLegendTitle(this.oldLegendTitle);
  }
}