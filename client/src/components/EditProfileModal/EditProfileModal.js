import React from "react";
import { useState, useContext } from "react";
import { Form, Button, Modal, Row, Col } from "react-bootstrap";
import AuthContext from '../../auth'
import "./EditProfileModal.scss";

export default function EditProfileModal(props) {
  const { editProfileShow, handleEditProfileClose } = props;
  const { auth } = useContext(AuthContext);
  const [validated, setValidated] = useState(false);
  const currentFirstName = auth.getFirstName();
  const currentLastName = auth.getLastName();
  const currentEmail = auth.getEmail();
  const currentUsername = auth.getUsername();
  const currentAboutMe = auth.getAboutMe();

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
            <Form.Label>Change first name</Form.Label>
            <Row>
              <Form.Group as={Col}>
                <Form.Control
                  className="map-name"
                  name="newFirstName"
                  type="text"
                  defaultValue={currentFirstName}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Control
                  className="map-name"
                  name="newLastName"
                  type="text"
                  defaultValue={currentLastName}
                />
              </Form.Group>
            </Row>

            <Form.Group>
              <Form.Label>Change email</Form.Label>
              <Form.Control
                className="map-name"
                name="newUsername"
                type="text"
                defaultValue={currentEmail}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Change username</Form.Label>
              <Form.Control
                className="map-name"
                name="newUsername"
                type="text"
                defaultValue={currentUsername}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Change profile banner</Form.Label>
              <Form.Select name="profileBanner">
                <option value="">Choose a color for your profile banner</option>
                <option value="Red">Red</option>
                <option value="Orange">Orange</option>
                <option value="Yellow">Yellow</option>
                <option value="Green">Green</option>
                <option value="Blue">Blue</option>
                <option value="Indigo">Indigo</option>
                <option value="Purple">Violet</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>Change about me</Form.Label>
              <Form.Control
                as="textarea"
                rows="4"
                className="map-name"
                name="aboutMe"
                defaultValue={currentAboutMe}
                readOnly // Add the readOnly attribute
                style={{ resize: "none" }} // Add the style to prevent resizing
              />
            </Form.Group>

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
