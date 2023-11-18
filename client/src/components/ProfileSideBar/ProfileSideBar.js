import React, { useState, useRef } from 'react'
import { Button, Table } from 'react-bootstrap';
import { Gear, ViewStacked, PencilSquare, Wrench } from 'react-bootstrap-icons';
import './ProfileSideBar.scss'
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

  function toggleSideBar(event) {
    event.preventDefault();
    setIsToggled(!isToggled);
  }


  const handleHeaderBlur = () => {
    setIsEditingHeader(null);
  };

  const handleDoubleClick = (rowIndex, colName) => {
    setIsEditing({ rowIndex, colName });
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
            <Row>
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
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                  <Accordion.Header>Heat Map Data</Accordion.Header>
                  <Accordion.Body >
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}