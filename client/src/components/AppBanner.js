import React from 'react'
import '../App.css'
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import GeoCraftLogo from './Icons/GeoCraftGlobeWhite.png';
import { Person } from 'react-bootstrap-icons';


export default function AppBanner() {
    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark app-banner">
          <p className="navbar-brand">GeoCraft</p>
          <Button className="navbar-brand .banner-button btn btn-dark">
            <img src={GeoCraftLogo} 
              alt="GeoCraft Logo" 
              className="banner-logo img-fluid" 
              style={{ maxHeight: '5vh'}}
            />
          </Button>

          <Button className="navbar-brand .banner-button btn btn-dark banner-button">
            <Person style={{ fontSize: '3vh', float: 'right' }}/>
          </Button>
        </nav>
    )
}