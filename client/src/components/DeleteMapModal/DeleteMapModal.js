import React, { useContext } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import GlobalStoreContext from "../../store";

export default function DeleteMapModal(props) {
  const { deleteMapShow, handleDeleteMapClose } = props
  const { store } = useContext(GlobalStoreContext);

  const handleSubmit = (event) => {
    event.stopPropagation()
    handleDeleteMapClose(event)
    store.deleteMap()
  };

  const handleClosing = (event) => {
    handleDeleteMapClose(event)
    store.loadIdNamePairs()
  }

  return (
    <div>
      <Modal centered show={deleteMapShow} onHide={handleDeleteMapClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Map?</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Are you sure you want to delete this map?</p>
          <p>This cannot be undone.</p>
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