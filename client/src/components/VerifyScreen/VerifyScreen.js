import { React, useState } from "react";
import "./VerifyScreen.scss";
import AppBanner from "../AppBanner/AppBanner";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";

export default function VerifyScreen() {
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
      navigate("/confirm")
    }
  }
  return (
    <div>
      <AppBanner />
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
      </div>
    </div>
  )
}