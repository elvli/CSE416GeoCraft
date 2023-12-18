import { React, useState, useContext, useEffect } from "react";
import { Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import AuthContext from '../../auth'
import GeoCraftLogoBlack from '../Images/GeoCraftLogoBlack.png'
import "./LoginScreen.scss";

export default function LoginScreen() {
  const { auth } = useContext(AuthContext);
  const [validated, setValidated] = useState(false);
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
      auth.loginUser(
        formData.get('email'),
        formData.get('password')
      );
    }
  };

  const handleGuest = (event) => {
    event.preventDefault();
    event.stopPropagation();

    navigate("/");
  }

  if (auth.errorMessage !== null) {
    console.log('LOGIN ERR')
  }

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 background-container">
      <Card className="sign-up-screen">
        <Card.Body>
          <div className="login-screen text-center">
            <img src={GeoCraftLogoBlack} alt="Geocraft Logo" />
            <Form className="login-credentials" noValidate validated={validated} onSubmit={handleSubmit}>
              <h1>Sign In</h1>
              <br />
              <Form.Group>
                <Form.Control required className="form-items login-input" name="email" type="email" placeholder="Email" size="lg" />
              </Form.Group>
              <br />
              <Form.Group>
                <Form.Control required className="form-items login-input" name="password" type="password" placeholder="Password" size="lg" />
              </Form.Group>
              {auth.errorMessage !== null && (
                <div className="login-error-message text-danger">
                  Incorrect username or password. Try again or click Forgot password to reset.
                </div>
              )}
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

              <Form.Group>
                <Button className="guest-button" onClick={handleGuest}>Continue as Guest</Button>
              </Form.Group>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}