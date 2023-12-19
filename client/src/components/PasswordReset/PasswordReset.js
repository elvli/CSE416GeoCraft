import { React, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Row, Container } from 'react-bootstrap';
import GeoCraftLogoBlack from '../Images/GeoCraftLogoBlack.png'
import AuthContext from '../../auth'
import "./PasswordReset.scss";

export default function PasswordReset() {
  const { auth } = useContext(AuthContext);
  const [validated, setValidated] = useState(false)
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState(false)
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
      setEmailSent(false)
    }
    else {
      event.preventDefault();
      event.stopPropagation();
      const formData = new FormData(event.currentTarget);
      auth.createEmailLink(formData.get('email'))
      setEmailSent(true)
    }
  }
  
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 background-container">
      <Card className="sign-up-screen">
        <Card.Body>
          <img src={GeoCraftLogoBlack} alt="GeoCraft Logo" className="sign-in-logo" />
          <Container>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row className="rows">
                <h1>Password Reset</h1>
                <p>Enter your email, we'll send you a link</p>
              </Row>
            <br />
              <Row>
                <Form.Group>
                  <Form.Control name="email" required type="email" placeholder="Email" size="lg" />
                  {emailSent != '' && <div className="sign-up-error-message text-success">A password reset link has been sent to your gmail.</div>}
                </Form.Group>
              </Row>
              <Row>
                <Form.Group>
                  <Button className="password-reset-button" type="submit">Next</Button>
                </Form.Group>
              </Row>
            </Form>
          </Container>
        </Card.Body>
      </Card>
    </div>
  )
}