import {React, useState} from "react";
import "./VerifyScreen.scss";
import AppBanner from "../AppBanner/AppBanner";
import App from "../../App";
import Form  from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


export default function VerifyScreen() {
    const [validated, setValidated] = useState(false)
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        setValidated(true);
      };
    return(
        <div>
            <AppBanner/>
            <div className="verify-screen">
                <Row className="rows">
                    <h1>Password Reset</h1>
                    <p>Enter your email, we'll send you a code</p>
                </Row>
                <br/>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Control className="verify-item" required type="email" placeholder="Email" size="lg"/>
                    </Form.Group>
                    <br/> <br/>
                    <Form.Group>
                        <Button className="verify-button" type="submit">Next</Button>
                    </Form.Group>
                </Form>
            </div>
        </div>
    )
}