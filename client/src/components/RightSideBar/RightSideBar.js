import React, { useState } from 'react'
import { Button } from 'react-bootstrap';
import { ChatRightText, Send } from 'react-bootstrap-icons';
import CommentCard from '../CommentCard/CommentCard';
import "./RightSideBar.scss";

export default function RightSideBar() {
  const [isToggled, setIsToggled] = useState(false);
  const [textInput, setTextInput] = useState('');

  function toggleSideBar(event) {
    event.preventDefault();
    setIsToggled(!isToggled);
  }

  const handleInputChange = (event) => {
    setTextInput(event.target.value);
  }

  const handleSubmit = () => {
    console.log('Comment Entered:', textInput);
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }

  return (
    <div className={`d-flex ${isToggled ? 'toggled' : ''}`} id="right-wrapper">
      <nav className="navbar">
        <button className="btn btn-light" id="right-menu-toggle" onClick={toggleSideBar}>
          <ChatRightText style={{ marginLeft: '-8px', marginBottom: '4px' }} />
        </button>
      </nav>

      <div className="bg-light border-left" id="right-sidebar-wrapper">
        <div className="list-group">
          <p className="list-group-item bg-light">Comments</p>
          <div className="list-group-item bg-light custom-scrollbar">
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
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="col-md-4">
              <Button className="btn-primary comment-btn" onClick={handleSubmit}>
                <Send />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}