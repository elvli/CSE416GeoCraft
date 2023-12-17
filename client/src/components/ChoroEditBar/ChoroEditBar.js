import React, { useState, useRef, useContext, useEffect } from 'react';
import { Button, Table, Accordion, Row, Col, Dropdown } from 'react-bootstrap';
import { GlobalStoreContext } from '../../store';
import { XLg, ViewStacked, Save, ArrowClockwise, ArrowCounterclockwise } from 'react-bootstrap-icons';
import SaveAndExitModal from '../SaveAndExitModal/SaveAndExitModal';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import './ChoroEditBar.scss';
import chroma from 'chroma-js';

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
  const [stepCount, setStepCount] = useState('5');

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




  // THIS SETS UP THE EDITBAR AND ITS STATES

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

          const regionArray = tableData.map((dict) => dict.region);
          setPrevSelectedRegions(regionArray);
          setChoroTheme(mapData.choroData.choroSettings.theme);
          setStepCount(mapData.choroData.choroSettings.stepCount);
          setTableHeaders(['ID', 'Region', mapData.choroData.choroSettings.headerValue]);

          setSettingsValues([mapData.settings.latitude, mapData.settings.longitude, mapData.settings.zoom])
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
    if (!doesRegionExist(tableData, regionInfo)) {
      setTableData((prevTableData) => [
        ...prevTableData,
        { id: prevTableData.length + 1, region: regionInfo, data: '0' },
      ]);
    }
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

    // THIS CORRECTS THE STEP COUNT SO THAT IT IS IN RANGE [1, 25]
    var correctedStepCount;
    if (stepCount === '')
      correctedStepCount = '5'
    else
      correctedStepCount = Math.min(25, Math.max(1, parseFloat(stepCount))).toString();
    setStepCount(correctedStepCount);

    // THIS CORRECTS THE COORDINATES SO THAT THEY ARE IN RANGE [-90, 90] AND [-180, 180]
    var latitude = Math.min(90, Math.max(-90, parseFloat(settingsValues[0])));
    var longitude = Math.min(180, Math.max(-180, parseFloat(settingsValues[1])));
    var zoom = Math.min(22, Math.max(1, parseFloat(settingsValues[2])));
    setSettingsValues([latitude, longitude, zoom])

    // THIS SETS THE NEW DATA TO THE MAPDATA OBJECT
    mapData.choroData.regionData = tableData;
    mapData.choroData.choroSettings = { theme: choroTheme, stepCount: correctedStepCount, headerValue: tableHeaders[2] };
    mapData.settings = { latitude: settingsValues[0], longitude: settingsValues[1], zoom: settingsValues[2] }

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



  function getValueForRegion(targetRegion) {
    const result = tableData.find(entry => entry.region === targetRegion);
    return result ? result.data : null;
  }


  // THIS HANDLES USERS CLICKING ON A REGION OF THE MAP

  const isLayerAdded = useRef(false);

  useEffect(() => {
    const regionSelectHandler = (event) => {
      const clickedRegion = event.features[0];
      var propertyName;

      if (clickedRegion) {
        let regionName;

        for (let i = 5; i >= 0; i--) {
          propertyName = `NAME_${i}`;
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

        // console.log('KSKS:', getValueForRegion(regionName))
        // console.log('ARR:', findGradient(choroTheme).gradient)
        // const regionsArray = tableData.map(entry => entry.region);
        // console.log('herehrehrehrehreh: ', regionsArray);

        // var layerColor = interpolateColor(getValueForRegion(regionName), findGradient(choroTheme).gradient)
        // console.log('layerColor', layerColor)
        // // console.log(propertyName)

        // map.current.addLayer({
        //   id: `${regionName}-choro`,
        //   type: 'fill',
        //   source: 'map-source',
        //   filter: ['==', propertyName, regionName],
        //   paint: {
        //     'fill-color': layerColor,
        //     'fill-opacity': 1,
        //   },
        // });
      }
    };

    map.current.on('click', 'geojson-border-fill', regionSelectHandler);

    const addLayer = () => {
      const regionsArray = tableData.map(entry => entry.region);

      for (var i = 0; i < regionsArray.length; i++) {
        var color = interpolateColor(getValueForRegion(regionsArray[i]), findGradient(choroTheme).gradient);

        // THIS ADDED THE APPROPRIATE COLOR BASED ON THE REGIONS VALUE
        map.current.addLayer({
          id: `${regionsArray[i]}-choro`,
          type: 'fill',
          source: 'map-source',
          filter: ['==', 'NAME_1', regionsArray[i]],
          paint: {
            'fill-color': color,
            'fill-opacity': 1,
          },
        });
      };
      
      // THIS ADDED A BORDER SO THAT THE REGIONS DON'T GET MIXED UP TOGETHER
      map.current.addLayer({
        id: 'choro-border',
        type: 'line',
        source: 'map-source',
        paint: {
          'line-opacity': 1,
          'line-color': '#FFFFFF',
          'line-width': 0.5,
        },
      });
    };

    const tryAddLayer = () => {
      if (!isLayerAdded.current && map.current.isStyleLoaded() && tableData.length > 0) {
        addLayer();
        isLayerAdded.current = true;
      } else {
        setTimeout(tryAddLayer, 100);
      }
    };

    tryAddLayer();

    return () => {
      map.current.off('click', 'geojson-border-fill', regionSelectHandler);
    };
  }, [prevSelectedRegions]);




  // THIS HANDLES ADDING LAYERS TO REGIONS WITH THE PROPER COLOR VALUES

  // useEffect(() => {
  //   const updateLayers = () => {
  //     const regionsArray = tableData.map(entry => entry.region);
  //     console.log('herehrehrehrehreh: ', regionsArray);

  //     for (var i = 0; i < regionsArray.length; i++) {
  //       console.log('CURRENT LAYER', i);
  //       map.current.addLayer({
  //         id: `${regionsArray[i]}-choro`,
  //         type: 'fill',
  //         source: 'map-source',
  //         filter: ['==', 'ID_1', regionsArray[i]],
  //         paint: {
  //           'fill-color': interpolateColor(getValueForRegion(regionsArray[i]), findGradient(choroTheme).gradient),
  //           'fill-opacity': 1,
  //         },
  //       });
  //     };
  //   };

  //   // if (tableData.length > 0) {
  //   updateLayers();
  //   // }
  // }, [tableData]);


  // THIS HANDLES DOWNLOADING MAP DATA AS A JSON FILE

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

  const downloadJSONButton = (
    < div className='choro-json-button' >
      <Button variant="btn btn-dark" onClick={() => { downloadJson(); }}>
        Download JSON
      </Button>
      <a href="#" ref={downloadLinkRef} style={{ display: 'none' }} />
    </div >
  );




  // THIS HANDLES SELECTING MAP THEMES

  const findGradient = (themeName) => colorGradients.find(theme => theme.name === themeName);

  function generateColors(steps, gradient) {
    const colorStops = gradient.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g) || [];

    if (colorStops.length < 2) {
      throw new Error('Invalid gradient format. At least two color stops are required.');
    }

    const colors = chroma
      .scale(colorStops)
      .colors(steps);

    return colors;
  }

  function interpolateColor(value, gradient) {
    const gradientArray = generateColors(parseFloat(stepCount), gradient);

    var adjustedValue = Math.max(0, Math.min(100, parseFloat(value)));
    var index = parseInt(Math.round((adjustedValue * (gradientArray.length - 1)) / 100));

    const resultColor = gradientArray[index];

    return resultColor;
  }

  const handleGradientSelect = (selectedOption) => {
    setChoroTheme(selectedOption.name);
  };

  const colorGradients = [
    { name: 'Warm', gradient: 'linear-gradient(to right, #f7d559, #ffc300, #ff8c1a, #ff5733, #FF0000)' },
    { name: 'Cool', gradient: 'linear-gradient(to right, #96FFFF, #0013de)' },
    { name: 'Hot and Cold', gradient: 'linear-gradient(to right, #FF0000, #0013de)' },
    { name: 'Forest', gradient: 'linear-gradient(to right, #A1DDA1, #66cc66, #009900, #14452F)' },
    { name: 'Grayscale', gradient: 'linear-gradient(to right, #D9D8DA, #363439)' },
    { name: 'Baja Blast', gradient: 'linear-gradient(to right, #FCFB62, #17E0BC)' },
    { name: 'Vice City', gradient: 'linear-gradient(to right, #ffcc00, #ff3366, #cc33ff, #9933ff)' },
    { name: 'Rainbow', gradient: 'linear-gradient(to right, #ff0000, #ff9900, #ffff00, #33cc33, #3399ff, #6633cc)' },
  ];

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

    <div className="input-group">
      <div className="input-group-prepend">
        <span className="input-group-text" id="">Map Theme</span>
      </div>

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
    </div>
  );




  // THIS HANDLES USERS SETTING STEP COUNT FOR THEIR GRADIENT

  const handleStepChange = (event) => {
    const numericValue = event.target.value.replace(/[^0-9]/g, '');
    console.log('chagneAL:', numericValue)
    setStepCount(numericValue);
  };

  const handleStepKeyDown = (event) => {
    const isNumericOrBackspace = /^\d$/.test(event.key) || event.key === 'Backspace';
    if (!isNumericOrBackspace) {
      event.preventDefault();
    }
  };

  const stepInput = (
    <div className="input-group">
      <div className="input-group-prepend">
        <span className="input-group-text" id="">Gradient Steps</span>
      </div>
      <input
        type="text"
        className="form-control"
        placeholder='Steps'
        value={stepCount}
        onChange={handleStepChange}
        onKeyDown={handleStepKeyDown}
      />
    </div>
  );


  // THIS HANDLES CHANGING MAP SETTINGS TO THE CURRENT CENTER OF THE MAPBOX MAP

  const handleSetDefaults = () => {
    var latitude = map.current.getCenter().lat.toFixed(4);
    var longitude = map.current.getCenter().lng.toFixed(4);
    var zoom = map.current.getZoom().toFixed(2);
    setSettingsValues([latitude, longitude, zoom]);
  }




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
                    {gradientDropDown}
                    {stepInput}
                    {downloadJSONButton}
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
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
    </div>
  )
}