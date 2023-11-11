import React, { useState } from 'react'
import { PencilFill } from 'react-bootstrap-icons';
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
        <div className="list-group list-group-flush">
          <p className="list-group-item list-group-item-action bg-light">Options</p>
          <p className="list-group-item list-group-item-action bg-light">Click the pencil to collapse</p>
          <p className="list-group-item list-group-item-action bg-light">Mongo tests are hiding under the sidebar</p>
          <p className="list-group-item list-group-item-action bg-light">collapse to see</p>
          <p className="list-group-item list-group-item-action bg-light">Option</p>
          <p className="list-group-item list-group-item-action bg-light">Option</p>
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