import React, { useState } from 'react'
import { Button } from 'react-bootstrap';
import { ChatRightText, Send } from 'react-bootstrap-icons';
import CommentCard from './CommentCard';

export default function RightSideBar() {
  const [isToggled, setIsToggled] = useState(false);
  const [textInput, setTextInput] = useState('');

  function toggleSideBar(event) {
    event.preventDefault();
    setIsToggled(!isToggled);
  }

  const handleInputChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleSubmit = () => {
    console.log('Comment Entered:', textInput);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className={`d-flex ${isToggled ? 'toggled' : ''}`} id="right-wrapper">
      <nav className="navbar">
        <button className="btn btn-light" id="right-menu-toggle" onClick={toggleSideBar}>
          <ChatRightText style={{ marginLeft: '-8px', marginBottom: '4px' }} />
        </button>
      </nav>

      <div className="bg-light border-left" id="right-sidebar-wrapper">
        <div className="list-group">
          <p className="list-group-item list-group-item-action bg-light">Comments</p>
          <div className="list-group-item list-group-item-action bg-light custom-scrollbar" style={{ overflow: "auto", maxHeight: "83vh" }}>
            <CommentCard />
            <CommentCard />
            <CommentCard />
            <CommentCard />
            <CommentCard />
            <CommentCard />
            <CommentCard />
            <CommentCard />
            <CommentCard />
            <CommentCard />
            <CommentCard />
            <CommentCard />
            <CommentCard />
            <CommentCard />
          </div>
          
          <div className="row">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Comment"
                value={textInput}
                onChange={handleInputChange}
                style={{ marginLeft: "10px", marginTop: "10px", width: '16vw', height: '40px' }}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="col-md-4">
              <Button
                className="btn btn-primary btn-block"
                onClick={handleSubmit}
                style={{ marginLeft: "35px", marginTop: "10px" }}
              >
                <Send />
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}