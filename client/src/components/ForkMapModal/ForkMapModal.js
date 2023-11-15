import React from "react";
import "./ForkMapModal.scss";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function ForkMapModal(props) {
  const { forkMapShow, handleForkMapClose } = props

  const handleSubmit = (event) => {
    handleForkMapClose(event)
  };
  const handleClosing = (event) => {
    handleForkMapClose(event)
  }

  return (
    <div>
      <Modal centered show={forkMapShow} onHide={handleForkMapClose}>
        <Modal.Header closeButton>
          <Modal.Title>Fork Map?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to fork this map?</p>
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