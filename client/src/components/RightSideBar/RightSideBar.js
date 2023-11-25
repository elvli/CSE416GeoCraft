import React, { useState, useContext, useEffect } from 'react'
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

  useEffect(() => {
    store.loadIdNamePairs();
  }, []);

  const handleInputChange = (event) => {
    setTextInput(event.target.value);
  }

  const handleSubmit = (event) => {
      if (textInput === '' || !store.currentList) {
          return;
      }
      store.addComment(textInput, auth.user);
      setTextInput("")
  }

  const handleReply = (argument) => (event) => {
    console.log(argument)
    setTextInput("@" + argument)
}

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }

  let comments = ""
  if (store.currentList && store.currentList.comments) {
      comments =
          store.currentList.comments.map((userComment, index) => (
                  <CommentCard
                      user={userComment.user}
                      comment={userComment.comment}
                      count={index}
                      map={store.currentList}
                      handleReply={handleReply}
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
              <Button className="btn-primary comment-btn" onClick={handleSubmit} disabled={!auth.loggedIn}>
                <Send />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}