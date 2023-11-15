import { React, useState } from "react";
import "./PasswordReset.scss";
import AppBanner from "../AppBanner/AppBanner";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
import GeoCraftLogoBlack from '../Icons/GeoCraftLogoBlack.png'
import { useNavigate } from "react-router-dom";

export default function PasswordReset() {
  const [validated, setValidated] = useState(false)

  const navigate = useNavigate();
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
      navigate("/verify")
    }
  }
  return (
    <div>
      <AppBanner />
      <img src={GeoCraftLogoBlack} className="sign-in-logo" />
      <div className="password-reset-screen">
        <Row className="rows">
          <h1>Password Reset</h1>
          <p>Enter your email, we'll send you a code</p>
        </Row>
        <br />
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Control className="password-reset-item" required type="email" placeholder="Email" size="lg" />
          </Form.Group>
          <br /> <br />
          <Form.Group>
            <Button className="password-reset-button" type="submit">Next</Button>
          </Form.Group>
        </Form>
      </div>
    </div>
  )
}