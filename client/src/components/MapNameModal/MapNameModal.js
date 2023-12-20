import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useContext } from "react";
import GlobalStoreContext from "../../store";
export default function MapNameModal(props) {
  const { mapNameShow, handleMapNameClose } = props
  const { store } = useContext(GlobalStoreContext);
  const [validated, setValidated] = useState(false)

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
        const map = store.currentList
        map.name = formData.get("mapName");
        store.updateLikeDislike(map._id, map);
        
        handleMapNameClose(event)
      }
  };

  const handleClosing = (event) => {
    setValidated(false);
    handleMapNameClose(event)
  }

  return (
    <div>
      <Modal centered show={mapNameShow} onHide={handleMapNameClose}>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Change Map Name</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Enter the Name of Your Map</Form.Label>
              <Form.Control className="map-name" name="mapName" required type="text" placeholder={store.currentList.name} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClosing}>
              Close
            </Button>
            <Form.Group>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </Form.Group>

          </Modal.Footer>
        </Form>

      </Modal>
    </div>
  )
}