import React, { useState, useRef, useContext, useEffect } from 'react';
import { Button, Table, Accordion, Row, Col } from 'react-bootstrap';
import { GlobalStoreContext } from '../../store';
import { XLg, PlusCircleFill, ViewStacked, Save, ArrowClockwise, ArrowCounterclockwise, PencilSquare } from 'react-bootstrap-icons';
import SaveAndExitModal from '../SaveAndExitModal/SaveAndExitModal';
import './LineEditBar.scss';
import rewind from "@mapbox/geojson-rewind";
import RemoveGeoJsonModal from '../RemoveGeoJsonModal/RemoveGeoJsonModal';
import PointMapTransaction from '../../transactions/Point/PointMapTransaction';
import jsTPS from '../../common/jsTPS';
import SettingsChangeTransaction from '../../transactions/SettingsChangeTransaction';
import SetDefaultsTransaction from '../../transactions/SetDefaultsTransaction';
import MapNameModal from '../MapNameModal/MapNameModal';


export default function LineEditSideBar(props) {
  const { mapId, points, settings, map } = props;
  const { store } = useContext(GlobalStoreContext);

  // State variables
  const [isToggled, setIsToggled] = useState(false);
  const [show, setShow] = useState(false);
  const [showGeoModal, setShowGeoModal] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [isEditingHeader, setIsEditingHeader] = useState(null);
  const [tableData, setTableData] = useState(points);
  const [tableHeaders, setTableHeaders] = useState(['ID', 'Start Latitude', 'Start Longitude', 'End Latitude', 'End Longitude', 'Color']);
  const [legendTableData, setLegendTableData] = useState(
    [
  {'Color': 'White' , 'Description' : '' },
  {'Color': 'Black' , 'Description' : '' },
  {'Color': 'Red' , 'Description' : '' },
  {'Color': 'Orange' , 'Description' : '' },
  {'Color': 'Yellow' , 'Description' : '' },
  {'Color': 'Green' , 'Description' : '' },
  {'Color': 'Blue' , 'Description' : '' },
  {'Color': 'Purple' , 'Description' : '' },
]);
  const [legendHeaders, setLegendHeaders] = useState(['Color', 'Description']);
  const [legendTitle, setLegendTitle] = useState('');
  const [jsonData, setJsonData] = useState('');
  const downloadLinkRef = useRef(null);
  const [settingsValues, setSettingsValues] = useState([40.9257, -73.1409, 15]);
  const [tps, setTPS] = useState(new jsTPS)
  const [showName, setShowName] = useState(false);

  function toggleSideBar(event) {
    event.preventDefault();
    setIsToggled(!isToggled);
  }

  function handleUndo(event) {
    event.preventDefault();
    // store.undo();

    if (tps.hasTransactionToUndo()) {
      console.log('undo attempted')
      tps.undoTransaction();
    }
    else {
      console.log('no action to undo')
    }
  }

  function handleRedo(event) {
    event.preventDefault();
    // store.redo();
    if (tps.hasTransactionToRedo()) {
      console.log('redo attempted')
      tps.doTransaction();
    }
    else {
      console.log('no action to redo')
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
    const isNumericOrBackspace = /^\d$/.test(event.key) || event.key === '-' || event.key === '.' || event.key === 'Backspace' || event.key === 'Enter';

    if (!isNumericOrBackspace) {
      event.preventDefault();
    }
  };


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
          mapData.lineData = json.lineData
          mapData.settings = json.settings
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

      // var json = JSON.parse(text);
      // mapData.GeoJson = json;
      // await store.updateMapDataById(mapId, mapData);
      // await store.setCurrentList(mapId, 0)
    };
    reader.readAsText(file);
  }

  // THESE FUNCTIONS ARE FOR MANIPULATING THE DATA TABLE
  const handleAddRow = () => {
    var newTable = []
    for (let i = 0; i < tableData.length; i++) {
      newTable.push(tableData[i])
    }
    newTable.push({ id: newTable.length + 1, startlatitude: '', startlongitude: '', endlatitude: '', endlongitude: '', color: '' })
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
    tps.addTransaction(transaction)
  }

  const handleEditLegendChange = (event, rowIndex, colName) => {
    const updatedData = legendTableData.map((row, index) => {
      if (index === rowIndex) {
        return { ...row, [colName]: event.target.value };
      }
      return row;
    });
    setLegendTableData(updatedData);
  };

  const handleLegnedTitleChange = (event) => {
    setLegendTitle(event.target.value)
  }

  const handleEditBlur = () => {
    setIsEditing(null);
  };

  const handleSave = async () => {
    var mapData = await store.getMapDataById(mapId)
    mapData.lineData = tableData;

    var latitude = Math.min(90, Math.max(-90, parseFloat(settingsValues[0])));
    var longitude = Math.min(180, Math.max(-180, parseFloat(settingsValues[1])));
    var zoom = Math.min(22, Math.max(1, parseFloat(settingsValues[2])));
    setSettingsValues([latitude, longitude, zoom])

    mapData.settings.longitude = settingsValues[1]
    mapData.settings.latitude = settingsValues[0]
    mapData.settings.zoom = settingsValues[2]
    mapData.legend3 = legendTableData
    mapData.legend3Title = legendTitle

    await store.updateMapDataById(mapId, mapData)
    await store.setCurrentList(mapId, 0)
  }

  const updateTable = async () => {
    try {
      const points = await store.getMapDataById(mapId)
      var newPoints = []
      for (let i in points.lineData) {
        newPoints.push({
          'id': points.lineData[i]['id'],
          'startlatitude': points.lineData[i]['startlatitude'],
          'startlongitude': points.lineData[i]['startlongitude'],
          'endlatitude': points.lineData[i]['endlatitude'],
          'endlongitude': points.lineData[i]['endlongitude'],
          'color': points.lineData[i]['color']
        });
      }
      setTableData(newPoints);
      setSettingsValues([points.settings.latitude, points.settings.longitude, points.settings.zoom])
      if (points.legend3.length !=0){
        var newLegend = []
        for (let i in points.legend3) {
          newLegend.push({
            'Color': points.legend3[i]['Color'],
            'Description': points.legend3[i]['Description']
          });
        }
          setLegendTableData(newLegend)
      }
      setLegendTitle(points.legend3Title)
      
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


  return (
    <div>
      <div className={`d-flex flex-row`} id="line-map-sidebar">
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
              <Button className="edit-button" variant="dark" onClick={handleUndo}>
                <ArrowCounterclockwise />
              </Button>
            </Row>

            <Row>
              <Button className="edit-button" variant="dark" onClick={handleRedo}>
                <ArrowClockwise />
              </Button>
            </Row>

            <Row>
              <Button className="edit-button" variant="dark" onClick={() => setShowName(true)} aria-label="change map name">
                <PencilSquare />
              </Button>
            </Row>

            <Row>
              <Button className="edit-button" id="edit-close-button" variant="dark" onClick={() => setShow(true)}>
                <XLg />
              </Button>
            </Row>
          </Col>

        </div>
        <div className={`bg-light border-right ${isToggled ? 'invisible' : 'visible'}`} id="line-map-menu">
          <div className="list-group list-group-flush edit-tools-list">
            <div className="row">
              <Accordion defaultActiveKey={['0']} className='line-map-accordian'>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Attach Data</Accordion.Header>
                  <Accordion.Body
                    className="d-flex flex-column" >
                    <div className="drop-zone">
                      <div className="drop-zone-text">
                        Attach a .json, .kml, or .shp file.
                      </div>
                      <input type="file" id="my_file_input" accept=".json,.kml,.shp" onChange={handleFileChange} />
                      {/* {!isValidFile && (<div className="text-danger mt-2">Invalid file type. Please select a json, kml, or shp file.</div>)} */}
                      {/* {selectedFile && isValidFile && (<span>{selectedFile.name}</span>)} */}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">

                  <Accordion.Header>Line Map Data</Accordion.Header>
                  <Accordion.Body>
                    <div className="table-responsive table-custom-scrollbar">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            {tableHeaders.map((header, index) => (
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
                          {tableData.map((row, rowIndex) => (
                            <tr key={row.id}>
                              {Object.keys(row).map((colName, colIndex) => (
                                <td
                                  key={colIndex}
                                >
                                  {
                                    colIndex !== 0 && colIndex !== 5 ? (
                                      <input className='cells'
                                        type="text"
                                        value={row[colName]}
                                        onChange={(event) => handleEditChangeTransaction(event, rowIndex, colName)}
                                        onBlur={handleEditBlur}
                                        onKeyDown={handleStepKeyDown}
                                      />
                                    ) : colIndex !== 5 ? (
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

                  <Accordion.Header>Line Map Settings</Accordion.Header>
                  <Accordion.Body>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="">Default Center</span>
                      </div>
                      <input type="text" className="form-control" placeholder='Latitude' value={settingsValues[0]} onChange={(event) => handleSettingChange(event, 0)} onKeyDown={handleStepKeyDown} />
                      <input type="text" className="form-control" placeholder='Longitude' value={settingsValues[1]} onChange={(event) => handleSettingChange(event, 1)} onKeyDown={handleStepKeyDown} />
                    </div>

                    <div className="input-group setting-zoom">
                      <div className="input-group-prepend">
                        <span className="input-group-text default-zoom" id="">Default Zoom</span>
                      </div>
                      <input type="text" className="form-control" placeholder='Zoom' value={settingsValues[2]} onChange={(event) => handleSettingChange(event, 2)} onKeyDown={handleStepKeyDown} />
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
                        <input type="text" className="form-control" value={legendTitle} onChange={(event) => handleLegnedTitleChange(event)} />
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
                                    colIndex !== 0  ? (
                                      <input className='cells'
                                        type="text"
                                        value={row[colName]}
                                        onChange={(event) => handleEditLegendChange(event, rowIndex, colName)}
                                        onBlur={handleEditBlur}
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
      <SaveAndExitModal saveAndExitShow={show} handlesaveAndExitShowClose={(event) => { setShow(false) }} save={handleSave} />
      <RemoveGeoJsonModal removeGeoShow={showGeoModal} handleRemoveGeoShowClose={(event) => { setShowGeoModal(false) }} removeGeo={handleRemoveGeoJson} />
      <MapNameModal mapNameShow={showName} handleMapNameClose={(event) => { setShowName(false) }} mapId={mapId} />
    </div>
  )
}