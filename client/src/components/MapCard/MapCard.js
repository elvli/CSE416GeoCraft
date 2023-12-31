import { React, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Dropdown } from "react-bootstrap";
import { HandThumbsUpFill, HandThumbsDownFill, ThreeDotsVertical, PencilFill, HandThumbsUp, HandThumbsDown, } from 'react-bootstrap-icons';
import AuthContext from '../../auth'
import GlobalStoreContext from '../../store'
import './MapCard.scss'

export default function MapCard(props) {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const { map, functions } = props
  const username = auth.loggedIn ? auth.user._id : 0;
  const navigate = useNavigate();

  function handleEditMap(event) {
    event.stopPropagation();
    navigate(`/edit/${map._id}`);
  }

  function handleInteraction(arr, otherArr, event) {
    event.stopPropagation();
    const index = arr.indexOf(auth.user._id);

    if (index !== -1) {
      arr.splice(index, 1);
    } else {
      if (otherArr.length > 0) {
        const otherIndex = otherArr.indexOf(auth.user._id);
        if (otherIndex !== -1) {
          otherArr.splice(otherIndex, 1);
        }
      }
      arr.push(auth.user._id);
    }

    store.updateLikeDislike(map._id, map);
  }

  function handleLike(event) {
    handleInteraction(map.likes, map.dislikes, event);
  }

  function handleDislike(event) {
    handleInteraction(map.dislikes, map.likes, event);
  }

  function handleSelectMap(event) {
    event.stopPropagation();
    if (!store.currentList || store.currentList._id !== map._id) {
      store.setCurrentList(map._id, null);
    }
  }

  let dropdown = <div className='options-button'>
    <Dropdown>
      <Dropdown.Toggle variant="light" id="dropdown-basic" disabled={!auth.loggedIn}>
        <ThreeDotsVertical />
      </Dropdown.Toggle>
      <Dropdown.Menu className='dropdown-menu'>
        <Dropdown.Item onClick={functions.handlePublish} className='options-button-options'>Publish</Dropdown.Item>
        <Dropdown.Item onClick={functions.handleFork} className='options-button-options'>Fork</Dropdown.Item>
        <Dropdown.Item onClick={functions.handleDeleteMap} className='options-button-options'>Delete</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </div>

  let mapCardButtons = <div className='d-flex flex-row-reverse'>
    <Button className='btn btn-light dislike-button' disabled={!auth.loggedIn} onClick={handleEditMap}><PencilFill /></Button>
  </div>
  if (map.published) {
    dropdown = <div className='options-button'>
      <Dropdown>
        <Dropdown.Toggle variant="light" id="dropdown-basic" disabled={!auth.loggedIn}>
          <ThreeDotsVertical />
        </Dropdown.Toggle>

        <Dropdown.Menu className='dropdown-menu'>
          <Dropdown.Item onClick={functions.handleFork} className='options-button-options'>Fork</Dropdown.Item>
          <Dropdown.Item onClick={functions.handleExport} className='options-button-options'>Export</Dropdown.Item>
          {map.ownerEmail === auth.getEmail() && (
            <Dropdown.Item onClick={functions.handleDeleteMap} className='options-button-options'>
              Delete
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </div>

    mapCardButtons = <div className='d-flex flex-row-reverse'>
      <Button className='btn btn-light dislike-button' onClick={handleDislike} disabled={!auth.loggedIn}>{map.dislikes.includes(username) ? <HandThumbsDownFill /> : <HandThumbsDown />} {map.dislikes.length}</Button>
      <Button className='btn btn-light like-button' onClick={handleLike} disabled={!auth.loggedIn}>{map.likes.includes(username) ? <HandThumbsUpFill /> : <HandThumbsUp />} {map.likes.length}</Button>
    </div>
  }

  return (
    <div>
      <div className={`card map-card ${((store.currentList) && (store.currentList._id === map._id)) ? 'selected' : ''}`} onClick={handleSelectMap}>
        <div className="card-header">
          <p className="map-title">{map.name}</p>
          {dropdown}
        </div>

        <div className="card-body">
          <p className="card-text comment-text">
            By: <Link to={`/profile/${map.ownerName}`} className="owner-link" onClick={(e) => e.stopPropagation()} style={{
              textDecoration: 'none',
              fontWeight: 500,
            }}>
              {map.ownerName}
            </Link>
          </p>
          {mapCardButtons}
        </div>
      </div>
    </div>
  )
}