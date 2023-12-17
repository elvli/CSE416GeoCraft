import React from "react";
import { useState, useContext } from "react";
import { Form, Button, Modal } from 'react-bootstrap'
import GlobalStoreContext from "../../store";
import "./MapCreateModal.scss";

export default function MapCreateModal(props) {
  const { show, handleClose } = props;
  const { store } = useContext(GlobalStoreContext);
  const [validated, setValidated] = useState(false);

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
      console.log(formData.get('mapType'))
      store.createNewMap(
        formData.get("mapName"),
        formData.get("mapType")
      )
      handleClose(event)
    }
  };
  const handleClosing = (event) => {
    setValidated(false);
    handleClose(event)
  }

  return (
    <div>
      <Modal centered show={show} onHide={handleClose}>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Create Your Map</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Enter the Name of Your Map</Form.Label>
              <Form.Control className="map-name" name='mapName' required type="text" placeholder="Map Name" />
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Label>Select Your Map Type</Form.Label>
              <Form.Select name='mapType' required >
                <option value="">Select your map type</option>
                <option value="heat">Heat Map</option>
                <option value="point">Point Map</option>
                <option value="propSymb">Proportional Symbols Map</option>
                <option value="choro">Choropleth Map</option>
                <option value="line">Line Map</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClosing}>
              Close
            </Button>
            <Form.Group>
              <Button variant="primary" type="submit">
                Create
              </Button>
            </Form.Group>

          </Modal.Footer>
        </Form>

      </Modal>
    </div>
  )
}