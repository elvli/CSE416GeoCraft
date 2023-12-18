import React from "react";
import { useState } from "react";
import { Form, Button, Modal, Row, Col, Container } from "react-bootstrap";

export default function HeatPointModal(props) {
  const { saveAndExitShow, handlesaveAndExitShowClose, handleHeatMap, handleAddRow } = props
  const [validated, setValidated] = useState(false);
  const [negativeMag, setNegativeMag] = useState(false)
  const [latitude, setLatitude] = useState(false)
  const [longitude, setLongitude] = useState(false)

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    }
    else {
      event.preventDefault();
      event.stopPropagation();
      const formData = new FormData(event.currentTarget);
      handleAddRow(formData.get('lat'), formData.get('long'), formData.get('mag'))
      handlesaveAndExitShowClose()
    }
  };

  const handleClosing = (event) => {
    setValidated(false);
    handlesaveAndExitShowClose()
  }

  const handleNegative = (event) => {
    const negative = event.target.value;
    if (negative.match(/^(\d*\.?\d+)/)) {
      event.target.setCustomValidity('');
    }
    else {
      event.target.setCustomValidity(`Must be positive`);
    }

    setNegativeMag(!negative.match(/^(\d*\.?\d+)/));
  }

  const handleLat = (event) => {
    const lat = event.target.value;
    if (lat.match(/(\-?\d*\.?\d+)/)) {
      event.target.setCustomValidity(``);
    }
    else {
      event.target.setCustomValidity(`Must be a number`);
    }
    setLatitude(!lat.match(/(\-?\d*\.?\d+)/))
  }

  const handleLong = (event) => {
    const long = event.target.value;
    if (long.match(/(\-?\d*\.?\d+)/)) {
      event.target.setCustomValidity(``);
    }
    else {
      event.target.setCustomValidity(`Must be a number`);
    }
    setLongitude(!long.match(/(\-?\d*\.?\d+)/))
  }

  const handleFile = (event) => {
    event.preventDefault();
    event.stopPropagation();
    handleHeatMap(event)
    handlesaveAndExitShowClose()
  }




  return (
    <div>
      <Modal centered show={saveAndExitShow} onHide={handlesaveAndExitShowClose}>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Add a point or upload a file</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <h6>Add latitude, longitude, and magnitude</h6>
                <Form.Group as={Col}>
                  <Form.Control className="heat-lat" name='lat' required type="text" placeholder="Latitude" size="md" onChange={handleLat} />
                  {latitude && <div className="sign-up-error-message text-danger">Must be a number.</div>}
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Control className="heat-long" name='long' required type="text" placeholder="Longitude" size="md" onChange={handleLong} />
                  {longitude && <div className="sign-up-error-message text-danger">Must be a number.</div>}
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Control className="heat-mag" name='mag' required type="text" placeholder="Magnitude" size="md" onChange={handleNegative} />
                  {negativeMag && <div className="sign-up-error-message text-danger">Must be positive.</div>}
                </Form.Group>
              </Row>
              <br></br>
              <h4>OR</h4>
              <br></br>
              <Row>
                <div className="drop-zone">
                  <div className="drop-zone-text">
                    <h6>Drag & Drop or Click Browse to select a file</h6>
                  </div>
                  <input type="file" id="my_file_input" accept=".json,.kml,.shp" onChange={handleFile} />
                </div>
              </Row>
            </Container>

          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            <Button variant="secondary" onClick={handleClosing}>
              No
            </Button>

            <Form.Group>
              <Button variant="primary" type="submit">
                Yes
              </Button>
            </Form.Group>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>

  )
}