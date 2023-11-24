import React, { useState, useContext } from 'react'
import { Button } from 'react-bootstrap';
import { ChatRightText, Send } from 'react-bootstrap-icons';
import CommentCard from '../CommentCard/CommentCard';
import "./RightSideBar.scss";
import AuthContext from '../../auth'
import { GlobalStoreContext } from '../../store';

export default function RightSideBar() {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const [isToggled, setIsToggled] = useState(false);
  const [textInput, setTextInput] = useState('');

  function toggleSideBar(event) {
    event.preventDefault();
    setIsToggled(!isToggled);
  }

  const handleInputChange = (event) => {
    setTextInput(event.target.value);
  }

  const handleComment = () => {
    console.log('Comment Entered:', textInput);
    if (event.code === "Enter") {
      if (event.target.value === '' || !store.currentList) {
          return;
      }
      store.addComment(event.target.value, auth.user);
      event.target.value = "";
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }

  let comments = ""
  if (store.currentList && store.currentList.comments) {
      comments =
          store.currentList.comments.map((userComment) => (
                  <CommentCard
                      user={userComment.user}
                      comment={userComment.comment}
                      likes={userComment.likes}
                      dislikes={userComment.dislikes}
                  />
          ))
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
          {comments}
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
                disabled={!auth.loggedIn}
              />
            </div>
            <div className="col-md-4">
              <Button className="btn-primary comment-btn" onSubmit={handleComment} disabled={!auth.loggedIn}>
                <Send />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}