import React from "react";
import "./LoginScreen.scss"
import AppBanner from "../AppBanner";
import App from "../../App";
import Form  from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function LoginScreen () {
    return(
        <div className="login-screen">
            <div>
                <AppBanner/>
            </div>
            <div>
                <Form className="login-credentials">
                    <h1 className="heading">Sign In</h1>
                    <br/>
                    <br/>
                    <Form.Group>
                        <Form.Control className="form-items" type="email" placeholder="Email" size="lg"/>
                    </Form.Group>
                    <br/>
                    <Form.Group>
                        <Form.Control className="form-items"  type="password" placeholder="Password" size="lg"/>
                    </Form.Group>
                    <br/>
                    <div className="register">
                        <div className="register-items">
                            <a href="#!">Trouble Signing in? Click here.</a>
                        </div>
                        <div className= "register-items">
                            <a href="#!">Sign Up</a>
                        </div>
                        
                        
                    </div>
                    <br/>
                    <Form.Group>
                        <Button className="form-button" type="submit">Sign In</Button>
                    </Form.Group>
                </Form>
            </div>
        </div>
    )
}