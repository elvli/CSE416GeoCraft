import React from "react";
import "./ExportMapModal.scss";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function ExportMapModal(props) {
  const { exportMapShow, handleExportMapClose } = props

  const handleSubmit = (event) => {
    handleExportMapClose(event)
  };

  const handleClosing = (event) => {
    handleExportMapClose(event)
  };

  return (
    <div>
      <Modal centered show={exportMapShow} onHide={handleExportMapClose}>
        <Modal.Header closeButton>
          <Modal.Title>Export Map?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to export this map?</p>
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