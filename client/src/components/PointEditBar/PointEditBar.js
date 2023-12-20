import React, { useState, useRef, useContext, useEffect } from 'react';
import { Button, Table, Accordion, Row, Col } from 'react-bootstrap';
import { GlobalStoreContext } from '../../store';
import { XLg, PlusCircleFill, ViewStacked, Save, ArrowClockwise, ArrowCounterclockwise, PencilSquare, FileEarmarkArrowUp } from 'react-bootstrap-icons';
import MapNameModal from '../MapNameModal/MapNameModal';
import SaveAndExitModal from '../SaveAndExitModal/SaveAndExitModal';
import PublishMapModal from '../PublishMapModal/PublishMapModal';
import RemoveGeoJsonModal from '../RemoveGeoJsonModal/RemoveGeoJsonModal';
import PointMapTransaction from '../../transactions/Point/PointMapTransaction';
import SetDefaultsTransaction from '../../transactions/SetDefaultsTransaction';
import SettingsChangeTransaction from '../../transactions/SettingsChangeTransaction';
import EditChangeLegendTransaction from '../../transactions/Point/EditLegendChangeTransaction';
import EditLegendTitleTransaction from '../../transactions/Point/EditLegendTitleTransaction';
import rewind from "@mapbox/geojson-rewind";
import jsTPS from '../../common/jsTPS';
import './PointEditBar.scss'
import EditRegionModal from '../EditRegionModal/EditRegionModal';
import JSZip from 'jszip';


