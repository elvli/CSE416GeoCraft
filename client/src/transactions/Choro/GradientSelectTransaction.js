import jsTPS_Transaction from "../../common/jsTPS.js"

export default class GradientSelectTransaction extends jsTPS_Transaction {
  constructor(oldChoroTheme, newChoroTheme, setChoroTheme) {
    super();
    this.oldChoroTheme = oldChoroTheme;
    this.newChoroTheme = newChoroTheme;
    this.setChoroTheme = setChoroTheme;
  }

  doTransaction() {
    this.setChoroTheme(this.newChoroTheme);
  }

  undoTransaction() {
    this.setChoroTheme(this.oldChoroTheme);
  }
}