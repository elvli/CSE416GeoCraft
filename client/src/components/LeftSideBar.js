import React, { useState } from 'react'
import { Button, Dropdown } from 'react-bootstrap';
import { Pencil, PeopleFill, PersonFill, Plus, FunnelFill } from 'react-bootstrap-icons';
import '../App.css'

export default function LeftSideBar() {
  const [isToggled, setIsToggled] = useState(false);

  function toggleSideBar(event) {
    event.preventDefault();
    setIsToggled(!isToggled);
  }

  return (
    <div className={`d-flex ${isToggled ? 'toggled' : ''}`} id="left-wrapper">
      <div className="bg-light border-right" id="left-sidebar-wrapper">
        <div className="list-group list-group-flush" style={{ marginTop: '2px', marginBottom: '2px', justifyContent: "space-between" }}>
          <div>
            <Button className='btn list-button btn-light' style={{ width: "5vw", height: "5vh", transform: "translate(-15%, 0%)" }}>
              <Plus style={{ width: "2vw", height: "3vh" }} />
            </Button>
            <Button className='btn list-button btn-light' style={{ width: "5vw", height: "5vh", transform: "translate(0%, 0%)" }}>
              <PeopleFill style={{ width: "2vw", height: "3vh" }} />
            </Button>
            <Button className='btn list-button btn-light' style={{ width: "5vw", height: "5vh", transform: "translate(15%, 0%)" }}>
              <PersonFill style={{ width: "2vw", height: "3vh" }} />
            </Button>
          </div>

          <div>
            <div>
              <input type="search" id="form1" className="form-control" placeholder="Type query" aria-label="Search" style={{ marginTop: '4px', marginLeft: '8px', width: '12.5vw' }} />
            </div>

            <Dropdown className='position-fixed' style={{ width: 'width: "20%"', transform: "translate(489%, -105%)", textAlign: 'right', marginTop: '2px', marginLeft: '-8px'}}>
              <Dropdown.Toggle variant="light" id="dropdown-basic">
                <FunnelFill />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>Sort by date (newest to oldest)</Dropdown.Item>
                <Dropdown.Item>Sort by date (oldest to newest)</Dropdown.Item>
                <Dropdown.Item>Most popular</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>

      <nav className="navbar">
        <button className="btn btn-light" id="left-menu-toggle" onClick={toggleSideBar}>
          <Pencil style={{ marginLeft: '-8px', marginBottom: '4px' }} />
        </button>
      </nav>
    </div>

  )
}