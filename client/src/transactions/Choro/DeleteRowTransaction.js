import jsTPS_Transaction from "../../common/jsTPS.js"

export default class AddRowTransaction extends jsTPS_Transaction {
  constructor(rowIndex, deletedRow, setTableData, map, regionName, layerData) {
    super();
    this.rowIndex = rowIndex;
    this.deletedRow = deletedRow;
    this.setTableData = setTableData;
    this.map = map;
    this.regionName = regionName;
    this.layerData = layerData;
  }

  doTransaction() {
    this.setTableData((prevTableData) => {
      const updatedData = [...prevTableData];
      updatedData.splice(this.rowIndex, 1);

      if (this.map.current.getLayer(`${this.regionName}-choro`)) {
        this.map.current.removeLayer(`${this.regionName}-choro`);
      }

      return updatedData;
    });
  }

  undoTransaction() {
    this.setTableData((prevTableData) => {
      const updatedData = [...prevTableData];
      updatedData.splice(this.rowIndex, 0, this.deletedRow);

      if (this.map.current.getLayer(`${this.regionName}-choro`)) {
        this.map.current.removeLayer(`${this.regionName}-choro`);
      }

      this.map.current.addLayer({
        id: `${this.regionName}-choro`,
        type: 'fill',
        source: 'choro-map',
        filter: this.layerData.filter,
        paint: {
          'fill-color': this.layerData.paint,
          'fill-opacity': 1,
        },
      });

      return updatedData;
    });
  }
}