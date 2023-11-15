import React from "react";
//import "./SaveAndExitModal.scss";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function SaveAndExitModal(props) {
  const { saveAndExitShow, handlesaveAndExitShowClose } = props
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    navigate("/")

    
  };
  const handleClosing = (event) => {
    event.preventDefault();
    event.stopPropagation();
    navigate("/")
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
            <Button variant="primary" onClick={handleSubmit}>
              Yes
            </Button>
          </Form.Group>
        </Modal.Footer>
      </Modal>
    </div>

  )
}