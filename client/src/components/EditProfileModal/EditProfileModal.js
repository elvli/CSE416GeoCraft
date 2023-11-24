import React from "react";
import { useState, useContext } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import GlobalStoreContext from "../../store";
import AuthContext from '../../auth'
import "./EditProfileModal.scss";

export default function EditProfileModal(props) {
  const { editProfileShow, handleEditProfileClose } = props;
  const { auth } = useContext(AuthContext);
  const [validated, setValidated] = useState(false);
  const currentUsername = auth.getUsername();

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      event.stopPropagation();
      const formData = new FormData(event.currentTarget);
      handleEditProfileClose(event);
    }
  };
  const handleClosing = (event) => {
    setValidated(false);
    handleEditProfileClose(event);
  };

  return (
    <div>
      <Modal centered show={editProfileShow} onHide={handleEditProfileClose}>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group>
              <Form.Label>New Username</Form.Label>
              <Form.Control
                className="map-name"
                name="newUsername"
                type="text"
                defaultValue={currentUsername}
              />
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Label>Profile Banner</Form.Label>
              <Form.Select name="profileBanner">
                <option value="">Choose a color for your profile banner</option>
                <option value="Red">Red</option>
                <option value="Orange">Orange</option>
                <option value="Yellow">Yellow</option>
                <option value="Green">Green</option>
                <option value="Blue">Blue</option>
                <option value="Purple">Indigo</option>
                <option value="Purple">Violet</option>
              </Form.Select>
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Label>About Me</Form.Label>
              <Form.Control
                className="map-name"
                name="aboutMe"
                type="text"
                placeholder="About me"
              />
            </Form.Group>
            <br />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClosing}>
              Close
            </Button>
            <Form.Group>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Form.Group>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
