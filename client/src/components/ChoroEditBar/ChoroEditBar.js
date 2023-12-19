import React, { useState, useRef, useContext, useEffect } from 'react';
import { Button, Table, Accordion, Row, Col, Dropdown } from 'react-bootstrap';
import { GlobalStoreContext } from '../../store';
import { XLg, ViewStacked, Save, ArrowClockwise, ArrowCounterclockwise, PencilSquare, FileEarmarkArrowUp } from 'react-bootstrap-icons';
import DataErrorModal from '../DataErrorModal/DataErrorModal';
import EditChoroRegionModal from '../EditRegionModal/EditChoroRegionModal';
import MapNameModal from '../MapNameModal/MapNameModal';
import SaveAndExitModal from '../SaveAndExitModal/SaveAndExitModal';
import PublishMapModal from '../PublishMapModal/PublishMapModal';
import RemoveGeoJsonModal from '../RemoveGeoJsonModal/RemoveGeoJsonModal'
import mapboxgl from 'mapbox-gl';
import AddRowTransaction from '../../transactions/Choro/AddRowTransaction';
import DeleteRowTransaction from '../../transactions/Choro/DeleteRowTransaction'
import ChangeDataHeaderTransaction from '../../transactions/Choro/ChangeDataHeaderTransaction';
import ChangeLegendTitleTransaction from '../../transactions/Choro/ChangeLegendTitleTransaction';
import ChangeStepTransaction from '../../transactions/Choro/ChangeStepTransaction';
import ChangeTableDataTransaction from '../../transactions/Choro/ChangeTableDataTransaction';
import GradientSelectTransaction from '../../transactions/Choro/GradientSelectTransaction';
import SettingsChangeTransaction from '../../transactions/SettingsChangeTransaction';
import SetDefaultsTransaction from '../../transactions/SetDefaultsTransaction';
import jsTPS from '../../common/jsTPS';
import rewind from "@mapbox/geojson-rewind";
import chroma from 'chroma-js';
import './ChoroEditBar.scss';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZWx2ZW5saTU0IiwiYSI6ImNsb3RiazljdTA3aXkycm1tZWUzYXNiMTkifQ.aknGR78_Aed8cL6MXu6KNA'

