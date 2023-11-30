import React from "react";
//import "./SaveAndExitModal.scss";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import GlobalStoreContext from "../../store";
export default function PublishMapModal(props) {
  const { store } = useContext(GlobalStoreContext);
  const { publishMapShow, handlePublishMapClose } = props
  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    let map = store.currentList;
    map.published = true;
    store.updateLikeDislike(map._id, map);
    handlePublishMapClose()
  };


  return (
    <div>
      <Modal centered show={publishMapShow} onHide={handlePublishMapClose}>
        <Modal.Header closeButton>
          <Modal.Title>Publish Map</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Do you want to publish your map?</p>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="secondary" onClick={handlePublishMapClose}>
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