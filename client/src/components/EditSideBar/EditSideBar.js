import React, { useState, useRef, useContext } from 'react'
import { Button, Table } from 'react-bootstrap';
import { Gear, ViewStacked, PencilSquare, Wrench, Circle } from 'react-bootstrap-icons';
import './EditSideBar.scss'
import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { GlobalStoreContext } from '../../store'
import { XLg, PlusCircleFill } from 'react-bootstrap-icons';
import SaveAndExitModal from '../SaveAndExitModal/SaveAndExitModal'
import rewind from "@mapbox/geojson-rewind";
export default function EditSideBar(props) {
  const { store } = useContext(GlobalStoreContext);
  const [isToggled, setIsToggled] = useState(false);
  const [show, setShow] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [isEditingHeader, setIsEditingHeader] = useState(null)
  const [tableData, setTableData] = useState([
    { id: 1, Latitude: 0.5, Longitude: 0.7 },
    { id: 2, Latitude: 0.3, Longitude: 0.2 },
    { id: 3, Latitude: 0.8, Longitude: 0.4 },
    { id: 4, Latitude: 0.2, Longitude: 0.9 },
    { id: 5, Latitude: 0.6, Longitude: 0.1 }
  ]);
  const [tableHeaders, setTableHeaders] = useState([
    'ID', 'Latitude', 'Longitude'
  ]);
  const [jsonData, setJsonData] = useState('');
  const downloadLinkRef = useRef(null);
  const { mapId } = props;

  function toggleSideBar(event) {
    event.preventDefault();
    setIsToggled(!isToggled);
  }

  const handleFileChange = (event) => {
    handleFileSelection(event.target.files);
  };

  const handleFileSelection = async (files) => {
    const file = files[0];
    var reader = new FileReader()
    let mapData = await store.getMapDataById(mapId);
    reader.onloadend = (event) => {
      var text = event.target.result;
      try {
        var json = JSON.parse(text);
        rewind(json, false);;
        mapData.GeoJson = json;
        store.updateMapDataById(mapId, mapData);

      } catch (error) {
        console.error('Error handling file selection:', error);
      }
    }
    reader.readAsText(file);
   // if (file) {
      
    //}
  };

  // THESE FUNCTIONS ARE FOR MANIPULATING THE DATA TABLE

  const handleAddRow = () => {
    var newTable = []
    for (let i = 0; i < tableData.length; i++) {
      newTable.push(tableData[i])
    }
    newTable.push({ id: newTable.length + 1, Latitude: null, Longitude: null, })
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

  const handleDoubleClick = (rowIndex, colName) => {
    setIsEditing({ rowIndex, colName });
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

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleEditBlur();
      handleHeaderBlur();
    }
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

  return (
    <div>
      <div className={`d-flex flex-row`} id="edit-left-wrapper">
        <div className="edit-left-bar">
          <Col id="edit-left-tool">
            <Row>
              <Button className="edit-button" variant="dark" onClick={toggleSideBar}>
                <ViewStacked />
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
                        Drag & Drop or Click Browse to select a file
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
                                    value={header}
                                    onChange={(event) => handleHeaderChange(event, index + 1)}
                                    onKeyPress={handleKeyPress}
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
                                  onDoubleClick={() => handleDoubleClick(rowIndex, colName)}
                                  onBlur={handleEditBlur}
                                >
                                  {
                                    colIndex !== 0 ? (
                                      <input className='cells'
                                        type="text"
                                        value={row[colName]}
                                        onChange={(event) => handleEditChange(event, rowIndex, colName)}
                                        onBlur={handleEditBlur}
                                      />
                                    ) : (
                                      row[colName]
                                    )}
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
              </Accordion>
            </div>
          </div>
        </div>
      </div>
      <SaveAndExitModal saveAndExitShow={show} handlesaveAndExitShowClose={(event) => { setShow(false) }} />
    </div>
  )
}