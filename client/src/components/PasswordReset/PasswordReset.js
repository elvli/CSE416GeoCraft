import { React, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Row } from 'react-bootstrap';
import GeoCraftLogoBlack from '../Images/GeoCraftLogoBlack.png'
import AuthContext from '../../auth'
import "./PasswordReset.scss";

export default function PasswordReset() {
  const { auth } = useContext(AuthContext);
  const [validated, setValidated] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.loggedIn) {
      navigate("/");
    }
  });

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
      auth.createEmailLink(formData.get('email'))
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 background-container">
      <Card className="sign-up-screen">
        <Card.Body>
          <img src={GeoCraftLogoBlack} alt="GeoCraft Logo" className="sign-in-logo" />
          <div className="password-reset-screen">
            <Row className="rows">
              <h1>Password Reset</h1>
              <p>Enter your email, we'll send you a code</p>
            </Row>
            <br />
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Control className="password-reset-item" name="email" required type="email" placeholder="Email" size="lg" />

              </Form.Group>
              <br /> <br />
              <Form.Group>
                <Button className="password-reset-button" type="submit">Next</Button>
              </Form.Group>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}