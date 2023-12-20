import React, { useState, useContext } from 'react'
import { Button } from 'react-bootstrap';
import { ChatRightText, Send } from 'react-bootstrap-icons'; import { CommentCard } from '../../components';
import AuthContext from '../../auth'
import { GlobalStoreContext } from '../../store';
import "./RightSideBar.scss";

export default function RightSideBar(props) {
  const { isRightSidebarToggled, toggleRightSidebar } = props;
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  // const [isToggled, setIsToggled] = useState(false);
  const [textInput, setTextInput] = useState('');


  // function toggleSideBar(event) {
  //   event.preventDefault();
  //   setIsToggled(!isToggled);
  // }

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

  const handleReply = (user) => (event) => {
    setTextInput("@" + user + ' ')
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
          profilePicture={userComment.profilePicture}
          handleReply={handleReply}
        />
      ))
  }

  return (
    <div className={`d-flex ${isRightSidebarToggled ? 'toggled' : ''}`} id="right-wrapper">
      <nav className="navbar">
        <button className="btn btn-light" id="right-menu-toggle" onClick={toggleRightSidebar}>
          <ChatRightText style={{ marginLeft: '-8px', marginBottom: '4px' }} />
        </button>
      </nav>

      <div className="bg-light border-left" id="right-sidebar-wrapper">
        <div className="list-group">
          <p className="list-group-item bg-light">Comments</p>
          <div className="list-group-item bg-light custom-scrollbar-right-sidebar">
            {comments}
          </div>

          <div className="row">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control rightside-comment"
                id="comment-form-control"
                placeholder="Comment"
                value={textInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={!auth.loggedIn}
                maxLength={'150'}
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