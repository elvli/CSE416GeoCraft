import React, { useState, useRef, useContext, useEffect } from 'react'
import { Button, Table } from 'react-bootstrap';
import './HeatEditBar.scss'
import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { GlobalStoreContext } from '../../store'
import { XLg, PlusCircleFill, ViewStacked, Save } from 'react-bootstrap-icons';
import SaveAndExitModal from '../SaveAndExitModal/SaveAndExitModal'
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

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
  const [currentColor, setCurrentColor] = useState([
    'interpolate',
    ['linear'],
    ['heatmap-density'],
    0,
    'rgba(33,102,172,0)',
    0.2,
    'rgb(103,169,207)',
    0.4,
    'rgb(209,229,240)',
    0.6,
    'rgb(253,219,199)',
    0.8,
    'rgb(239,138,98)',
    1,
    'rgb(178,24,43)'
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

  function onColorClick(event, val) {
    console.log('hello')
    if(val == 1) {
      //Red
      setCurrentColor([
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(33,102,172,0)',
        0.2,
        'rgb(103,169,207)',
        0.4,
        'rgb(209,229,240)',
        0.6,
        'rgb(253,219,199)',
        0.8,
        'rgb(239,138,98)',
        1,
        'rgb(178,24,43)'
      ])
      
    }
    else if (val == 2) {
      //Orange
      setCurrentColor([
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(33,102,172,0)',
        0.2,
        'rgb(249,219,173)',
        0.4,
        'rgb(255,187,101)',
        0.6,
        'rgb(255,177,24)',
        0.8,
        'rgb(255,156,0)',
        1,
        'rgb(255,130,0)'
      ])
      
    }
    else if (val == 3) {
      //Yellow
      setCurrentColor([
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(255,238,160,0)',
        0.2,
        'rgb(255,228,142)',
        0.4,
        'rgb(255,212,98)',
        0.6,
        'rgb(253,185,84)',
        0.8,
        'rgb(255,158,57)',
        1,
        'rgb(255,139,52)'
      ])
      
    }
    else if (val == 4) {
      //Green
      setCurrentColor([
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(255,255,255,0)',
        0.2,
        'rgb(234,255,240)',
        0.4,
        'rgb(211,255,224)',
        0.6,
        'rgb(188,255,208)',
        0.8,
        'rgb(174,255,139)',
        1,
        'rgb(76,255,0)'
      ])
      
    }
    else {
      //Blue
      setCurrentColor([
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(255,255,255,0)',
        0.2,
        'rgb(228,242,250)',
        0.4,
        'rgb(201,233,246)',
        0.6,
        'rgb(135,206,235)',
        0.8,
        'rgb(69,179,224)',
        1,
        'rgb(31,141,186)'
      ])
      store.updateMapData({
        type:'heat',
        import:false,
        data: {
          type: 'color',
          data: currentColor
        }
      })
    }
    
  }

  let options = <div>
    <p>Select a color</p>
    <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
        <ToggleButton id="tbg-radio-1" value={1} onClick={(event)=> onColorClick(event, 1)}>
          Red
        </ToggleButton>
        <ToggleButton id="tbg-radio-2" value={2} onClick={(event)=> onColorClick(event, 2)}>
          Orange
        </ToggleButton>
        <ToggleButton id="tbg-radio-3" value={3} onClick={(event)=> onColorClick(event, 3)}>
          Yellow
        </ToggleButton>
        <ToggleButton id="tbg-radio-4" value={4} onClick={(event)=> onColorClick(event, 4)}>
          Green
        </ToggleButton>
        <ToggleButton id="tbg-radio-5" value={5} onClick={(event)=> onColorClick(event, 5)}>
          Blue
        </ToggleButton>
    </ToggleButtonGroup>
  </div>


  return (
    <div>
      <div className={`d-flex flex-row`} id="edit-left-wrapper">
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
        <div className={`bg-light border-right ${isToggled ? 'invisible' : 'visible'}`} id="edit-left-sidebar-wrapper">
          <div className="list-group list-group-flush edit-tools-list">
            <div className="row">
              <Accordion defaultActiveKey={['0']} alwaysOpen>
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

                  <Accordion.Header>Heat Map Settings</Accordion.Header>
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