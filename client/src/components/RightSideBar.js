import React, { useState } from 'react'
import { ChatRightText } from 'react-bootstrap-icons';


export default function RightSideBar() {
  const [isToggled, setIsToggled] = useState(false);

  function toggleSideBar(event) {
    event.preventDefault();
    setIsToggled(!isToggled);
  }


  return (
    <div className={`d-flex ${isToggled ? 'toggled' : ''}`} id="right-wrapper">
      <nav className="navbar">
        <button className="btn btn-light" id="right-menu-toggle" onClick={toggleSideBar}>
          <ChatRightText style={{ marginLeft: '-8px', marginBottom: '4px' }} />
        </button>
      </nav>

      <div className="bg-light border-left" id="right-sidebar-wrapper">
        {/* <div className="left-sidebar-heading">Menu</div> */}
        <div className="list-group list-group-flush">
          <p className="list-group-item list-group-item-action bg-light">Comments</p>
          <p className="list-group-item list-group-item-action bg-light">Sample Text</p>
        </div>
      </div>
    </div>
  )
}