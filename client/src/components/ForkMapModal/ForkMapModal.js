import React from "react";
import "./ForkMapModal.scss";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useContext } from "react";
import GlobalStoreContext from "../../store";
export default function ForkMapModal(props) {
  const { forkMapShow, handleForkMapClose } = props
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
      store.forkMap(
        formData.get("mapName"),
      )
      handleForkMapClose(event)
    }
  };
  const handleClosing = (event) => {
    setValidated(false);
    handleForkMapClose(event)
  }

  return (
    <div>
      <Modal centered show={forkMapShow} onHide={handleForkMapClose}>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Fork Map?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Enter the new name for the forked map:</Form.Label>
              <Form.Control className="map-name" name='mapName' required type="text" placeholder="Newly Forked Map Name" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            <Button variant="secondary" onClick={handleClosing}>
              Close
            </Button>
            <Form.Group>
              <Button variant="primary" type="submit">
                Confirm
              </Button>
            </Form.Group>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>

  )
}