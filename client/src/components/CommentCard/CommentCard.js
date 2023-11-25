import React from 'react'
import './CommentCard.scss'
import { useState, useContext } from 'react';
import { PersonCircle } from 'react-bootstrap-icons';
import Card from 'react-bootstrap/Card';
import GlobalStoreContext from "../../store";
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { Button, Dropdown } from "react-bootstrap";
import { HandThumbsUp, HandThumbsDown, ThreeDotsVertical, PenFill, HandThumbsUpFill, HandThumbsDownFill } from 'react-bootstrap-icons';
import AuthContext from '../../auth'
export default function CommentCard(props) {
  const { auth } = useContext(AuthContext);
  const [likeButton, setLikeButton] = useState(false)
  const [dislikeButton, setDislikeButton] = useState(false)
  const { store } = useContext(GlobalStoreContext);
  const { user, comment, likes, dislikes, map, count } = props;
  function handleLike(event) {
    event.stopPropagation();
    store.likeList(auth.user.email, map, auth.user)
  }
  function handleDislike(event) {
      event.stopPropagation();
      store.dislikeList(auth.user.email, map, auth.user)
  }
  return (
    // <div className="card comment-card">
    //   <div className="card-title">
    //     <PersonCircle className="profile-pic-comm" />
    //     <div>
    //       <p className="username">Example User</p>
    //       <div className="card-body" >
    //         <p className="card-text comment-text">Example Comment :P</p>
    //       </div>
    //     </div>
        
    //   </div>

      
    // </div>
    <div>
      <Card>
        <Card.Body>
          <Row>
              <Col xs="auto">
                 <PersonCircle className="profile-pic-comm" />
              </Col>
              <Col>
                <Row>
                  <p className="comment-username">{user}</p>
                </Row>
                <Row>
                  <Card.Text className='comment-text'>
                    {comment}
                  </Card.Text>
                  
                </Row>
                <Row>
                  <Col xs="auto">
                    <Row xs="auto" className='like-comment-number'>
    
                      <Button onClick={handleDislike} className='btn btn-light like-dislike-button' disabled={!auth.loggedIn}>{<HandThumbsUpFill/>}</Button>
                      {likes}
                    </Row>

                  </Col>
                  <Col xs="auto">
                    <Button onClick={handleLike} className='btn btn-light like-dislike-button' disabled={!auth.loggedIn}>{<HandThumbsDownFill/>}</Button>
                  </Col>
                  <Col >
                  <Button className='btn btn-light reply-link' disabled={!auth.loggedIn}>Reply</Button>
                  </Col>
                </Row>
              </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  )
}