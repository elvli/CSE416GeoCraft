import jsTPS_Transaction from "../../common/jsTPS.js"

export default class EditRegionTransaction extends jsTPS_Transaction {
  constructor(initStore, initIndex, initSong) {
    super();
    this.store = initStore;
  }

  doTransaction() {
    // this.store;
  }

  undoTransaction() {
    
  }
}