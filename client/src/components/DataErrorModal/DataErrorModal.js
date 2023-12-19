import React from "react";
import { Button, Modal } from "react-bootstrap";

export default function DataErrorModal(props) {
  const { showDataError, handleShowDataErrorClose } = props

  const handleClosing = (event) => {
    handleShowDataErrorClose(event);
  }

  return (
    <div>
      <Modal centered show={showDataError} onHide={handleShowDataErrorClose}>
        <Modal.Header closeButton>
          <Modal.Title>Data value error</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h5>We've dectected one or more invalid data points.</h5>
          <p>All invalid data points have been set to 0.</p>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="secondary" onClick={handleClosing}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}