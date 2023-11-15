import { React, useState } from "react";
import "./ConfirmScreen.scss";
import AppBanner from "../AppBanner/AppBanner";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";

export default function ConfirmScreen() {
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
      navigate("/login")
    }
  }

  return (
    <div>
      <AppBanner />
      <div className="confirm-screen">
        <Row className="rows">
          <h1>Reset Password</h1>

        </Row>
        <br />
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Control className="confirm-item" required type="password" placeholder="New Password" size="lg" />
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Control className="confirm-item" required type="password" placeholder="Confirm New Password" size="lg" />
          </Form.Group>
          <br /> <br />
          <Form.Group>
            <Button className="confirm-button" type="submit">Enter</Button>
          </Form.Group>
        </Form>
      </div>
    </div>
  )
}