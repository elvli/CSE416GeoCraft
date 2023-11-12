import React, { useState } from 'react'
import { Button, Dropdown } from 'react-bootstrap';
import { PencilFill, PeopleFill, Person, PersonFill, Plus, Filter } from 'react-bootstrap-icons';
import '../App.css'
// import {navbar, nav, button} from 'react-bootstrap'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap-icons/font/bootstrap-icons.css'

export default function LeftSideBar() {
  const [isToggled, setIsToggled] = useState(false);

  function toggleSideBar(event) {
    event.preventDefault();
    setIsToggled(!isToggled);
  }

  return (
    // <div className='row'>
    //     <div className='bg-dark col-auto col-md-3 min-vh-90'>
    //         <a className='text-decoration-none text-white d-flex justify-content-between flex-column'>
    //             <span className='ms-1 fs-4'>Test</span>
    //         </a>
    //         <hr className='text-secondary'/>
    //     </div>
    // </div>
    <div className={`d-flex ${isToggled ? 'toggled' : ''}`} id="left-wrapper">
      <div className="bg-light border-right" id="left-sidebar-wrapper">
        {/* <div className="left-sidebar-heading">Menu</div> */}
        <div className="list-group list-group-flush" style={{justifyContent: "space-between"}}>
          <div>
            <Button className='btn list-button btn-light' style={{width: "5vw", height: "5vh", transform:"translate(-15%, 0%)"}}>
              <Plus style={{width: "2vw", height: "3vh"}}/>
            </Button>
            <Button className='btn list-button btn-light' style={{width: "5vw", height: "5vh", transform:"translate(0%, 0%)"}}>
              <PeopleFill style={{width: "2vw", height: "3vh"}}/>
            </Button>
            <Button className='btn list-button btn-light' style={{width: "5vw", height: "5vh", transform:"translate(15%, 0%)"}}>
              <PersonFill style={{width: "2vw", height: "3vh"}}/>
            </Button>
          </div>
          <div>
            <div>
              <input type="search" id="form1" className="form-control" placeholder="Type query" aria-label="Search" style={{transform:"translate(2%, 0%)", width:'80%'}}/>
            </div>
            <Dropdown className='position-fixed' style={{width:'width: "20%"', transform:"translate(489%, -105%)", textAlign: 'right', marginRight: '4px'}}>
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  <Filter/>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>Sort by date(newest to oldest)</Dropdown.Item>
                  <Dropdown.Item>Sort by date(oldest to newest)</Dropdown.Item>
                  <Dropdown.Item>Most popular</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
          </div>
        </div>
      </div>

      <nav className="navbar">
        <button className="btn btn-light" id="left-menu-toggle" onClick={toggleSideBar}>
          <PencilFill style={{ marginLeft: '-8px', marginBottom: '4px' }} />
        </button>
      </nav>
    </div>

  )
}