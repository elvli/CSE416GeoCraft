import { React, useContext } from 'react'
import { Link, useLocation } from "react-router-dom";
import { Button, Dropdown } from 'react-bootstrap';
import { GlobalStoreContext } from '../../store'
import AuthContext from '../../auth'
import { Image } from 'cloudinary-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AppBanner.scss'
import GeoCraftLogo from '.././Images/GeoCraftGlobeWhite.png';

export default function AppBanner() {
  const { auth } = useContext(AuthContext);
  const { store } = useContext(GlobalStoreContext);
  const username = auth.getUsername() ? auth.getUsername() : 'Guest';
  const location = useLocation();

  const cloudinaryBaseUrl = "https://res.cloudinary.com/djmyzbhnk/image/upload/";
  const version = "v1702872120/";
  const profilePicture = auth.user ? auth.user.profilePicture : 'yx196dx8ua5em7hfgc1a';

  const handleLogout = () => {
    auth.logoutUser();
  };

  let currentListName = "";
  if (store.currentList && !location.pathname.includes('/profile')) {
    currentListName = store.currentList.name;
  }

  var dropdown = <Dropdown.Menu>
    <Dropdown.Item>
      <Link className="dropdown-btn" to={`/profile/${username}`}>
        My Profile
      </Link>
    </Dropdown.Item>
    <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
  </Dropdown.Menu>

  if (!auth.loggedIn) {
    dropdown = <Dropdown.Menu>
      <Dropdown.Item><Link class="dropdown-btn" to='/login'>Log In</Link></Dropdown.Item>
      <Dropdown.Item><Link class="dropdown-btn" to='/sign-up'>Create New Account</Link></Dropdown.Item>
    </Dropdown.Menu>
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top app-banner">
      <p className="navbar-brand selected-map-name">
        {currentListName}
      </p>
      <Link to='/'>
        <Button className="navbar-brand banner-button btn btn-dark mx-auto home-button" >
          <img src={GeoCraftLogo}
            alt="GeoCraft Logo"
            className="banner-logo img-fluid"
            style={{ maxHeight: '4vh' }}
          />
        </Button>
      </Link>

      <Dropdown className="position-fixed account-dropdown">
        <Dropdown.Toggle variant="dark" id="dropdown-basic">
          {username}
          <Image
            style={{ width: "36px", height: "36px", marginLeft: '10px', borderRadius: '100px', objectFit: "cover" }}
            className="img-fluid rounded-circle"
            cloudName="djmyzbhnk"
            publicId={`${cloudinaryBaseUrl}${version}${profilePicture}`}
          />
        </Dropdown.Toggle>
        {dropdown}
      </Dropdown>
    </nav>
  )
}