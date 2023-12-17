import React, { useState, useRef, useContext, useEffect } from 'react';
import { Button, Table, Accordion, Row, Col } from 'react-bootstrap';
import { GlobalStoreContext } from '../../store';
import { XLg, PlusCircleFill, ViewStacked, Save, ArrowClockwise, ArrowCounterclockwise } from 'react-bootstrap-icons';
import SaveAndExitModal from '../SaveAndExitModal/SaveAndExitModal';
import './LineEditBar.scss';

export default function LineEditSideBar(props) {
  const { mapId, points, settings, map } = props;
  const { store } = useContext(GlobalStoreContext);

  // State variables
  const [isToggled, setIsToggled] = useState(false);
  const [show, setShow] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [isEditingHeader, setIsEditingHeader] = useState(null);
  const [tableData, setTableData] = useState(points);
  const [tableHeaders, setTableHeaders] = useState(['ID', 'Latitude', 'Longitude']);
  const [jsonData, setJsonData] = useState('');
  const downloadLinkRef = useRef(null);
  const [settingsValues, setSettingsValues] = useState([40.9257, -73.1409, 15]);

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
    var reader = new FileReader();
    let mapData = await store.getMapDataById(mapId);

    reader.onloadend = async (event) => {
      var text = event.target.result;

      try {
        var json = JSON.parse(text);
        console.log('Original file size:', text.length, 'bytes');
        mapData.GeoJson = json;
        await store.updateMapDataById(mapId, mapData);
        await store.setCurrentList(mapId, 0)
      } catch (error) {
        console.error('Error handling file selection:', error);
      }
    };
    reader.readAsText(file);
  }

  // THESE FUNCTIONS ARE FOR MANIPULATING THE DATA TABLE
  const handleAddRow = () => {
    var newTable = []
    for (let i = 0; i < tableData.length; i++) {
      newTable.push(tableData[i])
    }
    newTable.push({ id: newTable.length + 1, latitude: '', longitude: '' })
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
    var mapData = await store.getMapDataById(mapId)
    mapData.points = tableData;

    var latitude = Math.min(90, Math.max(-90, parseFloat(settingsValues[0])));
    var longitude = Math.min(180, Math.max(-180, parseFloat(settingsValues[1])));
    var zoom = Math.min(22, Math.max(1, parseFloat(settingsValues[2])));
    setSettingsValues([latitude, longitude, zoom])

    mapData.settings.longitude = settingsValues[1]
    mapData.settings.latitude = settingsValues[0]
    mapData.settings.zoom = settingsValues[2]

    await store.updateMapDataById(mapId, mapData)
    await store.setCurrentList(mapId, 0)
  }

  const updateTable = async () => {
    try {
      const points = await store.getMapDataById(mapId)
      var newPoints = []
      for (let i in points.points) {
        newPoints.push({
          'id': points.points[i]['id'],
          'latitude': points.points[i]['latitude'],
          'longitude': points.points[i]['longitude']
        });
      }
      setTableData(newPoints);
      setSettingsValues([points.settings.latitude, points.settings.longitude, points.settings.zoom])
    }
    catch {
      console.log('cannot load mapdata');
    }
  }

  const downloadJson = () => {
    const json = JSON.stringify({ headers: tableHeaders, data: tableData });
    setJsonData(json);

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    downloadLinkRef.current.href = url;
    downloadLinkRef.current.download = 'table_data.json';
    downloadLinkRef.current.click();

    URL.revokeObjectURL(url);
  };

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
              <Button className="edit-button" id="edit-close-button" variant="dark" onClick={() => setShow(true)}>
                <XLg />
              </Button>
            </Row>
          </Col>

        </div>
        <div className={`bg-light border-right ${isToggled ? 'invisible' : 'visible'}`} id="line-map-menu">
          <div className="list-group list-group-flush edit-tools-list">
            <div className="row">
              <Accordion defaultActiveKey={['0']} alwaysOpen className='line-map-accordian'>
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
                                    ) : <></>}
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

                    <div className='JSONButton'>
                      <Button variant="btn btn-dark" onClick={() => { downloadJson(); }}>
                        Download JSON
                      </Button>
                      <a href="#" ref={downloadLinkRef} style={{ display: 'none' }} />
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
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
      <SaveAndExitModal saveAndExitShow={show} handlesaveAndExitShowClose={(event) => { setShow(false) }} />
    </div>
  )
}