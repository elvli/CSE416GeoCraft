import React from "react";
//import "./SaveAndExitModal.scss";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function SaveAndExitModal(props) {
  const { saveAndExitShow, handlesaveAndExitShowClose } = props

  const handleSubmit = (event) => {
    handlesaveAndExitShowClose(event)
  };
  const handleClosing = (event) => {
    handlesaveAndExitShowClose(event)
  }

  return (
    <div>
      <Modal centered show={saveAndExitShow} onHide={handlesaveAndExitShowClose}>
        <Modal.Header closeButton>
          <Modal.Title>Save and exit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Do you want to save before you exit?</p>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="secondary" onClick={handleClosing}>
            No
          </Button>
          <Form.Group>
            <Button variant="primary" type="submit" onClick={handleSubmit}>
              Yes
            </Button>
          </Form.Group>
        </Modal.Footer>
      </Modal>
    </div>

  )
}