import React from "react";
import "./RemoveGeoJsonModal.scss";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import GlobalStoreContext from "../../store";
import { useContext } from "react";

export default function RemoveGeoJsonModal(props) {
  const { removeGeoShow, handleRemoveGeoShowClose, removeGeo } = props
  const { store } = useContext(GlobalStoreContext);
  const handleSubmit = (event) => {
    event.stopPropagation()
    removeGeo()
    handleRemoveGeoShowClose(event)
  };

  const handleClosing = (event) => {
    handleRemoveGeoShowClose(event)
  }

  return (
    <div>
      <Modal centered show={removeGeoShow} onHide={handleRemoveGeoShowClose}>
        <Modal.Header closeButton>
          <Modal.Title>Remove GeoJson Data?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to remove the GeoJSON data? This action cannot be undone.</p>
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