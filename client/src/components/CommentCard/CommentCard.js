import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { PersonCircle, HandThumbsUp, HandThumbsDown, HandThumbsUpFill, HandThumbsDownFill } from 'react-bootstrap-icons';
import GlobalStoreContext from '../../store';
import AuthContext from '../../auth';
import './CommentCard.scss';

export default function CommentCard(props) {
  const { user, comment, map, count, handleReply } = props;
  const { auth } = useContext(AuthContext);
  const { store } = useContext(GlobalStoreContext);
  const email = auth.getEmail();


  function handleLike(event) {
    event.stopPropagation();
    const { likes, dislikes } = map.comments[count];
    const userEmail = auth.user.email;
    const likeIndex = likes.indexOf(userEmail);
    const dislikeIndex = dislikes.indexOf(userEmail);

    if (dislikeIndex !== -1) {
      dislikes.splice(dislikeIndex, 1);
    }

    if (likeIndex === -1) {
      likes.push(userEmail);
    }
    else {
      likes.splice(likeIndex, 1);
    }

    store.updateLikeDislike(map._id, map);
  }


  function handleDislike(event) {
    event.stopPropagation();
    const { likes, dislikes } = map.comments[count];
    const userEmail = auth.user.email;
    const likeIndex = likes.indexOf(userEmail);
    const dislikeIndex = dislikes.indexOf(userEmail);

    if (likeIndex !== -1) {
      likes.splice(likeIndex, 1);
    }

    if (dislikeIndex === -1) {
      dislikes.push(userEmail);
    }
    else {
      dislikes.splice(dislikeIndex, 1);
    }

    store.updateLikeDislike(map._id, map);
  }


  return (
    <div>
      <Card>
        <Card.Body>
          <Row>
            <Col xs="auto">
              <PersonCircle className="profile-pic-comm" />
            </Col>
            <Col>
              <Row>
                <p>
                  <Link to={`/profile/${user}`} className="comment-username" onClick={(e) => e.stopPropagation()}>
                    {user}
                  </Link>
                </p>
              </Row>
              <Row>
                <Card.Text className='comment-text'>
                  {comment}
                </Card.Text>

              </Row>
              <Row>
                <Col xs="auto">
                  <Row xs="auto" className='like-comment-number'>
                    <Button
                      onClick={handleLike}
                      className='btn btn-light like-dislike-button'
                      disabled={!auth.loggedIn}
                    >
                      {map.comments && map.comments[count].likes.includes(email) ? (
                        <HandThumbsUpFill className='like-dislike-icon' />
                      ) : (
                        <HandThumbsUp className='like-dislike-icon' />
                      )}

                      {map.comments ? map.comments[count].likes.length : null}
                    </Button>
                  </Row>

                </Col>
                <Col xs="auto">
                  <Row xs="auto" className='like-comment-number'>
                    <Button
                      onClick={handleDislike}
                      className='btn btn-light like-dislike-button'
                      disabled={!auth.loggedIn}
                    >
                      {map.comments && map.comments[count].dislikes.includes(email) ? (
                        <HandThumbsDownFill className='like-dislike-icon' />
                      ) : (
                        <HandThumbsDown className='like-dislike-icon' />
                      )}

                      {map.comments ? map.comments[count].dislikes.length : null}
                    </Button>
                  </Row>
                </Col>
                <Col >
                  <Button onClick={handleReply(map.comments[count].user)} className='btn btn-light reply-link' disabled={!auth.loggedIn}>Reply</Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  )
}