import React, { useState, useRef, useContext, useEffect } from 'react';
import { Button, Table, Accordion, Row, Col, Dropdown } from 'react-bootstrap';
import { GlobalStoreContext } from '../../store';
import { XLg, PlusCircleFill, ViewStacked, Save, ArrowClockwise, ArrowCounterclockwise } from 'react-bootstrap-icons';
import SaveAndExitModal from '../SaveAndExitModal/SaveAndExitModal';
import './PropSymbEditBar.scss'
import rewind from "@mapbox/geojson-rewind";
import RemoveGeoJsonModal from '../RemoveGeoJsonModal/RemoveGeoJsonModal';

export default function PropSymbEditBar(props) {
  const { mapId, points, settings, map } = props;
  const { store } = useContext(GlobalStoreContext);

  // State variables
  const [isToggled, setIsToggled] = useState(false);
  const [show, setShow] = useState(false);
  const [showGeoModal, setShowGeoModal] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [isEditingHeader, setIsEditingHeader] = useState(null);
  const [tableData, setTableData] = useState(points);
  const [tableHeaders, setTableHeaders] = useState(['ID', 'Latitude', 'Longitude', 'Color', 'Size']);
  const [jsonData, setJsonData] = useState('');
  const downloadLinkRef = useRef(null);
  const [settingsValues, setSettingsValues] = useState([41.8473, 12.7971, 5.43])

  function toggleSideBar(event) {
    event.preventDefault();
    setIsToggled(!isToggled);
  }

  function handleUndo(event) {
    event.preventDefault();
    store.undo();
  }

  function handleRedo(event) {
    event.preventDefault();
    store.redo();
  }

  const handleSettingChange = (event, setting) => {
    var newSettings = ['', '', '']
    newSettings[0] = settingsValues[0]
    newSettings[1] = settingsValues[1]
    newSettings[2] = settingsValues[2]
    switch (setting) {
      case 0:
        newSettings[0] = event.target.value
        break;
      case 1:
        newSettings[1] = event.target.value
        break;
      case 2:
        newSettings[2] = event.target.value
        break;
      default:
        newSettings = settingsValues;
    }
    setSettingsValues(newSettings)
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

      if (extension === 'json'){
        var json = JSON.parse(text);
        var mapData = await store.getMapDataById(mapId)
        if (json.mapID){
          mapData.GeoJson = json.GeoJson
          mapData.propPoints = json.propPoints
          mapData.settings = json.settings
          await store.updateMapDataById(mapId, mapData)
          await store.setCurrentList(mapId, 0)
          updateTable()
        }

        else if (json.type === 'FeatureCollection' || json.features){
          mapData.GeoJson = json;
          await store.updateMapDataById(mapId, mapData);
          await store.setCurrentList(mapId, 0)
        }
      }

      else if (extension === 'kml'){
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
    newTable.push({ id: newTable.length + 1, latitude: '', longitude: '', color: '', size: '' })
    setTableData(newTable)
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


  const handleEditChange = (event, rowIndex, colName) => {
    const updatedData = tableData.map((row, index) => {
      if (index === rowIndex) {
        return { ...row, [colName]: event.target.value };
      }
      return row;
    });
    setTableData(updatedData);
  };

  const handleEditBlur = () => {
    setIsEditing(null);
  };

  const handleSave = async () => {
    var mapData = await store.getMapDataById(mapId);
    mapData.propPoints = tableData;

    var latitude = Math.min(90, Math.max(-90, parseFloat(settingsValues[0])));
    var longitude = Math.min(180, Math.max(-180, parseFloat(settingsValues[1])));
    var zoom = Math.min(22, Math.max(1, parseFloat(settingsValues[2])));
    setSettingsValues([latitude, longitude, zoom]);

    mapData.settings.longitude = settingsValues[1];
    mapData.settings.latitude = settingsValues[0];
    mapData.settings.zoom = settingsValues[2];

    await store.updateMapDataById(mapId, mapData);
    await store.setCurrentList(mapId, 0);
  }

  const updateTable = async () => {
    try {
      const points = await store.getMapDataById(mapId)
      var newPoints = []
      for (let i in points.propPoints) {
        newPoints.push({
          'id': points.propPoints[i]['id'],
          'latitude': points.propPoints[i]['latitude'],
          'longitude': points.propPoints[i]['longitude'],
          'color': points.propPoints[i]['color'],
          'size': points.propPoints[i]['size']
        });
      }
      setTableData(newPoints);
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
    var latitude = map.current.getCenter().lat.toFixed(4);
    var longitude = map.current.getCenter().lng.toFixed(4);
    var zoom = map.current.getZoom().toFixed(2);
    setSettingsValues([latitude, longitude, zoom]);
  }

  return (
    <div>
      <div className={`d-flex flex-row`} id="prop-map-sidebar">
        <div className="edit-left-bar">
          <Col id="edit-left-tool">
            <Row>
              <Button className="edit-button" variant="dark" onClick={toggleSideBar}>
                <ViewStacked />
              </Button>
            </Row>

            <Row>
              <Button className="edit-button" variant="dark" onClick={handleSave}>
                <Save />
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
              <Button className="edit-button" id="edit-close-button" variant="dark" onClick={() => setShow(true)}>
                <XLg />
              </Button>
            </Row>
          </Col>

        </div>
        <div className={`bg-light border-right ${isToggled ? 'invisible' : 'visible'}`} id="prop-map-menu">
          <div className="list-group list-group-flush edit-tools-list">
            <div className="row">
              <Accordion defaultActiveKey={['0']} className='prop-map-accordian'>
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

                  <Accordion.Header>Propotional Symbol Map Data</Accordion.Header>
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
                                        onChange={(event) => handleEditChange(event, rowIndex, colName)}
                                        onBlur={handleEditBlur}
                                      />
                                    ) : colIndex !== 3 ? (
                                      row[colName]
                                    ) : <select name="variables" onChange={(event) => handleEditChange(event, rowIndex, colName)}>
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
                      <Button className='add-row-button btn btn-light' onClick={handleAddRow}>
                        <PlusCircleFill className='add-row-icon' />
                      </Button>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">

                  <Accordion.Header>Propotional Symbol Map Settings</Accordion.Header>
                  <Accordion.Body>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="">Default Center</span>
                      </div>
                      <input type="text" className="form-control" placeholder='Latitude' value={settingsValues[0]} onChange={(event) => handleSettingChange(event, 0)} />
                      <input type="text" className="form-control" placeholder='Longitude' value={settingsValues[1]} onChange={(event) => handleSettingChange(event, 1)} />
                    </div>

                    <div className="input-group setting-zoom">
                      <div className="input-group-prepend">
                        <span className="input-group-text default-zoom" id="">Default Zoom</span>
                      </div>
                      <input type="text" className="form-control" placeholder='Zoom' value={settingsValues[2]} onChange={(event) => handleSettingChange(event, 2)} />
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
      <SaveAndExitModal saveAndExitShow={show} handlesaveAndExitShowClose={(event) => { setShow(false) }} save={handleSave}/>
      <RemoveGeoJsonModal removeGeoShow={showGeoModal} handleRemoveGeoShowClose={(event) => { setShowGeoModal(false) }} removeGeo={handleRemoveGeoJson}/>
    </div>
  )
}