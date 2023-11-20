import { React, useState, useContext } from "react";
import AuthContext from '../../auth'
import AppBanner from "../AppBanner/AppBanner";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import GeoCraftLogoBlack from '../Icons/GeoCraftLogoBlack.png'
import "./LoginScreen.scss";

export default function LoginScreen() {
  const { auth } = useContext(AuthContext);
  const [validated, setValidated] = useState(false);
  // const [validMSG, setValidMSG] = useState("");
  const navigate = useNavigate();

  if (auth.loggedIn){
    navigate("/");
  }

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
    // setValidMSG("Incorrect username or password. Try again or click Forgot password to reset.");
  }

  return (
    <div className="login-screen">
      <div>
        <AppBanner />
      </div>
      <img src={GeoCraftLogoBlack} alt="Geocraft Logo" className="sign-in-logo" />
      <div>
        <Form className="login-credentials" noValidate validated={validated} onSubmit={handleSubmit}>
          <h1 className="heading">Sign In</h1>
          <br />
          <Form.Group>
            <Form.Control required className="form-items" name="email" type="email" placeholder="Email" size="lg" />
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Control required className="form-items" name="password" type="password" placeholder="Password" size="lg" />
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
    </div>
  )
}