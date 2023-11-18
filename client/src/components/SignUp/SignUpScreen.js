import { React, useState, useContext } from "react";
import AuthContext from '../../auth'
import "./SignUpScreen.scss";
import AppBanner from "../AppBanner/AppBanner";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";

export default function SignUpScreen() {
  const { auth } = useContext(AuthContext);
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
      const formData = new FormData(event.currentTarget);
      auth.registerUser(
        formData.get('firstName'),
        formData.get('lastName'),
        formData.get('username'),
        formData.get('email'),
        formData.get('confirmEmail'),
        formData.get('password'),
        formData.get('confirmPassword'),
      );
      // console.log(formData.get('firstName'));
      // console.log(formData.get('lastName'));
      // console.log(formData.get('username'));
      // console.log(formData.get('email'));
      // console.log(formData.get('confirmEmail'));
      // console.log(formData.get('password'));
      // console.log(formData.get('confirmPassword'));
    }

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
              <Form.Control className="name" name='firstName' required type="text" placeholder="First Name" size="lg" />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Control className="last-name" name='lastName' required type="text" placeholder="Last Name" size="lg" />
            </Form.Group>
          </Row>
          <br />
          <Row>
            <Form.Group>
              <Form.Control className="sign-up-item" name='username' required type="text" placeholder="Username" size="lg" />
            </Form.Group>
          </Row>
          <br />
          <Row>
            <Form.Group>
              <Form.Control className="sign-up-item" name='email' required type="email" placeholder="Email" size="lg" />
            </Form.Group>
          </Row>
          <br />
          <Row>
            <Form.Group>
              <Form.Control className="sign-up-item" name='confirmEmail' required type="email" placeholder="Confirm Email" size="lg" />
            </Form.Group>
          </Row>
          <br />
          <Row>
            <Form.Group>
              <Form.Control className="sign-up-item" name='password' required type="password" placeholder="Password" size="lg" />
            </Form.Group>
          </Row>
          <br />
          <Row>
            <Form.Group>
              <Form.Control className="sign-up-item" name='confirmPassword' required type="password" placeholder="Confirm Password" size="lg" />
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