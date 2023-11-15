import React from 'react'
import '../../App.css'
import './AppBanner.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import GeoCraftLogo from '.././Icons/GeoCraftGlobeWhite.png';
import { useState, useRef } from 'react';
import { Button, Dropdown} from 'react-bootstrap';
import { Person } from 'react-bootstrap-icons';


export default function AppBanner() {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState('Map Name Double Click to Edit');
  const inputRef = useRef();

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const handleBlur = () => {
    handleSave();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logging out...');
  };

  const handleCreateAccount = () => {
    // Handle create account logic
    console.log('Creating a new account...');
  };

  const handleLogoClick = () => {
    // Handle create account logic
    console.log('Clicked the Logo...');
  };


  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark app-banner">

      {isEditing ? (
          <div className="float-left name-input">
            <input
              ref={inputRef}
              type="text"
              className="form-control"
              value={text}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
          </div>
        ) : (
          <p className="navbar-brand banner-edit" 
            onDoubleClick={handleDoubleClick}  
          >
            {text}
          </p>
        )}

      <Button 
        className="navbar-brand .banner-button btn btn-dark mx-auto home-button" 
        onClick={handleLogoClick}
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
          <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
          <Dropdown.Item onClick={handleCreateAccount}>Create New Account</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </nav>
  )
}