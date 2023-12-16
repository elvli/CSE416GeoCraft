import React, { useState, useRef, useContext, useEffect } from 'react';
import { Button, Table, Accordion, Row, Col, Dropdown } from 'react-bootstrap';
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
  const [activeKey, setActiveKey] = useState(['0']);
  const [geoJsonData, setGeoJsonData] = useState(null);
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

  // This sets up the editbar and its states

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
    setGeoJsonData(mapData.GeoJson);
    mapData.choroData.regionData = tableData;
    mapData.choroData.choroSettings = { theme: choroTheme, headerValue: tableHeaders[2] };
    mapData.settings.longitude = settingsValues[1]
    mapData.settings.latitude = settingsValues[0]
    mapData.settings.zoom = settingsValues[2]
    await store.updateMapDataById(mapId, mapData);
    await store.setCurrentList(mapId, 0);
  };

  const changeDataHeader = (event) => {
    const newHeaders = [...tableHeaders];
    newHeaders[2] = event.target.value;
    setTableHeaders(newHeaders);
  };

  const doesRegionExist = (array, region) => {
    for (const item of array) {
      if (item.region === region) {
        return true;
      }
    }
    return false;
  };

  const tableContent = (
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
  );




  useEffect(() => {
    const regionSelectHandler = (e) => {
      const clickedRegion = e.features[0];

      if (clickedRegion) {
        let regionName;

        for (let i = 5; i >= 0; i--) {
          const propertyName = `NAME_${i}`;
          if (clickedRegion.properties.hasOwnProperty(propertyName)) {
            regionName = clickedRegion.properties[propertyName];
            break;
          }
        }

        setSelectedRegion(regionName);
        if (!doesRegionExist(tableData, regionName)) {
          handleAddRow(regionName);
          setPrevSelectedRegions((prevRegions) => [...prevRegions, regionName]);
        }
        else {
          console.log('Region selected once already!!!!!');
        }
        setActiveKey((prevActiveKey) => [...prevActiveKey, '1']);
      }
    };

    map.current.on('click', 'geojson-border-fill', regionSelectHandler);

    return () => {
      map.current.off('click', 'geojson-border-fill', regionSelectHandler);
    };
  }, [prevSelectedRegions]);

  // useEffect(() => {
  //   console.log('herehrehrehrehreh');

  //   // Check if the map and 'map-source' are available
  //   if (map.current.isSourceLoaded('map-source')) {
  //     console.log('start filling tableData');

  //     const fillLayerId = 'region-fill';
  //     const lineLayerId = 'region-line';

  //     // Remove existing layers if they exist
  //     if (map.current.getLayer(fillLayerId)) {
  //       map.current.removeLayer(fillLayerId);
  //     }
  //     if (map.current.getLayer(lineLayerId)) {
  //       map.current.removeLayer(lineLayerId);
  //     }

  //     // Add a fill layer
  //     map.current.addLayer({
  //       id: fillLayerId,
  //       type: 'fill',
  //       source: 'map-source',
  //       paint: {
  //         'fill-opacity': 1,
  //         'fill-color': '#0000FF',
  //       },
  //     });

  //     // Add a line layer
  //     // map.current.addLayer({
  //     //   id: lineLayerId,
  //     //   type: 'line',
  //     //   source: 'region-source',
  //     //   layout: {},
  //     //   paint: {
  //     //     'line-color': 'blue',
  //     //     'line-width': 2,
  //     //   },
  //     //   filter: ['in', 'NAME_1', ...prevSelectedRegions], // Adjust the property name based on your GeoJSON structure
  //     // });
  //   } else {
  //     // Set up a listener to wait for the source to load
  //     const sourceLoadListener = () => {
  //       // Remove the listener to avoid multiple calls
  //       map.current.off('sourceload', 'map-source', sourceLoadListener);

  //       // Trigger the effect again now that the source is loaded
  //       setGeoJsonData(geoJsonData); // Assuming you have some state change to trigger the effect again
  //     };

  //     // Attach the listener
  //     map.current.on('sourceload', 'map-source', sourceLoadListener);
  //   }
  // }, [geoJsonData, map]);




  // This portion handles downloading the mapdata as a json file:
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

  const downloadJSONButon = (
    < div className='choro-JSONButton' >
      <Button variant="btn btn-dark" onClick={() => { downloadJson(); }}>
        Download JSON
      </Button>
      <a href="#" ref={downloadLinkRef} style={{ display: 'none' }} />
    </div >
  );




  // This portion handles seletecting map themes.

  const handleGradientSelect = (selectedOption) => {
    console.log(selectedOption.name);
    setChoroTheme(selectedOption.name);
  };

  const colorGradients = [
    { name: 'Warm', gradient: 'linear-gradient(to left, #FF0000, #ff5733, #ff8c1a, #ffc300, #f7d559)' },
    { name: 'Cool', gradient: 'linear-gradient(to right, #96FFFF, #0013de)' },
    { name: 'Hot and Cold', gradient: 'linear-gradient(to right, #FF0000, #0013de)' },
    { name: 'Forest', gradient: 'linear-gradient(to left, #14452F, #009900, #66cc66, #A1DDA1)' },
    { name: 'Grayscale', gradient: 'linear-gradient(to right, #D9D8DA, #363439)' },
    { name: 'Baja Blast', gradient: 'linear-gradient(to right, #FCFB62, #17E0BC)' },
    { name: 'Vice City', gradient: 'linear-gradient(to right, #ffcc00, #ff3366, #cc33ff, #9933ff)' },
    { name: 'Rainbow', gradient: 'linear-gradient(to right, #ff0000, #ff9900, #ffff00, #33cc33, #3399ff, #6633cc)' },
  ];

  const findGradient = (themeName) => colorGradients.find(theme => theme.name === themeName);

  const dropdownToggleContent = choroTheme ? (
    <div className="d-flex align-items-center">
      <div
        style={{
          width: '75px',
          height: '20px',
          marginRight: '10px',
          background: findGradient(choroTheme).gradient,
        }}
      />
      {choroTheme}
    </div>
  ) : 'Select Color';

  const gradientDropDown = (
    <Dropdown>
      <Dropdown.Toggle
        variant="white"
        style={{ border: '1px solid #ced4da', display: 'flex', alignItems: 'center', width: '216px', marginBottom: '16px', borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }}
      >
        {dropdownToggleContent}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {colorGradients.map((option, index) => (
          <Dropdown.Item
            key={index}
            onClick={() => handleGradientSelect(option)}
          >
            <div className="d-flex align-items-center">
              <div
                style={{
                  width: '100px',
                  height: '20px',
                  marginRight: '10px',
                  background: option.gradient,
                }}
              />
              {option.name}
            </div>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );




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

        <div className={`bg-light border-right ${isToggled ? 'invisible' : 'visible'}`} id="choro-map-sidebar">
          <div className="list-group list-group-flush edit-tools-list">
            <div className="row">
              <Accordion
                defaultActiveKey={['0']}
                activeKey={activeKey}
                onSelect={(newActiveKey) => setActiveKey(newActiveKey)}
                alwaysOpen
                className="choro-map-accordian"
              >
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
                    {tableContent}
                    {downloadJSONButon}
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                  <Accordion.Header>Choropleth Map Settings</Accordion.Header>
                  <Accordion.Body>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="">Map Theme</span>
                      </div>
                      {gradientDropDown}
                    </div>

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