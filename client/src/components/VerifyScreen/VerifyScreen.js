import { React, useState, useEffect, useContext } from "react";
import { Form, Button, Card, Row} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import AuthContext from '../../auth'
import GeoCraftLogoBlack from '../Images/GeoCraftLogoBlack.png'
import "./VerifyScreen.scss";

export default function VerifyScreen() {
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
      navigate("/confirm")
    }
  }
  
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 background-container">
      <Card className="sign-up-screen">
        <Card.Body>
          <img src={GeoCraftLogoBlack} alt="GeoCraft Logo" className="sign-in-logo" />
          <div className="verify-screen">
            <Row className="rows">
              <h1>Verify Your Code</h1>
              <p>Check your email for the code we sent</p>
            </Row>
            <br />
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Control className="verify-item" required type="code" placeholder="Enter Code" size="lg" />
              </Form.Group>
              <br /> <br />
              <Form.Group>
                <Button className="verify-button" type="submit">Enter</Button>
              </Form.Group>
            </Form>
            <div className="verify-links">
              <div className="verify-items">
                <a href="/password-reset">Resend code? Click here.</a>
              </div>
              <div className="verify-items">
                <a href="/password-reset">Wrong email? Click here.</a>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}