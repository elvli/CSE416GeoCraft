import { React, useContext } from 'react'
import '../../App.css'
import './AppBanner.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthContext from '../../auth'
import GeoCraftLogo from '.././Icons/GeoCraftGlobeWhite.png';
import { Button, Dropdown } from 'react-bootstrap';
import { Person } from 'react-bootstrap-icons';
import { Link } from "react-router-dom";

export default function AppBanner() {
  const { auth } = useContext(AuthContext);
  const username = auth.getUsername() ?  auth.getUsername() : 'Guest';
  
  const handleLogout = () => {
    // Handle logout logic
    console.log('Log out button clicked');
    auth.logoutUser();
  };

  var dropdown = <Dropdown.Menu>
    {/* <Dropdown.Item onClick={() => { setGoToProfile(true) }}>My Profile</Dropdown.Item>
          <Dropdown.Item onClick={() => { setGoToLogin(true) }}>Log In</Dropdown.Item>
          <Dropdown.Item onClick={() => { setGoToLogin(true) }}>Log Out</Dropdown.Item>
          <Dropdown.Item onClick={() => { setCreateAccount(true) }}>Create New Account</Dropdown.Item> */}

    <Dropdown.Item><Link className="dropdown-btn" to='/profile'>My Profile</Link></Dropdown.Item>
    <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
  </Dropdown.Menu>

  if (!auth.loggedIn) {
    dropdown = <Dropdown.Menu>
      {/* <Dropdown.Item onClick={() => { setGoToProfile(true) }}>My Profile</Dropdown.Item>
          <Dropdown.Item onClick={() => { setGoToLogin(true) }}>Log In</Dropdown.Item>
          <Dropdown.Item onClick={() => { setGoToLogin(true) }}>Log Out</Dropdown.Item>
          <Dropdown.Item onClick={() => { setCreateAccount(true) }}>Create New Account</Dropdown.Item> */}
      <Dropdown.Item><Link class="dropdown-btn" to='/login'>Log In</Link></Dropdown.Item>
      <Dropdown.Item><Link class="dropdown-btn" to='/sign-up'>Create New Account</Link></Dropdown.Item>
    </Dropdown.Menu>
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top app-banner">
      <p className="navbar-brand banner-edit">
        {"Map of Italy"}
      </p>
      <Link to='/'>
        <Button
          className="navbar-brand .banner-button btn btn-dark mx-auto home-button"
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
          {/* <div className="appbanner-username">{"Username"}</div> */}
          {username}
          <Person className="fs-4 profile-dropdown" />
        </Dropdown.Toggle>
        {dropdown}
      </Dropdown>
    </nav>
  )
}