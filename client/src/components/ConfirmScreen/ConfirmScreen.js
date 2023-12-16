import { React, useState, useContext } from "react";
import { Form, Button, Card, Row} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import GeoCraftLogoBlack from '../Images/GeoCraftLogoBlack.png'
import "./ConfirmScreen.scss";
import AuthContext from "../../auth";

export default function ConfirmScreen() {
  const [validated, setValidated] = useState(false)
  const [passwordCheck, setPasswordCheck] = useState("");
  const [confirmPassCheck, setConfirmPassCheck] = useState("");
  const [passwordLengthError, setPasswordLengthError] = useState(false);
  const { auth } = useContext(AuthContext);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const { token, id} = useParams()
  const navigate = useNavigate();
  
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false  || passwordLengthError || passwordMatchError) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    }
    else {
      event.preventDefault();
      event.stopPropagation();
      const formData = new FormData(event.currentTarget);
      const response = auth.resetPassword(formData.get('password'), id, token)
        navigate('/login')


    }
  }

  const handlePasswordChange = (event) => {
    const password = event.target.value;
    setPasswordCheck(password);
    setPasswordLengthError(password.length < 8);

    if (password.length < 8) {
      event.target.setCustomValidity(`Password must be at least ${ 8} characters.`);
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

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 background-container">
      <Card className="sign-up-screen">
        <Card.Body>
          <img src={GeoCraftLogoBlack} alt="GeoCraft Logo" className="sign-in-logo" />
          <div className="confirm-screen">
            <Row className="rows">
              <h1>Reset Password</h1>
              <p>Enter your new password</p>
            </Row>
            <br />
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Control className="confirm-item" name='password' required type="password" placeholder="New Password" size="lg" onChange={handlePasswordChange} />
                {passwordLengthError && <div className="sign-up-error-message text-danger">Password must be at least 8 characters.</div>}
              </Form.Group>
              <br />
              <Form.Group>
                <Form.Control className="confirm-item" name='confirmPassword' required type="password" placeholder="Confirm New Password" size="lg" onChange={handleConfirmPasswordChange} />
                {passwordMatchError && <div className="sign-up-error-message text-danger">Passwords do not match.</div>}
              </Form.Group>
              <br /> <br />
              <Form.Group>
                <Button className="confirm-button" type="submit">Enter</Button>
              </Form.Group>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}