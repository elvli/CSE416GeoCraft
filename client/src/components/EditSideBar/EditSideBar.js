import React, { useState } from 'react'
import { Button } from 'react-bootstrap';
import { Gear, ViewStacked, PencilSquare, Wrench } from 'react-bootstrap-icons';
import './EditSideBar.scss'
import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function EditSideBar(props) {
  const [isToggled, setIsToggled] = useState(false);

  function toggleSideBar(event) {
    event.preventDefault();
    setIsToggled(!isToggled);
  }

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
                  <Accordion.Header>Edit Border</Accordion.Header>
                  <Accordion.Body>
                    Border Stuff
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Edit Regions</Accordion.Header>
                  <Accordion.Body>
                    Region Stuff
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Attach Data</Accordion.Header>
                  <Accordion.Body>
                    Data Stuff
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                  <Accordion.Header>Heat Map Data</Accordion.Header>
                  <Accordion.Body>
                    Heat Map Stuff
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