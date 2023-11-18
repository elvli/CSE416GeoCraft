import React from "react";
import "./LoginScreen.scss";
import AppBanner from "../AppBanner/AppBanner";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import GeoCraftLogoBlack from '../Icons/GeoCraftLogoBlack.png'
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function LoginScreen() {
  const [toEdit, setToEdit] = useState(false);
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
      navigate("/");
    }
  };

  const handleGuest = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    navigate("/");
  }

  return (
    <div className="login-screen">
      <div>
        <AppBanner />
      </div>
      <img src={GeoCraftLogoBlack} className="sign-in-logo" />
      <div>
        <Form className="login-credentials" noValidate validated={validated} onSubmit={handleSubmit}>
          <h1 className="heading">Sign In</h1>
          <br />
          <Form.Group>
            <Form.Control required className="form-items" type="email" placeholder="Email" size="lg" />
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Control required className="form-items" type="password" placeholder="Password" size="lg" />
          </Form.Group>
          <br />
          <div className="register">
            <div className="register-items">
              <a href="/password-reset">Trouble Signing in? Click here.</a>
            </div>
            <div className="register-items">
              <a href="/sign-up">Sign Up</a>
            </div>

          </div>
          <br />
          <Form.Group>
            <Button className="form-button" type="submit">Sign In</Button>
          </Form.Group>
          
        </Form>
            <Button className="guest-button" onClick={handleGuest}>Continue as Guest</Button>
      </div>
    </div>
  )
}