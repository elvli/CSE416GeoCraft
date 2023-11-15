import React from "react";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function EditRegionModal(props) {
  const { editRegionShow, handleEditRegionClose } = props
  const [validated, setValidated] = useState(false)

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  const handleClosing = (event) => {
    setValidated(false);
    handleEditRegionClose(event)
  }

  return (
    <div>
      <Modal centered show={editRegionShow} onHide={handleEditRegionClose}>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Enter Region Name</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Enter the Name of Your Map</Form.Label>
              <Form.Control className="map-name" required type="text" placeholder="Map Name" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClosing}>
              Close
            </Button>
            <Form.Group>
              <Button variant="primary" type="submit" onClick={handleSubmit}>
                Confirm
              </Button>
            </Form.Group>

          </Modal.Footer>
        </Form>

      </Modal>
    </div>
  )
}