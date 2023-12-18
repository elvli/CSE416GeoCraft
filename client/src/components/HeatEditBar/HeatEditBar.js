import React, { useState, useRef, useContext, useEffect } from 'react'
import { Button, Table, AccordionHeader, Row, Col, Dropdown, Form } from 'react-bootstrap';
import './HeatEditBar.scss'
import Accordion from 'react-bootstrap/Accordion';
import { GlobalStoreContext } from '../../store'
import { XLg, PlusCircleFill, ViewStacked, Save, ArrowClockwise, ArrowCounterclockwise, PencilSquare } from 'react-bootstrap-icons';
import SaveAndExitModal from '../SaveAndExitModal/SaveAndExitModal'
import { HexColorPicker } from "react-colorful";
// import HeatPointModal from '../HeatPointModal/HeatPointModal';
import MapNameModal from '../MapNameModal/MapNameModal';
import RangeSelector from './RangeSelector';
import RangeSelectorOpacity from './RangeSelectorOpacity';
export default function HeatEditBar(props) {
  const { mapId, points, settings, map } = props;
  const { store } = useContext(GlobalStoreContext);
  const [isToggled, setIsToggled] = useState(false);
  const [show, setShow] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showHeat, setShowHeat] = useState(false)
  const [isEditing, setIsEditing] = useState(null);
  const [isEditingHeader, setIsEditingHeader] = useState(null)
  const [tableData, setTableData] = useState([{ id: 1, longitude: 0, latitude: 0, magnitide: 0 }]);
  const [tableHeaders, setTableHeaders] = useState([
    'ID', 'Latitude', 'Longitude', 'Magnitude'
  ]);
  const [settingsValues, setSettingsValues] = useState([40.9257, -73.1409, 15]);
  const colors = store.getMapDataById(mapId)
  const [rangeMag1, setRangeMag1] = useState(0);
  const [rangeMag2, setRangeMag2] = useState(0);
  const [rangeMag3, setRangeMag3] = useState(6);
  const [rangeMag4, setRangeMag4] = useState(1);
  const [rangeIntensity1, setRangeIntensity1] = useState(0);
  const [rangeIntensity2, setRangeIntensity2] = useState(1);
  const [rangeIntensity3, setRangeIntensity3] = useState(9);
  const [rangeIntensity4, setRangeIntensity4] = useState(3);
  const [rangeRadius1, setRangeRadius1] = useState(0);
  const [rangeRadius2, setRangeRadius2] = useState(2);
  const [rangeRadius3, setRangeRadius3] = useState(9);
  const [rangeRadius4, setRangeRadius4] = useState(20);
  const [rangeOpacity1, setRangeOpacity1] = useState(7);
  const [rangeOpacity2, setRangeOpacity2] = useState(1);
  const [rangeOpacity3, setRangeOpacity3] = useState(9);
  const [rangeOpacity4, setRangeOpacity4] = useState(0);
  const [selectRangeMag, setSelectRangeMag] = useState(false);
  const [selectRangeIntensity, setSelectRangeIntensity] = useState(false);
  const [selectRangeRadius, setSelectRangeRadius] = useState(false);
  const [selectRangeOpacity, setSelectRangeOpacity] = useState(false);
  

  const [picker1, setPicker1] = useState(false);
  const [picker2, setPicker2] = useState(false);
  const [picker3, setPicker3] = useState(false);
  const [picker4, setPicker4] = useState(false);
  const [picker5, setPicker5] = useState(false);
  const [color1, setColor1] = useState("#67A9CF");
  const [color2, setColor2] = useState("#D1E5F0");
  const [color3, setColor3] = useState("#FDDBC7");
  const [color4, setColor4] = useState("#EF8A62");
  const [color5, setColor5] = useState("#B2182B");
  const [currentMag, setCurrentMag] = useState([
    'interpolate',
    ['linear'],
    ['get', 'mag'],
    0,//3
    0,//4
    6,//5
    1//6
    ],)
  const [currentInt, setCurrentInt] = useState([
    'interpolate',
    ['linear'],
    ['zoom'],
    0,//3
    1,//4
    9,//5
    3//6
    ])
  const [currentRad, setCurrentRad] = useState([
    'interpolate',
    ['linear'],
    ['zoom'],
    0,//3
    2,//4
    9,//5
    20//6
    ])
  const [currentOpac, setCurrentOpac] = useState( [
    'interpolate',
    ['linear'],
    ['zoom'],
    7,//3
    1,//4
    9,//5
    0//6
    ])
  const [currentColor, setCurrentColor] = useState([
    'interpolate',
    ['linear'],
    ['heatmap-density'],
    0,
    'rgba(33,102,172,0)',
    0.2,
    color1,//6
    0.4,
    color2,//8
    0.6,
    color3,//10
    0.8,
    color4,//12
    1,
    color5,//14
  ])
  const [heatMapData, setHeatMapData] = useState({
    "type": "FeatureCollection",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": []
  });
  const [jsonData, setJsonData] = useState('');
  const downloadLinkRef = useRef(null);

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
    newTable.push({ id: newTable.length + 1, latitude: '', longitude: '', magnitide: '' })
    // var data = heatMapData
    // data['features'].push({ "type": "Feature", "properties": { "mag": parseFloat(mag) }, "geometry": { "type": "Point", "coordinates": [ parseFloat(lat), parseFloat(long), 0 ] } })
    // setHeatMapData(data)
    // store.updateMapData({
    //   type: 'heat',
    //   import: true,
    //   data: data
    // })
    setTableData(newTable)
  }
  const handleAddRowFiles = (arr) => {
    var newTable = []
    for (let i = 0; i < tableData.length; i++) {
      newTable.push(tableData[i])
    }
    for (let i = 0; i < arr.length; i++) {
      newTable.push({ id: newTable.length + 1, latitude: arr[i]['geometry']['coordinates'][1], longitude: arr[i]['geometry']['coordinates'][0], magnitide: arr[i]['properties']['mag'] })
    }
    
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
    mapData.heatmap = {data: tableData, color: currentColor, mag: currentMag, int: currentInt, rad:currentRad, opac:currentOpac}

    var latitude = Math.min(90, Math.max(-90, parseFloat(settingsValues[0])));
    var longitude = Math.min(180, Math.max(-180, parseFloat(settingsValues[1])));
    var zoom = Math.min(22, Math.max(1, parseFloat(settingsValues[2])));
    setSettingsValues([latitude, longitude, zoom])

    mapData.settings.longitude = settingsValues[1];
    mapData.settings.latitude = settingsValues[0];
    mapData.settings.zoom = settingsValues[2];
   
    await store.updateMapDataById(mapId, mapData)
    await store.setCurrentList(mapId, 0)
  }

  const updateTable = async () => {
    try {
      const points = await store.getMapDataById(mapId)
      var newPoints = []
      for (let i = 0; i < points.heatmap.data.length; i++) {
        newPoints.push(points.heatmap.data[i]);
      }

      setCurrentColor(points.heatmap.color)
      setCurrentMag(points.heatmap.mag)
      setCurrentInt(points.heatmap.int)
      setCurrentRad(points.heatmap.rad)
      setCurrentOpac(points.heatmap.opac)
      setColor1(points.heatmap.color[6])
      setColor2(points.heatmap.color[8])
      setColor3(points.heatmap.color[10])
      setColor4(points.heatmap.color[12])
      setColor5(points.heatmap.color[14])
      setRangeMag1(points.heatmap.mag[3])
      setRangeMag2(points.heatmap.mag[4])
      setRangeMag3(points.heatmap.mag[5])
      setRangeMag4(points.heatmap.mag[6])
      setRangeIntensity1(points.heatmap.int[3])
      setRangeIntensity2(points.heatmap.int[4])
      setRangeIntensity3(points.heatmap.int[5])
      setRangeIntensity4(points.heatmap.int[6])
      setRangeRadius1(points.heatmap.rad[3])
      setRangeRadius2(points.heatmap.rad[4])
      setRangeRadius3(points.heatmap.rad[5])
      setRangeRadius4(points.heatmap.rad[6])
      setRangeOpacity1(points.heatmap.opac[3])
      setRangeOpacity2(points.heatmap.opac[4])
      setRangeOpacity3(points.heatmap.opac[5])
      setRangeOpacity4(points.heatmap.opac[6])

      
      setTableData(newPoints);
      
      setSettingsValues([map.settings.latitude, map.settings.longitude, map.settings.zoom])


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




  

  const handleHeatMap = async (event) => {
    event.preventDefault();
    var file = event.target.files[0]
    var reader = new FileReader();
    reader.onloadend = async (event) => {
      var text = event.target.result;
      try {
        var json = JSON.parse(text);
        var arr = json['features'].concat(heatMapData['features'])
        json['features'] = arr
        handleAddRowFiles(arr)
        // setHeatMapData(json)
        // store.updateMapData({
        //   type: 'heat',
        //   import: true,
        //   data: json
        // })
      } catch (error) {
        console.error('Error handling file selection:', error);
      }
    };
    reader.readAsText(file);
  }

  let fileUploader = <div className="drop-zone">
    <div className="drop-zone-text">
      <h6>There's no data at the moment</h6>
    </div>
    
  </div>



  const cover = {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  }
  const changeCurrentColor = () => {
    setCurrentColor([
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0,
      'rgba(33,102,172,0)',
      0.2,
      color1,
      0.4,
      color2,
      0.6,
      color3,
      0.8,
      color4,
      1,
      color5
    ])
  }
  const changeCurrentMag = () => {
    setCurrentMag([
      'interpolate',
      ['linear'],
      ['get', 'mag'],
      rangeMag1,
      rangeMag2,
      rangeMag3,
      rangeMag4
      ])
  }
  const changeCurrentInt = () => {
    setCurrentInt([
      'interpolate',
      ['linear'],
      ['zoom'],
      rangeIntensity1,
      rangeIntensity2,
      rangeIntensity3,
      rangeIntensity4
      ])
  }
  const changeCurrentRad = () => {
    setCurrentRad([
      'interpolate',
      ['linear'],
      ['zoom'],
      rangeRadius1,
      rangeRadius2,
      rangeRadius3,
      rangeRadius4
      ])
  }
  const changeCurrentOpac = () => {
    setCurrentOpac([
      'interpolate',
      ['linear'],
      ['zoom'],
      rangeOpacity1,
      rangeOpacity2,
      rangeOpacity3,
      rangeOpacity4
      ])
  }

  // const [selectRangeMag, setSelectRangeMag] = useState(false);
  // const [selectRangeIntensity, setSelectRangeIntensity] = useState(false);
  // const [selectRangeRadius, setSelectRangeRadius] = useState(false);
  // const [selectRangeOpacity, setSelectRangeOpacity] = useState(false);
  let options = <div className='container '>
    
    <Row className="justify-content-md-center">
      <p>Select a color</p>
      <Button className='heat-button' onClick={() => { setPicker1(!picker1); changeCurrentColor();}} style={{ backgroundColor: color1 }}/>
      <Button className='heat-button' onClick={() => { setPicker2(!picker2); changeCurrentColor() }} style={{ backgroundColor: color2 }}/>
      <Button className='heat-button' onClick={() => { setPicker3(!picker3); changeCurrentColor() }} style={{ backgroundColor: color3 }}/>
      <Button className='heat-button' onClick={() => { setPicker4(!picker4); changeCurrentColor() }} style={{ backgroundColor: color4 }}/>
      <Button className='heat-button' onClick={() => { setPicker5(!picker5); changeCurrentColor() }} style={{ backgroundColor: color5 }}/>
    </Row>
    {picker1 ? <div className='heat-popover'>
    <div style={cover} onClick={(event) => { setPicker1(false); changeCurrentColor()}} />
    <HexColorPicker color={color1} onChange={setColor1} />
    </div> : null}
    {picker2 ? <div className='heat-popover'>
      <div style={cover} onClick={(event) => { setPicker2(false); changeCurrentColor()}} />
      <HexColorPicker color={color2} onChange={setColor2} />
    </div> : null}
    {picker3 ? <div className='heat-popover'>
      <div style={cover} onClick={(event) => { setPicker3(false); changeCurrentColor()}} />
      <HexColorPicker color={color3} onChange={setColor3} />
    </div> : null}
    {picker4 ? <div className='heat-popover'>
      <div style={cover} onClick={(event) => { setPicker4(false); changeCurrentColor()}} />
      <HexColorPicker color={color4} onChange={setColor4} />
    </div> : null}
    {picker5 ? <div className='heat-popover'>
      <div style={cover} onClick={(event) => { setPicker5(false); changeCurrentColor()}} />
      <HexColorPicker color={color5} onChange={setColor5} />
    </div> : null}
    <br></br>
    <Row className="justify-content-md-center">
          <span className="input-group-text" id="">
            <Col>
              <div className='heat-range-button' ></div>
            </Col>
            <Col><h6>Zoom X</h6></Col>
            <Col><h6>X</h6></Col>
            <Col><h6>Zoom Y</h6></Col>
            <Col><h6>Y</h6></Col>
          </span>
    </Row>

    <Row className="justify-content-md-center">
          <span className="input-group-text" id="">
            <Col>
              <Button className='heat-range-button' variant="dark" onClick={() => { setSelectRangeMag(!selectRangeMag);  changeCurrentMag()}} >Weight</Button>
            </Col>
            <Col><h6>{rangeMag1}</h6></Col>
            <Col><h6>{rangeMag2}</h6></Col>
            <Col><h6>{rangeMag3}</h6></Col>
            <Col><h6>{rangeMag4}</h6></Col>
          </span>
    </Row>
    {selectRangeMag ? <div className='heat-popover'>
    <div style={cover} onClick={(event) => { setSelectRangeMag(false); changeCurrentMag()}} />
    <RangeSelector setValue1={e=>{setRangeMag1(parseInt(e))}} setValue2={e=>{setRangeMag2(parseInt(e))}} setValue3={e=>{setRangeMag3(parseInt(e))}} setValue4={e=>{setRangeMag4(parseInt(e))}}
              value1={rangeMag1} value2={rangeMag2} value3={rangeMag3} value4={rangeMag4} max={10}
            />
    </div> : null}

    <Row className="justify-content-md-center">
   
          <span className="input-group-text" id="">
            <Col>
              <Button className='heat-range-button' variant="dark" onClick={() => { setSelectRangeIntensity(!selectRangeIntensity);  changeCurrentInt()}} >Intensity</Button>
            </Col>
            <Col><h6>{rangeIntensity1}</h6></Col>
            <Col><h6>{rangeIntensity2}</h6></Col>
            <Col><h6>{rangeIntensity3}</h6></Col>
            <Col><h6>{rangeIntensity4}</h6></Col>
          </span>
    </Row>
    {selectRangeIntensity ? <div className='heat-popover'>
      <div style={cover} onClick={(event) => { setSelectRangeIntensity(false); changeCurrentInt()}} />
      <RangeSelector setValue1={e=>{setRangeIntensity1(parseInt(e))}} setValue2={e=>{setRangeIntensity2(parseInt(e))}} setValue3={e=>{setRangeIntensity3(parseInt(e))}} setValue4={e=>{setRangeIntensity4(parseInt(e))}}
                value1={rangeIntensity1} value2={rangeIntensity2} value3={rangeIntensity3} value4={rangeIntensity4} max={10}
              />
    </div> : null}

    <Row className="justify-content-md-center">

          <span className="input-group-text" id="">
            <Col>
              <Button className='heat-range-button' variant="dark" onClick={() => { setSelectRangeRadius(!selectRangeRadius);  changeCurrentRad()}} >Radius</Button>
            </Col>
            <Col><h6>{rangeRadius1}</h6></Col>
            <Col><h6>{rangeRadius2}</h6></Col>
            <Col><h6>{rangeRadius3}</h6></Col>
            <Col><h6>{rangeRadius4}</h6></Col>
          </span>
    </Row>
    {selectRangeRadius ? <div className='heat-popover'>
      <div style={cover} onClick={(event) => { setSelectRangeRadius(false); changeCurrentRad()}} />
      <RangeSelector setValue1={e=>{setRangeRadius1(parseInt(e))}} setValue2={e=>{setRangeRadius2(parseInt(e))}} setValue3={e=>{setRangeRadius3(parseInt(e))}} setValue4={e=>{setRangeRadius4(parseInt(e))}}
                value1={rangeRadius1} value2={rangeRadius2} value3={rangeRadius3} value4={rangeRadius4} max={20}
              />
    </div> : null}

    <Row className="justify-content-md-center">
          <span className="input-group-text" id="">
            <Col>
              <Button className='heat-range-button' variant="dark" onClick={() => { setSelectRangeOpacity(!selectRangeOpacity);  changeCurrentOpac()}} >Opacity</Button>
            </Col>
            <Col><h6>{rangeOpacity1}</h6></Col>
            <Col><h6>{rangeOpacity2}</h6></Col>
            <Col><h6>{rangeOpacity3}</h6></Col>
            <Col><h6>{rangeOpacity4}</h6></Col>
            
          </span>
    </Row>
    
    {selectRangeOpacity ? <div className='heat-popover'>
      <div style={cover} onClick={(event) => { setSelectRangeOpacity(false); changeCurrentOpac()}} />
      <RangeSelectorOpacity setValue1={e=>{setRangeOpacity1(parseInt(e))}} setValue2={e=>{setRangeOpacity2(parseInt(e))}} setValue3={e=>{setRangeOpacity3(parseInt(e))}} setValue4={e=>{setRangeOpacity4(parseInt(e))}}
                value1={rangeOpacity1} value2={rangeOpacity2} value3={rangeOpacity3} value4={rangeOpacity4} max={10}
              />
    </div> : null}
    <br></br>
    <Row>
      When zoom level is at Zoom X or less X will be used, if it's at Zoom Y or greater it will switch to Y
    </Row>
  </div>


  // THIS HANDLES CHANGING MAP SETTINGS TO THE CURRENT CENTER OF THE MAPBOX MAP

  const handleSetDefaults = () => {
    var latitude = map.current.getCenter().lat.toFixed(4);
    var longitude = map.current.getCenter().lng.toFixed(4);
    var zoom = map.current.getZoom().toFixed(2);
    setSettingsValues([latitude, longitude, zoom]);
  }
  useEffect(() => {
    store.updateMapData({
      type: 'heat',
      import: false,
      data: {
        type: 'color',
        data: currentColor
      }
    })
  }, [currentColor])
  // useEffect(() => {
  //   setCurrentColor([
  //     'interpolate',
  //     ['linear'],
  //     ['heatmap-density'],
  //     0,
  //     'rgba(33,102,172,0)',
  //     0.2,
  //     color1,
  //     0.4,
  //     color2,
  //     0.6,
  //     color3,
  //     0.8,
  //     color4,
  //     1,
  //     color5
  //   ])
  // }, [color1, color2, color3, color4, color5])
  useEffect(() => {
    try {
      updateTable();
    }
    catch (error) {
      console.log('cannot update table');
    }
  }, []);



  return (
    <div>
      <div className={`d-flex flex-row`} id="heat-map-sidebar">
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

        <div className={`bg-light border-right ${isToggled ? 'invisible' : 'visible'} ` } id="heat-map-menu">
          <div className="list-group list-group-flush edit-tools-list">
            <div className="row">
              <Accordion defaultActiveKey={['0']}  className='heat-map-accordian'>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Attach Data</Accordion.Header>
                  <Accordion.Body
                    className="d-flex flex-column" >
                    <div className="drop-zone">
                      <div className="drop-zone-text">
                        Attach a .json, .kml, or .shp file.
                      </div>
                      <input type="file" id="my_file_input" accept=".json,.kml,.shp" onChange={handleFileChange}/>
                      {/* {!isValidFile && (<div className="text-danger mt-2">Invalid file type. Please select a json, kml, or shp file.</div>)} */}
                      {/* {selectedFile && isValidFile && (<span>{selectedFile.name}</span>)} */}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">

                  <Accordion.Header>Heat Map Data</Accordion.Header>
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
                                    colIndex !== 0 && colIndex !== 4 ? (
                                      <input className='cells'
                                        type="text"
                                        value={row[colName]}
                                        onChange={(event) => handleEditChange(event, rowIndex, colName)}
                                        onBlur={handleEditBlur}
                                      />
                                    ) : colIndex !== 4 ? (
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
                    <div className="drop-zone">
                      <div className="drop-zone-text">
                        <h6>Drag & Drop or Click Browse to select a file</h6>
                      </div>
                        <input type="file" id="my_file_input" accept=".json,.kml,.shp" onChange={handleHeatMap} />
                      {/* {!isValidFile && (<div className="text-danger mt-2">Invalid file type. Please select a json, kml, or shp file.</div>)} */}
                      {/* {selectedFile && isValidFile && (<span>{selectedFile.name}</span>)} */}
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
                  <AccordionHeader>Heat Map Editor</AccordionHeader>
                  <Accordion.Body>
                    {tableData.length==0 ? fileUploader : options}
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                  <Accordion.Header>Choropleth Map Settings</Accordion.Header>
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
      {/* <HeatPointModal saveAndExitShow={showHeat} handlesaveAndExitShowClose={(event) => { setShowHeat(false) }} handleHeatMap={handleHeatMap} handleAddRow={handleAddRow}  /> */}
      <MapNameModal mapNameShow={showName} handleMapNameClose={(event) => { setShowName(false) }} mapId={mapId} />
    </div >
  )
}