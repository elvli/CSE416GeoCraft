import React, { useState, useRef, useContext, useEffect } from 'react'
import { Button, Table, ButtonGroup, Card, AccordionHeader } from 'react-bootstrap';
import './HeatEditBar.scss'
import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { GlobalStoreContext } from '../../store'
import { XLg, PlusCircleFill, ViewStacked, Save } from 'react-bootstrap-icons';
import SaveAndExitModal from '../SaveAndExitModal/SaveAndExitModal'
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import { ChromePicker } from 'react-color'
import { HexColorPicker } from "react-colorful";

export default function HeatEditBar(props) {
  const { mapId, points, settings } = props;
  const { store } = useContext(GlobalStoreContext);
  const [isToggled, setIsToggled] = useState(false);
  const [show, setShow] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [isEditingHeader, setIsEditingHeader] = useState(null)
  const [tableData, setTableData] = useState(points);
  const [tableHeaders, setTableHeaders] = useState([
    'ID', 'Latitude', 'Longitude'
  ]);

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
  const [currentColor, setCurrentColor] = useState([
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
    color5,
  ])
  const [jsonData, setJsonData] = useState('');
  const downloadLinkRef = useRef(null);

  function toggleSideBar(event) {
    event.preventDefault();
    setIsToggled(!isToggled);
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
    mapData.points = tableData
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

  const generateHeatMap = async (event) => {
    event.preventDefault();

  }
  
  const [heatMapData, setHeatMapData] = useState(null);

  const handleHeatMap = async (event) => {
    event.preventDefault();
    var file = event.target.files[0]
    var reader = new FileReader();
    reader.onloadend = async (event) => {
      var text = event.target.result;
      try {
        var json = JSON.parse(text);
        setHeatMapData(json) 
        store.updateMapData({
          type: 'heat',
          import: true,
          data: json
        })
      } catch (error) {
        console.error('Error handling file selection:', error);
      }
    };
    reader.readAsText(file);
  }

  let fileUploader = <div className="drop-zone">
  <div className="drop-zone-text">
    Drag & Drop or Click Browse to select a file
  </div>
    <input type="file" id="my_file_input" accept=".json,.kml,.shp" onChange={handleHeatMap} />
    {/* {!isValidFile && (<div className="text-danger mt-2">Invalid file type. Please select a json, kml, or shp file.</div>)} */}
    {/* {selectedFile && isValidFile && (<span>{selectedFile.name}</span>)} */}
  </div>
  useEffect(() => {
    store.updateMapData({
      type:'heat',
      import:false,
      data: {
        type: 'color',
        data: currentColor
      }
    })
  }, [currentColor])
  useEffect(() => {
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
  }, [color1,color2,color3,color4,color5])


  const cover = {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  }

  let options = <div >
    <p>Select a color</p>
        <Button className='heat-button' onClick={()=>{setPicker1(!picker1)}}>
          Red
        </Button>
        <Button className='heat-button' onClick={()=>{setPicker2(!picker2)}}>
          Orange
        </Button>
        <Button className='heat-button' onClick={()=>{setPicker3(!picker3)}}>
          Yellow
        </Button>
        <Button className='heat-button' onClick={()=>{setPicker4(!picker4)}}>
          Green
        </Button>
        <Button  className='heat-button' onClick={()=>{setPicker5(!picker5)}}>
          Blue
        </Button>
        { picker1 ? <div className='heat-popover'>
          <div style={ cover } onClick={ (event)=>{setPicker1(false)} }/>
          <HexColorPicker color={color1} onChange={setColor1}/>
        </div> : null }
        { picker2 ? <div className='heat-popover'>
          <div style={ cover } onClick={ (event)=>{setPicker2(false) } }/>
          <HexColorPicker color={color2} onChange={setColor2}/>
        </div> : null }
        { picker3 ? <div className='heat-popover'>
          <div style={ cover } onClick={ (event)=>{setPicker3(false) } }/>
          <HexColorPicker color={color3} onChange={setColor3}/>
        </div> : null }
        { picker4 ? <div className='heat-popover'>
          <div style={ cover } onClick={ (event)=>{setPicker4(false)} }/>
          <HexColorPicker color={color4} onChange={setColor4}/>
        </div> : null }
        { picker5 ? <div className='heat-popover'>
          <div style={ cover } onClick={ (event)=>{setPicker5(false)} }/>
          <HexColorPicker color={color5} onChange={setColor5}/>
        </div> : null }

  </div>


  return (
    <div>
      <div className={`d-flex flex-row`} id="heat-map-sidebar">
        <div className="edit-left-bar">
          <Col id="edit-left-tool">
            <Row>
              <Button className="edit-button" variant="dark" onClick={toggleSideBar}>
                <ViewStacked />
              </Button>
              <Button className="edit-button" variant="dark" onClick={handleSave}>
                <Save></Save>
              </Button>
            </Row>
            {/* <Row>
              <Button className="button" variant="dark">
                <PencilSquare />
              </Button>
            </Row>
            <Row>
              <Button className="button" variant="dark">
                <Wrench />
              </Button>
            </Row>
            <Row>
              <Button className="button" variant="dark">
                <Gear />
              </Button>
            </Row> */}
            <Row>
              <Button className="edit-button" id="edit-close-button" variant="dark" onClick={() => setShow(true)}>
                <XLg />
              </Button>
            </Row>
          </Col>

        </div>
        <div className={`bg-light border-right ${isToggled ? 'invisible' : 'visible'}`} id="heat-map-menu">
          <div className="list-group list-group-flush edit-tools-list">
            <div className="row">
              <Accordion defaultActiveKey={['0']} alwaysOpen className='heat-map-accordian'>
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
                  <AccordionHeader>Heat Map Editor</AccordionHeader>
                  <Accordion.Body>
                    {!heatMapData?fileUploader:options}
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