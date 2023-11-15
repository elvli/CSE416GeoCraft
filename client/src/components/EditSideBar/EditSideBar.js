import React, { useState, useRef } from 'react'
import { Button, Table } from 'react-bootstrap';
import { Gear, ViewStacked, PencilSquare, Wrench } from 'react-bootstrap-icons';
import './EditSideBar.scss'
import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { XLg } from 'react-bootstrap-icons';
import SaveAndExitModal from '../SaveAndExitModal/SaveAndExitModal'
export default function EditSideBar(props) {
  const [isToggled, setIsToggled] = useState(false);
  const [show, setShow] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [isEditingHeader, setIsEditingHeader] = useState(null)
  const [tableData, setTableData] = useState([
    { id: 1, xCoordinate: 0.5, yCoordinate: 0.7 },
    { id: 2, xCoordinate: 0.3, yCoordinate: 0.2 },
    { id: 3, xCoordinate: 0.8, yCoordinate: 0.4 },
    { id: 4, xCoordinate: 0.2, yCoordinate: 0.9 },
    { id: 5, xCoordinate: 0.6, yCoordinate: 0.1 },
  ]);
  const [tableHeaders, setTableHeaders] = useState([
    'ID', 'X Coordinate', 'Y Coordinate'
  ]);
  const [jsonData, setJsonData] = useState('');
  const downloadLinkRef = useRef(null);
  
  function toggleSideBar(event) {
    event.preventDefault();
    setIsToggled(!isToggled);
  }
  const handleHeaderDoubleClick = (index) => {
    setIsEditingHeader(index);
  };

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
    // Generate JSON data here before triggering download
    const json = JSON.stringify({ headers: tableHeaders, data: tableData });
    setJsonData(json);

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Set the href and download attributes using the ref
    downloadLinkRef.current.href = url;
    downloadLinkRef.current.download = 'table_data.json';

    // Trigger a click on the anchor to start the download
    downloadLinkRef.current.click();

    // Revoke the URL to free up resources
    URL.revokeObjectURL(url);
  };


  return (
    <div>

      <div className={`d-flex flex-row`} id="left-wrapper">
        <div className="left-bar">
          <Col id="left-tool">
            <Row>
              <Button className="button" variant="dark" onClick={toggleSideBar}>
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
                <Button className="button" id="close-button" variant="dark" onClick={()=>setShow(true)}>
                <XLg/>
              </Button>
            </Row>
          </Col>

        </div>
        <div className={`bg-light border-right ${isToggled ? 'invisible' : 'visible'}`} id="left-sidebar-wrapper">
          <div className="list-group list-group-flush tools-list">
            <div className="row">
              <Accordion defaultActiveKey={['0']} alwaysOpen>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Attach Data</Accordion.Header>
                  <Accordion.Body className="d-flex justify-content-between">
                    <input type="file" id="my_file_input" />
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Heat Map Data</Accordion.Header>
                  <Accordion.Body >
                  <Table striped bordered hover>
                      <thead>
                        <tr>
                          {tableHeaders.map((header, index) => (
                            <th
                              key={index + 1}
                              onDoubleClick={() => handleHeaderDoubleClick(index + 1)}
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
                                {isEditing &&
                                isEditing.rowIndex === rowIndex &&
                                isEditing.colName === colName ? (
                                  <input
                                    type="text"
                                    value={row[colName]}
                                    onChange={(event) => handleEditChange(event, rowIndex, colName)}
                                    onBlur={handleEditBlur}
                                    onKeyPress={handleKeyPress}
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
                    <Button variant="primary" onClick={() => { downloadJson(); }}>
                      Download JSON
                    </Button>
                    <a href="#" ref={downloadLinkRef} style={{ display: 'none' }} />
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
      <SaveAndExitModal saveAndExitShow={show} handlesaveAndExitShowClose={(event)=>{setShow(false)}}/>
    </div>
  )
}