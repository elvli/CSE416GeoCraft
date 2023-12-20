import React from "react";
import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Modal, Row, Col } from "react-bootstrap";
import AuthContext from '../../auth'
import GlobalStoreContext from "../../store";
import { SketchPicker } from 'react-color';
import "./EditProfileModal.scss";

export default function EditProfileModal(props) {
  const { aboutMeText, editProfileShow, handleEditProfileClose } = props;
  const { auth } = useContext(AuthContext);
  const { store } = useContext(GlobalStoreContext);
  const [validated, setValidated] = useState(false);
  const currentFirstName = auth.getFirstName();
  const currentLastName = auth.getLastName();
  const currentEmail = auth.getEmail();
  const currentUsername = auth.getUsername();
  const currentAboutMe = auth.getAboutMe();
  const navigate = useNavigate();
  const { username } = useParams();
  const [color, setColor] = useState('#ffffff');

  useEffect(() => {
    const fetchColor = async () => {
      try {
        const result = await auth.getColor(username);
        setColor(result || ''); // If result is falsy, set an empty string
      } catch (error) {
        console.error(error);
      }
    };

    fetchColor();
  }, []);

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
      const user = {
        firstName: formData.get("changeFirstName"),
        lastName: formData.get("changeLastName"),
        color: color,
        aboutMe: formData.get("changeAboutMe")
      }

      auth.updateUser(user);
      store.updateMultipleMaps({
        current: currentUsername,
        // username: formData.get("changeUsername"),
        // email: formData.get("changeEmail"),
      })

      handleEditProfileClose(event);

      // let username = formData.get("changeUsername")
      // navigate(`/profile/${username}`)
    }
  };
  const handleClosing = (event) => {
    setValidated(false);
    handleEditProfileClose(event);

  };

  const handleColorChange = (newColor) => {
    setColor(newColor.hex);
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
                  name="changeFirstName"
                  type="text"
                  defaultValue={currentFirstName}
                />
              </Form.Group>
              </Row>

              <Row>
              <Form.Label>Change last name</Form.Label>
              <Form.Group as={Col}>
                <Form.Control
                  className="map-name"
                  name="changeLastName"
                  type="text"
                  defaultValue={currentLastName}
                />
              </Form.Group>
            </Row>
            {/* 
            <Form.Group>
              <Form.Label>Change email</Form.Label>

              <Form.Control
                className="map-name"
                name="changeEmail"
                type="text"
                defaultValue={currentEmail}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Change username</Form.Label>

              <Form.Control
                className="map-name"
                name="changeUsername"
                type="text"
                defaultValue={currentUsername}
              />
            </Form.Group> */}
            <Form.Group>
              <Form.Label>Change profile banner color</Form.Label>
              <SketchPicker color={color} onChange={handleColorChange}/>
            </Form.Group>

            <Form.Group>
              <Form.Label><div style={{ marginTop: "10px" }}>Change about me</div></Form.Label>

              <textarea
                className="map-name form-control"
                name="changeAboutMe"
                defaultValue={(username === auth.getUsername()) ? auth.user.aboutMe : aboutMeText}
                style={{ resize: "none" }} // Add the style to prevent resizing
                maxLength={'100'}
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
