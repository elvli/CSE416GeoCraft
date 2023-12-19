import React, { useContext } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import GlobalStoreContext from "../../store";

export default function PublishMapModal(props) {
  const { publishMapShow, handlePublishMapClose } = props
  const { store } = useContext(GlobalStoreContext);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    let map = store.currentList;
    map.published = true;

    store.updateLikeDislike(map._id, map);
    handlePublishMapClose();

    navigate("/");
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