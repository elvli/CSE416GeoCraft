import { React, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col, Button, Card } from 'react-bootstrap';
import AuthContext from '../../auth'
import "./SignUpScreen.scss";

export default function SignUpScreen() {
  const { auth } = useContext(AuthContext);
  const [validated, setValidated] = useState(false);
  const [usernameTakenError, setUsernameTakenError] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [emailTakenError, setEmailTakenError] = useState(false);
  const [emailMatchError, setEmailMatchError] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState("");
  const [confirmPassCheck, setConfirmPassCheck] = useState("");
  const [passwordLengthError, setPasswordLengthError] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false || usernameTakenError || emailTakenError || emailMatchError || passwordLengthError || passwordMatchError) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    }
    else {
      event.preventDefault();
      event.stopPropagation();
      const formData = new FormData(event.currentTarget);
      const aboutMeDefault = "Click edit profile to add an about me.";
      const profilePictureDefault = 'yx196dx8ua5em7hfgc1a';

      auth.registerUser(
        formData.get('firstName'),
        formData.get('lastName'),
        formData.get('username'),
        formData.get('email'),
        formData.get('confirmEmail'),
        formData.get('password'),
        formData.get('confirmPassword'),
        aboutMeDefault,
        profilePictureDefault
      );
    }
  };

  const handleEmailChange = (event) => {
    const email = event.target.value;
    setUserEmail(email);
    setEmailMatchError(confirmEmail !== email);
  };

  const handleConfirmEmailChange = (event) => {
    const confirmEmailInput = event.target.value;
    setConfirmEmail(confirmEmailInput);
    setEmailMatchError(confirmEmailInput !== userEmail);

    if (confirmEmailInput !== userEmail) {
      event.target.setCustomValidity("Emails do not match.")
    }
    else {
      event.target.setCustomValidity('');
    }
  };

  const handlePasswordChange = (event) => {
    const password = event.target.value;
    setPasswordCheck(password);
    setPasswordLengthError(password.length < 8);

    if (password.length < 8) {
      event.target.setCustomValidity(`Password must be at least 8 characters.`);
    }
    else {
      event.target.setCustomValidity('');
    }

    setPasswordMatchError(password !== confirmPassCheck);
  };

  const handleConfirmPasswordChange = (event) => {
    const confirmPass = event.target.value;
    setConfirmPassCheck(confirmPass);
    setPasswordMatchError(passwordCheck !== confirmPass || confirmPass.length < 8);
    if (passwordCheck !== confirmPass) {
      event.target.setCustomValidity('Passwords do not match.');
    } else {
      event.target.setCustomValidity('');
    }
  };

  useEffect(() => {
    if (auth.loggedIn) {
      navigate("/");
    }
  });

  var usernameError = ''
  var emailError = ''
  if (auth.errorMessage) {
    if (auth.errorMessage === 'An account with this username already exists.') {
      usernameError = auth.errorMessage
      emailError = ''
    }
    else {
      emailError = auth.errorMessage
      usernameError = ''
    }

  }



  return (
    <div className="d-flex align-items-center justify-content-center vh-100 background-container">
      <Card className="sign-up-screen">
        <Card.Body>
          <h1 className="heading text-center mb-4">Sign Up</h1>
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
                {usernameError != '' && <div className="sign-up-error-message text-danger">{usernameError}</div>}
              </Form.Group>
            </Row>
            <br />
            <Row>
              <Form.Group>
                <Form.Control className="sign-up-item" name='email' required type="email" placeholder="Email" size="lg" onChange={handleEmailChange} />
                {emailError != '' && <div className="sign-up-error-message text-danger">{emailError}</div>}
              </Form.Group>
            </Row>
            <br />
            <Row>
              <Form.Group>
                <Form.Control className="sign-up-item" name='confirmEmail' required type="email" placeholder="Confirm Email" size="lg" onChange={handleConfirmEmailChange} />
                {emailMatchError && <div className="sign-up-error-message text-danger">Emails do not match.</div>}
              </Form.Group>
            </Row>
            <br />
            <Row>
              <Form.Group>
                <Form.Control className="sign-up-item" name='password' required type="password" placeholder="Password" size="lg" onChange={handlePasswordChange} />
                {passwordLengthError && <div className="sign-up-error-message text-danger">Password must be at least 8 characters.</div>}
              </Form.Group>
            </Row>
            <br />
            <Row>
              <Form.Group>
                <Form.Control className="sign-up-item" name='confirmPassword' required type="password" placeholder="Confirm Password" size="lg" onChange={handleConfirmPasswordChange} />
                {passwordMatchError && <div className="sign-up-error-message text-danger">Passwords do not match.</div>}
              </Form.Group>
            </Row>
            <br />
            <br />
            <Row>
              <Form.Group>
                <Button className="sign-up-button" type="submit">Sign Up</Button>
              </Form.Group>
            </Row>
          </Form>
          <div className="login-ref">
            <a href="/login">Already have an account? Click here.</a>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}