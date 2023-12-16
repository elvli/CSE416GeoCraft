import React, { useState, useRef, useContext, useEffect } from 'react';
import { Button, Table, Accordion, Row, Col } from 'react-bootstrap';
import { GlobalStoreContext } from '../../store';
import { XLg, ViewStacked, Save, ArrowClockwise, ArrowCounterclockwise } from 'react-bootstrap-icons';
import SaveAndExitModal from '../SaveAndExitModal/SaveAndExitModal';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import './ChoroEditBar.scss';
mapboxgl.accessToken = 'pk.eyJ1IjoiZWx2ZW5saTU0IiwiYSI6ImNsb3RiazljdTA3aXkycm1tZWUzYXNiMTkifQ.aknGR78_Aed8cL6MXu6KNA'

export default function ChoroEditBar(props) {
  const { mapId, settings, map } = props;
  const { store } = useContext(GlobalStoreContext);

  const [isToggled, setIsToggled] = useState(false);
  const [show, setShow] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState(['ID', 'Region', 'Value']);
  const [jsonData, setJsonData] = useState('');
  const downloadLinkRef = useRef(null);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [prevSelectedRegions, setPrevSelectedRegions] = useState([]);
  const [choroTheme, setChoroTheme] = useState('');

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
  const handleAddRow = (regionInfo) => {
    setTableData((prevTableData) => [
      ...prevTableData,
      { id: prevTableData.length + 1, region: regionInfo, data: '' },
    ]);
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
    mapData.choroData.regionData = tableData;
    mapData.choroData.choroSettings = { theme: "red", headerValue: tableHeaders[2] };
    await store.updateMapDataById(mapId, mapData);
    await store.setCurrentList(mapId, 0);
    console.log('DADTATA', tableData)
  };

  const changeDataHeader = (event) => {
    const newHeaders = [...tableHeaders];
    newHeaders[2] = event.target.value;
    setTableHeaders(newHeaders);
  };

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

  const doesRegionExist = (array, region) => {
    for (const item of array) {
      if (item.region === region) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    try {
      const updateTable = async () => {
        try {
          var mapData = await store.getMapDataById(mapId)
          var newRegionData = []
          for (let i in mapData.choroData.regionData) {
            newRegionData.push({
              'id': mapData.choroData.regionData[i]['id'],
              'region': mapData.choroData.regionData[i]['region'],
              'data': mapData.choroData.regionData[i]['data']
            });
          }
          setTableData((prevTableData) => {
            return newRegionData;
          });
          setTableHeaders(['ID', 'Region', mapData.choroData.choroSettings.headerValue])
          setChoroTheme(mapData.choroData.choroSettings.theme);

          const regionArray = tableData.map((dict) => dict.region);
          setPrevSelectedRegions(regionArray);
        }
        catch {
          console.log('cannot load mapdata');
        }
      };

      updateTable();
    } catch (error) {
      console.log('Cannot update table');
    }
  }, []);

  useEffect(() => {
    const clickHandler = (e) => {
      const clickedRegion = e.features[0];

      if (clickedRegion) {
        const regionName = clickedRegion.properties.NAME_1;

        setSelectedRegion(regionName);
        if (doesRegionExist(tableData, regionName)) {
          console.log('Region selected once already!!!!!');
        }
        else {
          handleAddRow(regionName);
          setPrevSelectedRegions((prevRegions) => [...prevRegions, regionName]);
          console.log('PrevSelected REGIONS', [...prevSelectedRegions, regionName]);
        }

        console.log('Clicked region:', regionName);
      }
    };

    map.current.on('click', 'geojson-border-fill', clickHandler);

    // Cleanup function to remove the event listener
    return () => {
      map.current.off('click', 'geojson-border-fill', clickHandler);
    };
  }, [prevSelectedRegions]);

  return (
    <div>
      <div className={`d-flex flex-row`} id="choro-map-edit">
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
              <Button className="edit-button" variant="dark" onClick={store.undo()}>
                <ArrowCounterclockwise />
              </Button>
            </Row>

            <Row>
              <Button className="edit-button" variant="dark" onClick={store.redo()}>
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
        <div className={`bg-light border-right ${isToggled ? 'invisible' : 'visible'}`} id="choro-map-sidebar">
          <div className="list-group list-group-flush edit-tools-list">
            <div className="row">
              <Accordion defaultActiveKey={['0']} alwaysOpen className='choro-map-accordian'>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Attach Data</Accordion.Header>
                  <Accordion.Body
                    className="d-flex flex-column" >
                    <div className="drop-zone">
                      <div className="drop-zone-text">
                        Attach a .json, .kml, or .shp file.
                      </div>
                      <input type="file" id="my_file_input" accept=".json,.kml,.shp" onChange={handleFileChange} />
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                  <Accordion.Header>Choropleth Map Data</Accordion.Header>
                  <Accordion.Body>
                    <div className="choro-table table-custom-scrollbar">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Region</th>
                            <th
                              className={`th-editable ${isEditing === 2 ? 'editing' : ''}`}
                              onDoubleClick={() => setIsEditing(2)}
                            >
                              {isEditing === 2 ? (
                                <input
                                  type="text"
                                  value={tableHeaders[2]}
                                  onChange={changeDataHeader}
                                  onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                      handleEditBlur();
                                    }
                                  }}
                                  onBlur={handleEditBlur}
                                />
                              ) : (
                                tableHeaders[2]
                              )}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.map((row, rowIndex) => (
                            <tr key={row.id}>
                              <td>{row.id}</td>
                              <td>
                                <p>{row.region}</p>
                              </td>
                              <td>
                                <input
                                  className="cells"
                                  type="text"
                                  value={row.data || ''}
                                  onChange={(event) => handleEditChange(event, rowIndex, 'data')}
                                  onBlur={handleEditBlur}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
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
                  <Accordion.Header>Choropleth Map Settings</Accordion.Header>
                  <Accordion.Body>
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