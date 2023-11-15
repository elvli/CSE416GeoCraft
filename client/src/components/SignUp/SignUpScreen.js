import { React, useState } from "react";
import "./SignUpScreen.scss";
import AppBanner from "../AppBanner/AppBanner";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function SignUpScreen() {
  const [validated, setValidated] = useState(false)
  
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };

  return (
    <div>
      <AppBanner />
      <div className="sign-up-screen">
        <h1 className="heading">Sign Up</h1>
        <br />
        <br />
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Form.Group as={Col}>
              <Form.Control className="name" required type="text" placeholder="First Name" size="lg" />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Control className="name" required type="text" placeholder="Last Name" size="lg" />
            </Form.Group>
          </Row>
          <br />
          <Row>
            <Form.Group>
              <Form.Control className="sign-up-item" required type="text" placeholder="Username" size="lg" />
            </Form.Group>
          </Row>
          <br />
          <Row>
            <Form.Group>
              <Form.Control className="sign-up-item" required type="email" placeholder="Email" size="lg" />
            </Form.Group>
          </Row>
          <br />
          <Row>
            <Form.Group>
              <Form.Control className="sign-up-item" required type="email" placeholder="Confirm Email" size="lg" />
            </Form.Group>
          </Row>
          <br />
          <Row>
            <Form.Group>
              <Form.Control className="sign-up-item" required type="password" placeholder="Password" size="lg" />
            </Form.Group>
          </Row>
          <br />
          <Row>
            <Form.Group>
              <Form.Control className="sign-up-item" required type="password" placeholder="Confirm Password" size="lg" />
            </Form.Group>
          </Row>
          <br />
          <br />
          <Row>
            <Form.Group>
              <Button className="sign-up-button" type="submit">Sign In</Button>
            </Form.Group>
          </Row>
        </Form>
      </div>
    </div>
  )
}