export default function ChoroEditBar(props) {
  const { mapId, map } = props;
  const { store } = useContext(GlobalStoreContext);

  const [isToggled, setIsToggled] = useState(false);
  const [show, setShow] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showRegion, setShowRegion] = useState(false);
  const [showDataError, setShowDataError] = useState(false);
  const [showGeoModal, setShowGeoModal] = useState(false);
  const [publishMapShow, setPublishMapShow] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [tempTableHeaders, setTempTableHeaders] = useState(['ID', 'Region', 'Value']);
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
  const isLayerAdded = useRef(false);
  const [legendTitle, setLegendTitle] = useState('');

  const [tps, setTPS] = useState(new jsTPS);

  // THIS HANDLES THE TOGGLING OF THE SIDEBAR
  function toggleSideBar(event) {
    event.preventDefault();
    setIsToggled(!isToggled);
  }

  // THIS HANDLES UNDOING AN ACTION
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

  // THIS HANDLES REDOING AN ACTION
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

  // THIS DETECTS THE USERS KEYBOARD INPUTS FOR UNDOING, REDOING, AND SAVING
  function KeyPress(event) {
    if (event.ctrlKey) {
      if (event.key === 'z') {
        handleUndo(event);
      } else if (event.key === 'y') {
        handleRedo(event);
      } else if (event.key === 's') {
        event.preventDefault();
        handleSave();
      }
    }
  }

  document.onkeydown = (event) => KeyPress(event);

  // THIS FUNCTION PREVENTS USERS FROM INPUTING CHARACTERS ASIDE FROM '-' AND '.' 
  // INTO ANY OF THE INPUTS
  const handleStepKeyDown = (event) => {
    const isNumericOrBackspace = /^\d$/.test(event.key) || event.key === '-' || event.key === '.' || event.key === 'Backspace' || event.key === 'Enter' || event.key === 'ArrowLeft' || event.key === 'ArrowReft' || event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Tab';

    // ALLOW DEFAULT BEHAVIOR OR CUT, COPY, PASTE, AND SELECT
    if (!(event.ctrlKey && ['x', 'X', 'c', 'C', 'v', 'V', 'a', 'A'].includes(event.key))) {
      if (!isNumericOrBackspace) {
        event.preventDefault();
      }
    }
  };

  async function handlePublish(event) {
    setPublishMapShow(true)
  }
  async function handlePublishClose(event) {
    setPublishMapShow(false)
  }

  // THIS HANDLES CHANGES TO DEFAULT MAP SETTINGS
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
    }

    const settingsChangeTransaction = new SettingsChangeTransaction(
      oldSettings,
      newSettings,
      setSettingsValues
    );
    tps.addTransaction(settingsChangeTransaction);
  };




  // THIS SETS UP THE EDITBAR AND ITS STATES

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

      setSettingsValues([mapData.settings.latitude, mapData.settings.longitude, mapData.settings.zoom]);
      setLegendTitle(mapData.legendTitle);
    }
    catch {
      console.log('cannot load mapdata');
    }
  };

  useEffect(() => {
    try {
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
    var extension = file.name.split(".")[1];
    var reader = new FileReader();
    reader.onloadend = async (event) => {
      var text = event.target.result;

      if (extension === 'json') {
        var json = JSON.parse(text);
        var mapData = await store.getMapDataById(mapId);

        if (json.mapID) {
          mapData.GeoJson = json.GeoJson;
          mapData.choroData.regionData = json.choroData.regionData;
          mapData.choroData.choroSettings = json.choroData.choroSettings;
          mapData.settings = json.settings;

          await store.updateMapDataById(mapId, mapData);
          await store.setCurrentList(mapId, 0);
          updateTable();
        }

        else if (json.type === 'FeatureCollection' || json.features) {
          mapData.GeoJson = json;
          await store.updateMapDataById(mapId, mapData);
          await store.setCurrentList(mapId, 0)
        }
      }

      else if (extension === 'kml') {
        mapData = await store.getMapDataById(mapId);
        var tj = require('@mapbox/togeojson')
        var kml = new DOMParser().parseFromString(text, "text/xml"); // create xml dom object
        json = tj.kml(kml); // convert xml dom to geojson
        rewind(json, false); // correct right hand rule
        mapData.GeoJson = json;
        await store.updateMapDataById(mapId, mapData);
        await store.setCurrentList(mapId, 0);
      }

      // var json = JSON.parse(text);
      // mapData.GeoJson = json;
      // await store.updateMapDataById(mapId, mapData);
      // await store.setCurrentList(mapId, 0)
    };
    reader.readAsText(file);
  }




  // THESE FUNCTIONS ARE FOR MANIPULATING THE DATA TABLE

  const handleAddRow = (regionInfo) => {
    if (!doesRegionExist(regionInfo)) {
      const addRowTransaction = new AddRowTransaction({ id: tableData.length + 1, region: regionInfo, data: '0' }, tableData.length, setTableData);
      tps.addTransaction(addRowTransaction);
    }
  };

  const handleDeleteRow = (rowIndex) => {
    const deletedRow = tableData[rowIndex];

    const deleteRowTransaction = new DeleteRowTransaction(rowIndex, deletedRow, setTableData);
    tps.addTransaction(deleteRowTransaction);
  };

  const handleEditChange = (event, rowIndex, colName) => {
    const oldValue = tableData[rowIndex][colName];
    const newValue = event.target.value;

    const changeTableDataTransaction = new ChangeTableDataTransaction(
      rowIndex,
      colName,
      oldValue,
      newValue,
      setTableData
    );
    tps.addTransaction(changeTableDataTransaction);
  };

  const handleEditTableBlur = () => {
    setIsEditing(null);
  };

  const handleEditHeaderBlur = () => {
    const oldTableHeaders = tableHeaders.slice();
    const newTableHeaders = tempTableHeaders.slice();

    const changeDataHeaderTransaction = new ChangeDataHeaderTransaction(
      oldTableHeaders,
      newTableHeaders,
      setTableHeaders,
      setIsEditing
    );
    tps.addTransaction(changeDataHeaderTransaction);
  };




  // THIS HANDLES THE SAVING OF ALL DATA IN EVERY INPUT FIELD TO mapData
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

    // THIS SETS THE DATA HEADER FOR THE DATA TABLE AND CHECKS IF ITS AND EMPTY STRING ''
    var dataHeader = (tableHeaders[2] === '') ? mapData.choroData.choroSettings.headerValue : tableHeaders[2];
    mapData.choroData.choroSettings = { propName: propName, theme: choroTheme, stepCount: correctedStepCount, headerValue: dataHeader };

    // THIS CLEANS THE TABLEDATA AND REPLACES INVALID DATA WITH '0' AND NOTIFIES THE USER
    var cleanedTableData = cleanTableData();
    mapData.choroData.regionData = cleanTableData();
    setTableData(cleanedTableData);

    mapData.settings = { latitude: settingsValues[0], longitude: settingsValues[1], zoom: settingsValues[2] }
    setTableHeaders([tableHeaders[0], tableHeaders[1], mapData.choroData.choroSettings.headerValue]);


    // THIS SETS THE DATA FOR THE MAP LEGEND
    mapData.legendTitle = legendTitle;
    mapData.legend = generateLegend();
    console.log(mapData.legend);

    await store.updateMapDataById(mapId, mapData);
    await store.setCurrentList(mapId, 0);
  };

  // THIS CHANGES THE HEADER OF THE VALUE COLUMN (THIRD FROM LEFT)
  const changeTempDataHeader = (event) => {
    const newHeaders = [...tableHeaders];
    newHeaders[2] = event.target.value
    setTempTableHeaders(newHeaders);
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
  const cleanTableData = () => {
    let dataReplaced = false;

    const updatedTableData = tableData.map(item => {
      if (!/^-?\d+(\.\d+)?$/.test(item.data)) {
        dataReplaced = true;
        return { ...item, data: '0' };
      }
      return item;
    });

    // If data was replaced at least once, set showDataError to true
    if (dataReplaced) {
      setShowDataError(true);
    }

    return updatedTableData;
  };

  const tableContent = (
    <div className="choro-table table-custom-scrollbar">
      <Table striped bordered hover>
        <thead>
          <tr>
            {/* <th>ID</th> */}
            <th>Region</th>
            <th
              className={`th-editable ${isEditing === 2 ? 'editing' : ''}`}
              onDoubleClick={() => setIsEditing(2)}
            >
              {isEditing === 2 ? (
                <input
                  className='data-header-input'
                  type="text"
                  value={tempTableHeaders[2]}
                  onChange={changeTempDataHeader}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleEditHeaderBlur();
                    }
                  }}
                  onBlur={handleEditHeaderBlur}
                />
              ) : (
                tableHeaders[2]
              )}
            </th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={row.id}>
              {/* Omitted the id column */}
              <td>
                <p>{row.region}</p>
              </td>
              <td>
                <input
                  className="cells"
                  type="text"
                  value={(row.data === '0') ? '0' : row.data}
                  onChange={(event) => handleEditChange(event, rowIndex, 'data')}
                  onKeyDown={handleStepKeyDown}
                  onBlur={handleEditTableBlur}
                />
              </td>
              <td>
                <button onClick={() => handleDeleteRow(rowIndex)} className="choro-delete-row-btn btn btn-secondary">
                  <i className="bi bi-trash"></i>
                </button>
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




  // THIS HANDLES USERS CLICKING ON A REGION OF THE MAP AND CHANGING REGION NAMES

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

    const regionDblClickHandler = (event) => {
      event.preventDefault()
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
          else if (clickedRegion.properties.hasOwnProperty('NAME')) {
            regionName = clickedRegion.properties['NAME'];
          }
          else {
            regionName = ''
          }
        }

        // IF THIS REGION ISN'T IN THE TABLE, ADD IT SO USERS CAN EDIT IT, OTHERWISE JUMP TO IT ON THE TABLE
        setSelectedRegion(regionName);
        setShowRegion(true)

      }
    };


    // WHEN A REGION IS DOUBLECLICKED ON, RUN regionDblClickHandler
    // THIS WILL OPEN A MODAL AND PROMPT THE USER TO CHANGE THE NAME OF THAT REGION
    map.current.on('dblclick', 'geojson-border-fill', regionDblClickHandler);

    // WHEN A REGION IS CLICKED ON, RUN regionSelectHandler
    // THIS WILL ADD THE REGION TO THE tableData and allow users to edit its values
    map.current.on('click', 'geojson-border-fill', regionSelectHandler);

    // // WHEN A REGION IS DOUBLECLICKED ON, RUN regionDblClickHandler
    // // THIS WILL OPEN A MODAL AND PROMPT THE USER TO CHANGE THE NAME OF THAT REGION
    // map.current.on('dblclick', 'geojson-border-fill', regionDblClickHandler);

    //CLEAN UP
    return () => {
      map.current.off('click', 'geojson-border-fill', regionSelectHandler);
    };
  }, [prevSelectedRegions]);

  // THIS HANDLES CHANGING A REGIONS NAME ON THE MAP. IT REFLECTS ON THE DATA TABLE AND THE MAP ITSELF.
  const changeRegionNameinData = (oldRegionName, newRegionName) => {
    const updatedTableData = tableData.map(item =>
      item.region === oldRegionName ? { ...item, region: newRegionName } : item
    );

    setTableData(updatedTableData);

    const updatedPrevSelectedRegions = prevSelectedRegions.map(region =>
      region === oldRegionName ? newRegionName : region
    );
    setPrevSelectedRegions(updatedPrevSelectedRegions);
    handleSave();
  };

  // THIS HANDLES RENDERING THE REGIONS WITH THE APPROPRIATE COLORS
  // WILL TRIGGER WHEN choroRenders IS UPDATED

  useEffect(() => {
    const addLayer = () => {
      const regionsArray = tableData.map(entry => entry.region);
      const dataValues = tableData.map(entry => parseInt(entry.data, 10));
      const dataRange = [Math.min(...dataValues), Math.max(...dataValues)];

      for (var i = 0; i < regionsArray.length; i++) {
        var color = interpolateColor(getValueForRegion(regionsArray[i]), findGradient(choroTheme).gradient, dataRange);
        const layerId = `${regionsArray[i]}-choro`;

        // CHECK IF THE LAYER EXISTS ALREADY. IF IT DOES, REMOVE IT.
        if (map.current.getLayer(layerId)) {
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
      if (map.current.getLayer('choro-border')) {
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




  // THIS HANDLES THE EDITING OF THE MAP LEGEND
  const handleLegendTitleChange = (event) => {
    const changeLegendTitleTransaction = new ChangeLegendTitleTransaction(
      legendTitle,
      event.target.value,
      setLegendTitle
    );
    tps.addTransaction(changeLegendTitleTransaction);
  }

  const handleLegendEditBlur = () => {
    setIsEditing(null);
  };

  const createIntervals = (dataRange, steps) => {
    const [min, max] = dataRange;
    const intervalSize = (max - min) / steps;

    const intervals = [];

    for (let i = 0; i < steps; i++) {
      const start = min + i * intervalSize;
      const end = i === steps - 1 ? max : start + intervalSize - 1;

      intervals.push([Math.round(start), Math.round(end)]);
    }

    return intervals.reverse();
  }

  const generateLegend = () => {
    // const sortedTableData = tableData.sort((a, b) => parseInt(b.data) - parseInt(a.data));
    // const regionsArray = sortedTableData.map(entry => entry.region);
    // tableData.sort((a, b) => a.id - b.id);

    const dataValues = tableData.map(entry => parseInt(entry.data, 10));
    const dataRange = [Math.min(...dataValues), Math.max(...dataValues)];
    const intervals = createIntervals(dataRange, stepCount);

    var legendTable = [];

    for (var i = 0; i < Math.min(intervals.length); i++) {
      var color = interpolateColor(intervals[i][0], findGradient(choroTheme).gradient, dataRange);
      var num1 = intervals[i][0];
      var num2 = intervals[i][1];

      const description = `${num1} to ${num2}`;

      legendTable.push({ color: color, description: description });
    }

    return legendTable;
  }






  // THIS HANDLES DOWNLOADING MAP DATA AS A JSON FILE

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
    const rewait = await store.setPrint(arg);
  }

  const handleRemoveGeoJson = async () => {
    var mapData = await store.getMapDataById(mapId);
    mapData.GeoJson = null;
    mapData.choroData = {};

    await store.updateMapDataById(mapId, mapData);
    await store.setCurrentList(mapId, 0);

    // setTableData([]);
    updateTable();
    handleSave();
    tps.clearAllTransactions();
  }




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
  function interpolateColor(value, gradient, dataRange) {
    const gradientArray = generateColors(parseFloat(stepCount), gradient);
    const stepSize = (dataRange[1] - dataRange[0]) / stepCount;

    // FIND THE CORRESPONDING INDEX BASED ON THE value AND dataRange
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

  // THIS HANDLES THE SELCECTING A GRADIENT FROM THE DROPDOWN
  const handleGradientSelect = (selectedOption) => {
    const oldChoroTheme = choroTheme;
    const newChoroTheme = selectedOption.name;

    const gradientSelectTransaction = new GradientSelectTransaction(
      oldChoroTheme,
      newChoroTheme,
      setChoroTheme
    );
    tps.addTransaction(gradientSelectTransaction);
  };

  // THESE ARE THE GRADIENTS THAT WE ALLOW THE USER TO CHOOSE
  const colorGradients = [
    { name: 'Warm', gradient: 'linear-gradient(to right, #f7d559, #ffc300, #ff8c1a, #ff5733, #FF0000)' },
    { name: 'Cool', gradient: 'linear-gradient(to right, #96FFFF, #0013de)' },
    { name: 'Hot and Cold', gradient: 'linear-gradient(to right, #FF0000, #ff5733, #ff8c1a, #ffc300, #f7d559, #96FFFF, #71c4f7, #4b89ef, #264ee6, #0013de)' },
    { name: 'Forest', gradient: 'linear-gradient(to right, #fffece, #aede91, #83ca80, #41a65c, #288241, #288241)' },
    { name: 'Deep Forest', gradient: 'linear-gradient(to right, #d8dd91, #093104)' },
    { name: 'Lavender', gradient: 'linear-gradient(to right, #d0ceed, #a8aaed, #8281e6, #6569d2, #222572)' },
    { name: 'Sunset', gradient: 'linear-gradient(to right, #feff9c, #ff9c00, #ff741e, #bc2971, #7a136e)' },
    { name: 'Barbie', gradient: 'linear-gradient(to right, #f1f1f1, #d7b4da, #f358b4, #e8117c, #a20043)' },
    { name: 'Aquamirine', gradient: 'linear-gradient(to right, #fcfed5, #a5dcbb, #389bc2, #2a69b2, #293d9f)' },
    { name: 'Grayscale', gradient: 'linear-gradient(to right, #e5e4e5, #252425)' },
    { name: 'Baja Blast', gradient: 'linear-gradient(to right, #FCFB62, #17E0BC)' },
    { name: 'Vice City', gradient: 'linear-gradient(to right, #ffcc00, #ff3366, #cc33ff, #9933ff)' },
    { name: 'Evangelion', gradient: 'linear-gradient(to right, #c6faa6, #aff383, #936cad, #533975)' },
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
        <span className="input-group-text">Map Theme</span>
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
    const oldStepCount = stepCount;
    const newStepCount = numericValue;

    const changeStepTransaction = new ChangeStepTransaction(
      oldStepCount,
      newStepCount,
      setStepCount
    );
    tps.addTransaction(changeStepTransaction);
  };

  const stepInput = (
    <div className="input-group">
      <div className="input-group-prepend">
        <span className="input-group-text">Gradient Steps</span>
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
  };




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
              <Button className="edit-button" variant="dark" onClick={handleUndo} disabled={!tps.hasTransactionToUndo()}>
                <ArrowCounterclockwise />
              </Button>
            </Row>

            <Row>
              <Button className="edit-button" variant="dark" onClick={handleRedo} disabled={!tps.hasTransactionToRedo()}>
                <ArrowClockwise />
              </Button>
            </Row>

            <Row>
              <Button className="edit-button" variant="dark" onClick={() => setShowName(true)} aria-label="change map name">
                <PencilSquare />
              </Button>
            </Row>

            <Row>
              <Button className="edit-button" variant="dark" onClick={handlePublish}>
                <FileEarmarkArrowUp />
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

                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                  <Accordion.Header>Choropleth Map Settings</Accordion.Header>
                  <Accordion.Body>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">Default Center</span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder='Latitude'
                        value={settingsValues[0]}
                        onChange={(event) => handleSettingChange(event, 0)}
                        onKeyDown={handleStepKeyDown}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder='Longitude'
                        value={settingsValues[1]}
                        onChange={(event) => handleSettingChange(event, 1)}
                        onKeyDown={handleStepKeyDown}
                      />
                    </div>

                    <div className="input-group setting-zoom">
                      <div className="input-group-prepend">
                        <span className="input-group-text default-zoom">Default Zoom</span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder='Zoom'
                        value={settingsValues[2]}
                        onChange={(event) => handleSettingChange(event, 2)}
                        onKeyDown={handleStepKeyDown}
                      />
                    </div>

                    <Button className="set-default-button" variant="btn btn-dark" onClick={handleSetDefaults} >
                      Set Defaults Here
                    </Button>
                    <Button className="set-default-button" variant="btn btn-dark" onClick={() => setShowGeoModal(true)}>
                      Remove GeoJson Data
                    </Button>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                  <Accordion.Header>Edit Legend</Accordion.Header>
                  <Accordion.Body>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text default-zoom">Legend Title</span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        value={legendTitle}
                        onChange={(event) => handleLegendTitleChange(event)}
                        onBlur={handleLegendEditBlur}
                      />
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
      <DataErrorModal showDataError={showDataError} handleShowDataErrorClose={(event) => { setShowDataError(false) }} />
      <EditChoroRegionModal editRegionShow={showRegion} handleEditRegionClose={(event) => { setShowRegion(false) }} mapId={mapId} region={selectedRegion} tps={tps} changeRegionNameinData={changeRegionNameinData} />
      <MapNameModal mapNameShow={showName} handleMapNameClose={(event) => { setShowName(false) }} mapId={mapId} />
      <PublishMapModal publishMapShow={publishMapShow} handlePublishMapClose={handlePublishClose} />
      <RemoveGeoJsonModal removeGeoShow={showGeoModal} handleRemoveGeoShowClose={(event) => { setShowGeoModal(false) }} removeGeo={handleRemoveGeoJson} />
      <SaveAndExitModal saveAndExitShow={show} handlesaveAndExitShowClose={(event) => { setShow(false) }} />
    </div>
  )
}