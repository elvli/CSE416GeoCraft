import React from 'react'
import '../../App.css'
import './AppBanner.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import GeoCraftLogo from '.././Icons/GeoCraftGlobeWhite.png';
// import { useState, useRef } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { Person } from 'react-bootstrap-icons';
// import { Navigate, useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom";


export default function AppBanner() {
  // const [text, setText] = useState('USA Map');
  // const [goToLogin, setGoToLogin] = useState(false)
  // const [createAccount, setCreateAccount] = useState(false)
  // const [toEdit, setToEdit] = useState(false);
  // const [toProfile, setGoToProfile] = useState(false);
  // const navigate = useNavigate();

  // function onClickfoo(event) {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   setToEdit(false)
  // }
  // if (toEdit) {
  //   setToEdit(false)
  //   window.location.href = "/";
  //   // navigate('/')  ****** READ ME READ ME navigate() will leave two entries in history, meaning
  //   // you would have to click back twice to get to the original page. This might not be relevant later
  //   // because we would 
  // }
  // if (goToLogin) {
  //   setGoToLogin(false)
  //   // return <Navigate to="/login" />
  //   window.location.href = "/login";
  // }
  // if (createAccount) {
  //   setCreateAccount(false)
  //   // return <Navigate to="/sign-up" />
  //   window.location.href = "/sign-up";
  // }
  // if (toProfile) {
  //   setGoToProfile(false)
  //   // navigate("/profile");
  //   window.location.href = "/profile";
  // }

  // const handleLogout = () => {
  //   // Handle logout logic
  //   console.log('Logging out...');
  // };

  // const handleCreateAccount = () => {
  //   // Handle create account logic
  //   console.log('Creating a new account...');
  // };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top app-banner">
      <p className="navbar-brand banner-edit">
        {"USA Map"}
      </p>
      <Link to='/'>
        <Button
          className="navbar-brand .banner-button btn btn-dark mx-auto home-button"
        // onClick={() => { setToEdit(true) }}
        >
          <img src={GeoCraftLogo}
            alt="GeoCraft Logo"
            className="banner-logo img-fluid"
            style={{ maxHeight: '4vh' }}
          />
        </Button>
      </Link>
      <Dropdown className="position-fixed account-dropdown">
        <Dropdown.Toggle variant="dark" id="dropdown-basic">
          <Person className="fs-4" />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {/* <Dropdown.Item onClick={() => { setGoToProfile(true) }}>My Profile</Dropdown.Item>
          <Dropdown.Item onClick={() => { setGoToLogin(true) }}>Log In</Dropdown.Item>
          <Dropdown.Item onClick={() => { setGoToLogin(true) }}>Log Out</Dropdown.Item>
          <Dropdown.Item onClick={() => { setCreateAccount(true) }}>Create New Account</Dropdown.Item> */}

          <Dropdown.Item><Link className="dropdown-btn" to='/profile'>My Profile</Link></Dropdown.Item>
          <Dropdown.Item><Link class="dropdown-btn" to='/login'>Log In</Link></Dropdown.Item>
          <Dropdown.Item><Link class="dropdown-btn" to='/login'>Log Out</Link></Dropdown.Item>
          <Dropdown.Item><Link class="dropdown-btn" to='/sign-up'>Create New Account</Link></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </nav>
  )
}