export default function PointEditBar(props) {
  const { mapId, points, settings, map } = props;
  const { store } = useContext(GlobalStoreContext);

  // State variables
  const [prevSelectedRegions, setPrevSelectedRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [showRegion, setShowRegion] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [show, setShow] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showGeoModal, setShowGeoModal] = useState(false);
  const [publishMapShow, setPublishMapShow] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [isEditingHeader, setIsEditingHeader] = useState(null);
  const [tableData, setTableData] = useState(points);
  const [tableHeaders, setTableHeaders] = useState(['ID', 'Latitude', 'Longitude', 'Color']);
  const [jsonData, setJsonData] = useState('');
  const downloadLinkRef = useRef(null);
  const [settingsValues, setSettingsValues] = useState([41.8473, 12.7971, 5.43]);
  const [tps, setTPS] = useState(new jsTPS);
  const [legendTableData, setLegendTableData] = useState(
    [
      { 'color': 'White', 'description': '' },
      { 'color': 'Black', 'description': '' },
      { 'color': 'Red', 'description': '' },
      { 'color': 'Orange', 'description': '' },
      { 'color': 'Yellow', 'description': '' },
      { 'color': 'Green', 'description': '' },
      { 'color': 'Blue', 'description': '' },
      { 'color': 'Purple', 'description': '' },
    ]);
  const [legendHeaders, setLegendHeaders] = useState(['Color', 'Description']);
  const [legendTitle, setLegendTitle] = useState("");
  const shp = require("shpjs");

  function toggleSideBar(event) {
    event.preventDefault();
    setIsToggled(!isToggled);
  }

  function handleUndo(event) {
    event.preventDefault();

    if (tps.hasTransactionToUndo()) {
      tps.undoTransaction();
    }
  }

  function handleRedo(event) {
    event.preventDefault();

    if (tps.hasTransactionToRedo()) {
      tps.doTransaction();
    }
  }

  const handleSettingChange = (event, setting) => {
    // Capture the current settings
    const oldSettings = [...settingsValues];

    // Create new settings based on the change
    const newSettings = [...settingsValues];
    switch (setting) {
      case 0:
        newSettings[0] = event.target.value;
        break;
      case 1:
        newSettings[1] = event.target.value;
        break;
      case 2:
        newSettings[2] = event.target.value;
        break;
      default:
      // Do nothing for other cases
    }

    // Create a transaction and add it to the jsTPS
    const settingsChangeTransaction = new SettingsChangeTransaction(
      oldSettings,
      newSettings,
      setSettingsValues
    );
    tps.addTransaction(settingsChangeTransaction);
  }

  function KeyPress(event) {
    if (event.ctrlKey) {
      if (event.key === 'z') {
        handleUndo(event)
      }
      if (event.key === 'y') {
        handleRedo(event)
      }
      if (event.key === 's') {
        event.preventDefault();
        handleSave();
      }
    }
  }

  document.onkeydown = (event) => KeyPress(event);

  // THIS FUNCTION PREVENTS USERS FROM INPUTING CHARACTERS ASIDE FROM '-' AND '.' 
  // INTO ANY OF THE INPUTS
  const handleStepKeyDown = (event) => {
    const isNumericOrBackspace = /^\d$/.test(event.key) || event.key === '-' || event.key === '.' || event.key === 'Backspace' || event.key === 'Enter' || event.key === 'ArrowLeft' || event.key === 'ArrowReft' || event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Tab';

    // ALLOW DEFAULT BEHAVIOR OR CUT, COPY, PASTE, AND SELECT
    if (!(event.ctrlKey && ['x', 'X', 'c', 'C', 'v', 'V', 'a', 'A'].includes(event.key))) {
      if (!isNumericOrBackspace) {
        event.preventDefault();
      }
    }
  };

  async function handlePublish() {
    setPublishMapShow(true)
  }
  async function handlePublishClose() {
    setPublishMapShow(false)
  }

  // THESE FUNCTIONS HANDLE FILE LOADING
  const handleFileChange = (event) => {
    handleFileSelection(event.target.files);
  };

  const handleFileSelection = async (files) => {
    const file = files[0];
    var extension = file.name.split(".")[1];
    var reader = new FileReader();
    reader.onloadend = async (event) => {
      var text = event.target.result;

      if (extension === 'json') {
        var json = JSON.parse(text);
        var mapData = await store.getMapDataById(mapId)
        if (json.mapID) {
          mapData.GeoJson = json.GeoJson
          mapData.points = json.points
          mapData.settings = json.settings
          mapData.legend = json.legend
          mapData.legendTitle = json.legendTitle
          await store.updateMapDataById(mapId, mapData)
          await store.setCurrentList(mapId, 0)
          updateTable()
        }

        else if (json.type === 'FeatureCollection' || json.features) {
          mapData.GeoJson = json;
          await store.updateMapDataById(mapId, mapData);
          await store.setCurrentList(mapId, 0)
        }
      }

      else if (extension === 'kml') {
        var mapData = await store.getMapDataById(mapId)
        var tj = require('@mapbox/togeojson')
        var kml = new DOMParser().parseFromString(text, "text/xml"); // create xml dom object
        var json = tj.kml(kml); // convert xml dom to geojson
        rewind(json, false); // correct right hand rule
        mapData.GeoJson = json
        await store.updateMapDataById(mapId, mapData)
        await store.setCurrentList(mapId, 0)
      }

      else if (extension === "zip") {
        var zip = new JSZip();
        var shpArr = [];
        var dbfArr = [];
        var arr = []
        var shpArr0 = []
        var dbfArr0 = []
        var arr0 = []
        var count = 0
        var count1 = 0
        async function shpCombiner() {
          zip.loadAsync(text).then(function (zips) {
            Object.keys(zips.files).forEach(function (filename) {
              count++


            })
            count--;
            Object.keys(zips.files).forEach(function (filename) {
              zip.files[filename].async('string').then(function (fileData) {
                if (filename.split(".")[1] != "txt") {

                  zip.file(filename).async('blob').then(async (blob) => {
                    const buffer = await blob.arrayBuffer();
                    if (buffer && buffer.byteLength > 0) {
                      // Parse the shapefile here




                      try {
                        count1++;
                        if (filename.endsWith("adm1.shp")) {

                          shpArr = (shp.parseShp(buffer /*optional prj str*/));
                          if (arr.length == 1) {
                            arr = [shpArr, arr[0]]
                          }
                          else {
                            arr.push(shpArr)
                          }

                        }
                        else if (filename.endsWith("adm1.dbf")) {
                          dbfArr = (shp.parseDbf(buffer /*optional prj str*/));
                          arr.push(dbfArr)

                        }
                        if (filename.endsWith("adm0.shp")) {

                          shpArr0 = (shp.parseShp(buffer /*optional prj str*/));
                          if (arr0.length == 1) {
                            arr0 = [shpArr0, arr0[0]]
                          }
                          else {
                            arr0.push(shpArr0)
                          }

                        }
                        else if (filename.endsWith("adm0.dbf")) {
                          dbfArr0 = (shp.parseDbf(buffer /*optional prj str*/));
                          arr0.push(dbfArr0)

                        }
                        // if(arr.length == 2) {
                        //   let combined = await shp.combine(arr)

                        //   var mapData = await store.getMapDataById(mapId)
                        //   mapData.GeoJson = combined
                        //   await store.updateMapDataById(mapId, mapData)
                        //   await store.setCurrentList(mapId, 0)
                        // }

                        if (count == count1) {
                          if (arr.length == 2) {
                            let combined = await shp.combine(arr)

                            var mapData = await store.getMapDataById(mapId)
                            mapData.GeoJson = combined
                            await store.updateMapDataById(mapId, mapData)
                            await store.setCurrentList(mapId, 0)
                          }
                          else {
                            let combined = await shp.combine(arr0)

                            var mapData = await store.getMapDataById(mapId)
                            mapData.GeoJson = combined
                            await store.updateMapDataById(mapId, mapData)
                            await store.setCurrentList(mapId, 0)
                          }

                        }




                      } catch (error) {
                        console.error("Error parsing shapefile:", error);
                      }


                      if (filename.split(".").pop() == "dbf" || filename.split(".").pop() == "shp") {

                      }

                    } else {
                      console.error("Invalid or empty shapefile buffer");
                    }

                  });
                }

              })
            })
          })
        }
        await shpCombiner()
      }
    };
    if (extension === "zip" || extension === "shp") {
      reader.readAsArrayBuffer(file);
    }
    else {
      reader.readAsText(file);
    }

  }

  // THESE FUNCTIONS ARE FOR MANIPULATING THE DATA TABLE
  const handleAddRow = () => {
    var newTable = []
    for (let i = 0; i < tableData.length; i++) {
      newTable.push(tableData[i])
    }
    newTable.push({ id: newTable.length + 1, latitude: '', longitude: '', color: 'white' })
    setTableData(newTable)
  }

  const handleRemoveRow = () => {
    var newTable = []
    for (let i = 0; i < tableData.length; i++) {
      newTable.push(tableData[i])
    }
    setTableData(newTable)
  }

  const handleAddRowTransaction = () => { // 0 is update table, 1 is row stuff
    let transaction = new PointMapTransaction([handleEditChange, handleAddRow, handleRemoveRow], 1, 0, 0, 0, 0)
    tps.addTransaction(transaction)
  }

  const handleEditLegendChange = (event, rowIndex, colName) => {
    let transaction = new EditChangeLegendTransaction(legendTableData[rowIndex][colName], event.target.value, legendTableData, setLegendTableData, rowIndex, colName)
    tps.addTransaction(transaction)
  };

  const handleLegendTitleChange = (event) => {
    let transaction = new EditLegendTitleTransaction(legendTitle, event.target.value, setLegendTitle)
    tps.addTransaction(transaction)
  }

  // const handleHeaderDoubleClick = (index) => {
  //   setIsEditingHeader(index);
  // };

  const handleHeaderChange = (event, index) => {
    const updatedHeaders = [...tableHeaders];
    updatedHeaders[index] = event.target.value;
    setTableHeaders(updatedHeaders);
  };

  const handleHeaderBlur = () => {
    setIsEditingHeader(null);
  };

  const handleEditChange = (value, rowIndex, colName) => {
    const updatedData = tableData.map((row, index) => {
      if (index === rowIndex) {
        return { ...row, [colName]: value };
      }
      return row;
    });
    setTableData(updatedData);
  };

  const handleEditChangeTransaction = (event, rowIndex, colName) => { // 0 is update table, 1 is row stuff
    let transaction = new PointMapTransaction([handleEditChange, handleAddRow, handleRemoveRow], 0, tableData[rowIndex][colName], event.target.value, rowIndex, colName)
    tps.addTransaction(transaction);
  }

  const handleEditBlur = () => {
    setIsEditing(null);
  };

  const handleSave = async () => {
    var mapData = await store.getMapDataById(mapId)

    var latitude = Math.min(90, Math.max(-90, parseFloat(settingsValues[0])));
    var longitude = Math.min(180, Math.max(-180, parseFloat(settingsValues[1])));
    var zoom = Math.min(22, Math.max(1, parseFloat(settingsValues[2])));
    setSettingsValues([latitude, longitude, zoom])

    mapData.settings.longitude = settingsValues[1]
    mapData.settings.latitude = settingsValues[0]
    mapData.settings.zoom = settingsValues[2]
    mapData.legend = legendTableData
    mapData.legendTitle = legendTitle

    var cleanedTableData = cleanTableData();
    mapData.points = cleanTableData();
    setTableData(cleanedTableData);
    mapData.points = tableData;

    await store.updateMapDataById(mapId, mapData)
    await store.setCurrentList(mapId, 0)
  }

  const cleanTableData = () => {
    return tableData.map(item => ({
      ...item,
      latitude: /^-?\d+(.\d+)?$/.test(item.latitude) ? item.latitude : '',
      longitude: /^-?\d+(.\d+)?$/.test(item.longitude) ? item.longitude : '',
    }));
  };

  const updateTable = async () => {
    try {
      const points = await store.getMapDataById(mapId)
      var newPoints = []
      for (let i in points.points) {
        newPoints.push({
          'id': points.points[i]['id'],
          'latitude': points.points[i]['latitude'],
          'longitude': points.points[i]['longitude'],
          'color': points.points[i]['color']
        });
      }
      setTableData(newPoints);
      setSettingsValues([points.settings.latitude, points.settings.longitude, points.settings.zoom])

      if (points.legend.length !== 0) {
        var newLegend = [];
        for (let i in points.legend) {
          newLegend.push({
            'color': points.legend[i]['color'],
            'description': points.legend[i]['description']
          });
        }
        setLegendTableData(newLegend);
      }
      if (points.legendTitle) {
        setLegendTitle(points.legendTitle);
      }
    }
    catch {
      console.log('cannot load mapdata');
    }
  }

  const downloadJson = async () => {
    const data = await store.getMapDataById(mapId)
    const json = JSON.stringify(data);
    setJsonData(json);

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    downloadLinkRef.current.href = url;
    var string = store.currentList.name
    downloadLinkRef.current.download = string.concat('.json');
    downloadLinkRef.current.click();

    URL.revokeObjectURL(url);
  };

  const downloadPic = async (arg) => {
    const rewait = await store.setPrint(arg)
  }

  const handleRemoveGeoJson = async () => {
    var mapData = await store.getMapDataById(mapId)
    mapData.GeoJson = null

    await store.updateMapDataById(mapId, mapData)
    await store.setCurrentList(mapId, 0)
  }

  useEffect(() => {
    try {
      updateTable();
    }
    catch (error) {
      console.log('cannot update table');
    }
  }, []);

  const handleSetDefaults = () => {
    const oldSettings = [...settingsValues];

    const latitude = map.current.getCenter().lat.toFixed(4);
    const longitude = map.current.getCenter().lng.toFixed(4);
    const zoom = map.current.getZoom().toFixed(2);
    const newSettings = [latitude, longitude, zoom];

    const setDefaultsTransaction = new SetDefaultsTransaction(
      oldSettings,
      newSettings,
      setSettingsValues
    );
    tps.addTransaction(setDefaultsTransaction);
  }
  useEffect(() => {
    const regionSelectHandler = (event) => {
      event.preventDefault()
      const clickedRegion = event.features[0];
      var propertyName;

      if (clickedRegion) {

        let regionName;

        // THIS FINDS THE PROPERTY NAME FOR THE LOWEST ADMINISTRATIVE LEVEL
        for (let i = 5; i >= 0; i--) {
          propertyName = `NAME_${i}`;
          if (clickedRegion.properties.hasOwnProperty(propertyName)) {
            regionName = clickedRegion.properties[propertyName];
            break;
          }
          else if (clickedRegion.properties.hasOwnProperty('NAME')) {
            regionName = clickedRegion.properties['NAME'];
          }
          else {
            regionName = ''
          }
        }

        // IF THIS REGION ISN'T IN THE TABLE, ADD IT SO USERS CAN EDIT IT, OTHERWISE JUMP TO IT ON THE TABLE
        setSelectedRegion(regionName);
        setShowRegion(true)

      }
    };

    // WHEN A REGION IS CLICKED ON, RUN regionSelectHandler
    map.current.on('dblclick', 'geojson-border-fill', regionSelectHandler);

    //CLEAN UP
    return () => {
      map.current.off('click', 'geojson-border-fill', regionSelectHandler);
    };
  }, [prevSelectedRegions]);

  return (
    <div>
      <div className={`d-flex flex-row`} id="point-map-edit-left-wrapper">
        <div className="edit-left-bar">
          <Col id="edit-left-tool">
            <Row>
              <Button className="edit-button" variant="dark" onClick={toggleSideBar}>
                <ViewStacked />
              </Button>
            </Row>

            <Row>
              <Button className="edit-button" variant="dark" onClick={handleSave}>
                <Save></Save>
              </Button>
            </Row>

            <Row>
              <Button className="edit-button" variant="dark" onClick={handleUndo} disabled={!tps.hasTransactionToUndo()}>
                <ArrowCounterclockwise />
              </Button>
            </Row>

            <Row>
              <Button className="edit-button" variant="dark" onClick={handleRedo} disabled={!tps.hasTransactionToRedo()}>
                <ArrowClockwise />
              </Button>
            </Row>

            <Row>
              <Button className="edit-button" variant="dark" onClick={() => setShowName(true)} aria-label="change map name">
                <PencilSquare />
              </Button>
            </Row>

            <Row>
              <Button className="edit-button" variant="dark" onClick={handlePublish}>
                <FileEarmarkArrowUp />
              </Button>
            </Row>

            <Row>
              <Button className="edit-button" id="edit-close-button" variant="dark" onClick={() => setShow(true)}>
                <XLg />
              </Button>
            </Row>
          </Col>
        </div>
        <div className={`bg-light border-right ${isToggled ? 'invisible' : 'visible'}`} id="point-map-edit-left-sidebar-wrapper">
          <div className="list-group list-group-flush point-map-edit-tools-list">
            <div className="row">
              <Accordion defaultActiveKey={['0']} className='point-map-accordian'>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Attach Data</Accordion.Header>
                  <Accordion.Body
                    className="d-flex flex-column" >
                    <div className="drop-zone">
                      <div className="drop-zone-text">
                        Attach a .json, .kml, or .zip file.
                      </div>
                      <input type="file" id="my_file_input" accept=".json,.kml,.zip" onChange={handleFileChange} />
                      {/* {!isValidFile && (<div className="text-danger mt-2">Invalid file type. Please select a json, kml, or shp file.</div>)} */}
                      {/* {selectedFile && isValidFile && (<span>{selectedFile.name}</span>)} */}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">

                  <Accordion.Header>Point Map Data</Accordion.Header>
                  <Accordion.Body>
                    <div className="table-responsive table-custom-scrollbar">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            {tableHeaders.map((header, index) => (
                              <th
                                className={'point-map-edit-header-' + header}
                                key={index + 1}
                                onBlur={handleHeaderBlur}
                              >
                                {isEditingHeader === index + 1 ? (
                                  <input
                                    type="text"
                                    value={header ?? ''}
                                    onChange={(event) => handleHeaderChange(event, index + 1)}
                                    maxlength="12"
                                  />
                                ) : (
                                  header
                                )}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {tableData.map((row, rowIndex) => (
                            <tr key={row.id}>
                              {Object.keys(row).map((colName, colIndex) => (
                                <td
                                  key={colIndex}
                                >
                                  {
                                    colIndex !== 0 && colIndex !== 3 ? (
                                      <input className='cells'
                                        type="text"
                                        value={row[colName]}
                                        onChange={(event) => handleEditChangeTransaction(event, rowIndex, colName)}
                                        onBlur={handleEditBlur}
                                        onKeyDown={handleStepKeyDown}
                                        maxlength="12"
                                      />
                                    ) : colIndex !== 3 ? (
                                      row[colName]
                                    ) : <select name="variables" value={row[colName]} onChange={(event) => handleEditChangeTransaction(event, rowIndex, colName)}>
                                      <option> {row[colName]} </option>
                                      <option value={'white'} >white</option>
                                      <option value={'black'} >black</option>
                                      <option value={'red'} >red</option>
                                      <option value={'orange'} >orange</option>
                                      <option value={'yellow'} >yellow</option>
                                      <option value={'green'} >green</option>
                                      <option value={'blue'} >blue</option>
                                      <option value={'purple'} >purple</option>
                                    </select>
                                  }
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <Button className='add-row-button btn btn-light' onClick={handleAddRowTransaction}>
                        <PlusCircleFill className='add-row-icon' />
                      </Button>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">

                  <Accordion.Header>Point Map Settings</Accordion.Header>
                  <Accordion.Body>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="">Default Center</span>
                      </div>
                      <input type="text" className="form-control" placeholder='Latitude' maxlength="12" value={settingsValues[0]} onChange={(event) => handleSettingChange(event, 0)} onKeyDown={handleStepKeyDown} />
                      <input type="text" className="form-control" placeholder='Longitude' maxlength="12" value={settingsValues[1]} onChange={(event) => handleSettingChange(event, 1)} onKeyDown={handleStepKeyDown} />
                    </div>

                    <div className="input-group setting-zoom">
                      <div className="input-group-prepend">
                        <span className="input-group-text default-zoom" id="">Default Zoom</span>
                      </div>
                      <input type="text" className="form-control" placeholder='Zoom' maxlength="12" value={settingsValues[2]} onChange={(event) => handleSettingChange(event, 2)} onKeyDown={handleStepKeyDown} />
                    </div>

                    <Button className="set-default-button" variant="btn btn-dark" onClick={handleSetDefaults} >
                      Set Defaults Here
                    </Button>

                    <div>
                      <Button className="remove-geojson-button" variant="btn btn-dark" onClick={() => setShowGeoModal(true)}>
                        Remove GeoJson Data
                      </Button>
                    </div>

                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">

                  <Accordion.Header>Edit Legend</Accordion.Header>
                  <Accordion.Body>
                    <div className='legend-title'>
                      <div className="input-group setting-zoom">
                        <div className="input-group-prepend">
                          <span className="input-group-text default-zoom" id="">Legend Title</span>
                        </div>
                        <input maxlength="40" type="text" className="form-control" value={legendTitle} onChange={(event) => handleLegendTitleChange(event)} />
                      </div>
                    </div>

                    <div className="table-responsive table-custom-scrollbar">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            {legendHeaders.map((header, index) => (
                              <th
                                key={index + 1}
                              >
                                {
                                  header
                                }
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {legendTableData.map((row, rowIndex) => (
                            <tr key={row.id}>
                              {Object.keys(row).map((colName, colIndex) => (
                                <td
                                  key={colIndex}
                                >
                                  {
                                    colIndex !== 0 ? (
                                      <input className='cells'
                                        type="text"
                                        value={row[colName]}
                                        onChange={(event) => handleEditLegendChange(event, rowIndex, colName)}
                                        onBlur={handleEditBlur}
                                        maxlength="40"
                                      />
                                    ) : row[colName]
                                  }
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="4">
                  <Accordion.Header>Download</Accordion.Header>
                  <Accordion.Body>
                    <div>
                      <div className='JSONButton'>
                        <Button variant="btn btn-dark" onClick={() => { downloadJson(); }}>
                          Download JSON
                        </Button>
                        <a href="#" ref={downloadLinkRef} style={{ display: 'none' }} />
                      </div>
                      <div className='PNGButton'>
                        <Button variant="btn btn-dark" onClick={() => { downloadPic(1); }}>
                          Download PNG
                        </Button>
                      </div>
                      <div className='JPGButton'>
                        <Button variant="btn btn-dark" onClick={() => { downloadPic(2); }}>
                          Download JPG
                        </Button>
                      </div>
                    </div>

                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
      <PublishMapModal publishMapShow={publishMapShow} handlePublishMapClose={handlePublishClose} />
      <SaveAndExitModal saveAndExitShow={show} handlesaveAndExitShowClose={(event) => { setShow(false) }} save={handleSave} />
      <RemoveGeoJsonModal removeGeoShow={showGeoModal} handleRemoveGeoShowClose={(event) => { setShowGeoModal(false) }} removeGeo={handleRemoveGeoJson} />
      <MapNameModal mapNameShow={showName} handleMapNameClose={(event) => { setShowName(false) }} mapId={mapId} />
      <EditRegionModal editRegionShow={showRegion} handleEditRegionClose={(event) => { setShowRegion(false) }} mapId={mapId} region={selectedRegion} tps={tps}>   </EditRegionModal>
    </div>
  )
}