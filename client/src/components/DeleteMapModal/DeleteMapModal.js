import React from "react";
import "./DeleteMapModal.scss";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function DeleteMapModal(props) {
  const { deleteMapShow, handleDeleteMapClose } = props

  const handleSubmit = (event) => {
    handleDeleteMapClose(event)
  };

  const handleClosing = (event) => {
    handleDeleteMapClose(event)
  }

  return (
    <div>
      <Modal centered show={deleteMapShow} onHide={handleDeleteMapClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Map?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this map?</p>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="secondary" onClick={handleClosing}>
            Close
          </Button>
          <Form.Group>
            <Button variant="primary" type="submit" onClick={handleSubmit}>
              Confirm
            </Button>
          </Form.Group>
        </Modal.Footer>
      </Modal>
    </div>

  )
}