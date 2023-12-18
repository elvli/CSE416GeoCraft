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
  const { mapId, map } = props;
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
  const [settingsValues, setSettingsValues] = useState([40.9257, -73.1409, 15]);
  const [stepCount, setStepCount] = useState('5');
  const [choroRenders, setChoroRenders] = useState(0);
  const [propName, setPropName] = useState('');
  const [dataRange, setDataRange] = useState([0, 100]);
  const isLayerAdded = useRef(false);

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

          // THIS SECTION FILLS IN TABLEDATA WITH THE CHOROPLETH DATA FROM THE BACKEND
          var newRegionData = []
          for (let i in mapData.choroData.regionData) {
            newRegionData.push({
              'id': mapData.choroData.regionData[i]['id'],
              'region': mapData.choroData.regionData[i]['region'],
              'data': mapData.choroData.regionData[i]['data']
            });
          }
          setTableData(newRegionData);

          const regionArray = tableData.map((dict) => dict.region);
          setPrevSelectedRegions(regionArray);
          setPropName(mapData.choroData.choroSettings.propName);
          setChoroTheme(mapData.choroData.choroSettings.theme);
          setStepCount(mapData.choroData.choroSettings.stepCount);
          setTableHeaders(['ID', 'Region', mapData.choroData.choroSettings.headerValue]);

          // THIS WILL TRIGGER THE CHOROPLETH MAP TO RE-RENDER REGION LAYERS
          isLayerAdded.current = false;
          setChoroRenders((prev) => prev + 1);

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
    if (!doesRegionExist(regionInfo)) {
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

    // THIS CORRECTS THE COORDINATES SO THAT THEY ARE IN RANGE [-90, 90] AND [-180, 180]
    var latitude = (settingsValues[0] !== '') ? Math.min(90, Math.max(-90, parseFloat(settingsValues[0]))) : mapData.settings.latitude;
    var longitude = (settingsValues[1] !== '') ? Math.min(180, Math.max(-180, parseFloat(settingsValues[1]))) : mapData.settings.longitude;
    var zoom = (settingsValues[0] !== '') ? Math.min(22, Math.max(1, parseFloat(settingsValues[2]))) : mapData.settings.zoom;
    setSettingsValues([latitude, longitude, zoom])

    // THIS WILL TRIGGER THE CHOROPLETH MAP TO RE-RENDER REGION LAYERS
    isLayerAdded.current = false;
    setChoroRenders((prev) => prev + 1);

    // THIS SETS NEW DATA TO THE MAPDATA OBJECT AND CORRECT ANY MISSING VALUES
    var correctedStepCount = (stepCount === '') ? '5' : Math.min(25, Math.max(1, parseFloat(stepCount))).toString();
    setStepCount(correctedStepCount);

    var dataHeader = (tableHeaders[2] === '') ? mapData.choroData.choroSettings.headerValue : tableHeaders[2];
    mapData.choroData.choroSettings = { propName: propName, theme: choroTheme, stepCount: correctedStepCount, headerValue: dataHeader };

    // var cleanedTableData = cleanTableData(tableData);
    // mapData.choroData.regionData = cleanTableData(cleanedTableData);
    // console.log(cleanedTableData)
    // setTableData(cleanedTableData)
    mapData.choroData.regionData = tableData

    mapData.settings = { latitude: settingsValues[0], longitude: settingsValues[1], zoom: settingsValues[2] }
    setTableHeaders([tableHeaders[0], tableHeaders[1], mapData.choroData.choroSettings.headerValue]);

    // THIS SETS THE DATA RANGE FOR tableData (USED FOR COLOR INTERPOLATION)
    const dataValues = tableData.map(entry => parseInt(entry.data, 10));
    setDataRange([Math.min(...dataValues), Math.max(...dataValues)]);

    await store.updateMapDataById(mapId, mapData);
    await store.setCurrentList(mapId, 0);
  };

  // THIS CHANGES THE HEADER OF THE VALUE COLUMN (THIRD FROM LEFT)
  const changeDataHeader = (event) => {
    const newHeaders = [...tableHeaders];
    newHeaders[2] = event.target.value
    setTableHeaders(newHeaders);
  };

  // THIS CHECKS IF A REGION NAME EXISTS IN tableData
  const doesRegionExist = (region) => {
    for (const item of tableData) {
      if (item.region === region) {
        return true;
      }
    }
    return false;
  };

  // THIS CLEANS THE TABLE DATA. IT SETS EMPTY STRINGS TO '0' AND REMOVE CHARACTERS
  // THAT AREN'T DIGITS OR THE NEGATIVE SIGN '-'
  // const cleanTableData = (tableData) => {
  //   // Iterate through each dictionary in the array
  //   const updatedTableData = tableData.map(entry => {
  //     // Check and update each value
  //     const updatedEntry = {};
  //     for (const key in entry) {
  //       if (entry.hasOwnProperty(key)) {
  //         // Check if the value is an empty string and replace it with 0
  //         updatedEntry[key] = entry[key] === '' ? 0 : entry[key];
  //       }
  //     }
  //     return updatedEntry;
  //   });

  //   return updatedTableData;
  // }


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
                  value={(row.data === 0) ? '0' : row.data}
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

  useEffect(() => {
    const regionSelectHandler = (event) => {
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
          else {
            propertyName = 'NAME'
          }
        }
        setPropName(propertyName);

        // IF THIS REGION ISN'T IN THE TABLE, ADD IT SO USERS CAN EDIT IT, OTHERWISE JUMP TO IT ON THE TABLE
        setSelectedRegion(regionName);

        if (!doesRegionExist(regionName)) {
          handleAddRow(regionName);
          setPrevSelectedRegions((prevRegions) => [...prevRegions, regionName]);
        }
        else {
          console.log('Region selected once already!!!!!');
        }
        setActiveKey((prevActiveKey) => [...prevActiveKey, '1']);
      }
    };

    // WHEN A REGION IS CLICKED ON, RUN regionSelectHandler
    map.current.on('click', 'geojson-border-fill', regionSelectHandler);

    //CLEAN UP
    return () => {
      map.current.off('click', 'geojson-border-fill', regionSelectHandler);
    };
  }, [prevSelectedRegions]);




  // THIS HANDLES RENDERING THE REGIONS WITH THE APPROPRIATE COLORS
  // WILL TRIGGER WHEN choroRenders IS UPDATED

  useEffect(() => {
    const addLayer = () => {
      const regionsArray = tableData.map(entry => entry.region);

      for (var i = 0; i < regionsArray.length; i++) {
        var color = interpolateColor(getValueForRegion(regionsArray[i]), findGradient(choroTheme).gradient);
        const layerId = `${regionsArray[i]}-choro`;

        // CHECK IF THE LAYER EXISTS ALREADY. IF IT DOES, REMOVE IT.
        const existingLayer = map.current.getLayer(layerId);

        if (existingLayer) {
          map.current.removeLayer(layerId);
        }

        // ADD THE NEW LAYER ITS COLOR
        map.current.addLayer({
          id: layerId,
          type: 'fill',
          source: 'choro-map',
          filter: ['==', propName, regionsArray[i]],
          paint: {
            'fill-color': color,
            'fill-opacity': 1,
          },
        });
      }

      // CHECK IF THE CHOROPLETH BORDER LAYER EXISTS, IF IT DOES, REMOVE IT
      const borderLayerExists = map.current.getLayer('choro-border');

      if (borderLayerExists) {
        map.current.removeLayer('choro-border');
      }

      // ADD THE CHOROPLETH BORDER LAYER
      map.current.addLayer({
        id: 'choro-border',
        type: 'line',
        source: 'choro-map',
        paint: {
          'line-opacity': 1,
          'line-color': '#FFFFFF',
          'line-width': 0.5,
        },
      });
    };

    // ONLY ATTEMPT TO ADD LAYER IF MAPBOX IS LOADED AND THERE IS DATA TO BE RENDERED
    const tryAddLayer = () => {
      if (!isLayerAdded.current && map.current.isStyleLoaded() && tableData.length > 0) {
        addLayer();
        isLayerAdded.current = true;
      } else {
        setTimeout(tryAddLayer, 100);
      }
    };

    tryAddLayer();
  }, [choroRenders]);




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




  // THESE FUNCTIONS HANDLE SELECTING MAP THEMES AND CREATING GRADIENT STEPS

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

  // THIS ASSIGNS THE APPROPRIATE COLOR FOR THE REGIONS VALUE
  function interpolateColor(value, gradient) {
    const gradientArray = generateColors(parseFloat(stepCount), gradient);
    const stepSize = (dataRange[1] - dataRange[0]) / stepCount;

    // Find the corresponding index based on the value and dataRange
    const index = Math.max(
      0,
      Math.min(
        stepCount - 1,
        Math.floor((value - dataRange[0]) / stepSize)
      )
    );

    const resultColor = gradientArray[index];

    return resultColor;
  }

  const handleGradientSelect = (selectedOption) => {
    setChoroTheme(selectedOption.name);
  };

  // THESE ARE THE GRADIENTS THAT WE ALLOW THE USER TO CHOOSE
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