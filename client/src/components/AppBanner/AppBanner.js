import React from 'react'
import '../../App.css'
import './AppBanner.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import GeoCraftLogo from '.././Icons/GeoCraftGlobeWhite.png';
import { useState, useRef } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { Person } from 'react-bootstrap-icons';
import { Navigate } from 'react-router-dom'


export default function AppBanner() {
  const [text, setText] = useState('USA Map');
  const [goToLogin, setGoToLogin] = useState(false)
  const [createAccount, setCreateAccount] = useState(false)
  const [toEdit, setToEdit] = useState(false);
  function onClickfoo(event) {
    event.preventDefault();
    event.stopPropagation();
    setToEdit(true)
  }
  if(toEdit) {
      return <Navigate to="/"/>
  }
  if (goToLogin) {
    // setGoToLogin(false)
    return <Navigate to="/login" />
  }
  if (createAccount) {
    // setGoToLogin(false)
    return <Navigate to="/sign-up" />
  }

  // const handleLogout = () => {
  //   // Handle logout logic
  //   console.log('Logging out...');
  // };

  // const handleCreateAccount = () => {
  //   // Handle create account logic
  //   console.log('Creating a new account...');
  // };

  const handleLogoClick = () => {
    // Handle create account logic
    console.log('Clicked the Logo...');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark app-banner">
      <p className="navbar-brand banner-edit">
        {text}
      </p>

      <Button
        className="navbar-brand .banner-button btn btn-dark mx-auto home-button"
        onClick={onClickfoo}
      >
        <img src={GeoCraftLogo}
          alt="GeoCraft Logo"
          className="banner-logo img-fluid"
          style={{ maxHeight: '4vh' }}
        />
      </Button>

      <Dropdown className="position-fixed account-dropdown">
        <Dropdown.Toggle variant="dark" id="dropdown-basic">
          <Person className="fs-4" />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => { setGoToLogin(true) }}>Log Out</Dropdown.Item>
          <Dropdown.Item onClick={() => { setCreateAccount(true) }}>Create New Account</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </nav>
  )
}