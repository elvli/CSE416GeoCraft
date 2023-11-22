import React from 'react'
import { useState, useContext } from 'react';
import { Button, Dropdown } from "react-bootstrap";
import { HandThumbsUpFill, HandThumbsDownFill, ThreeDotsVertical, PencilFill } from 'react-bootstrap-icons';
import './MapCard.scss'
import { Navigate } from 'react-router-dom';
import AuthContext from '../../auth'
import { GlobalStoreContext } from '../../store'
export default function MapCard(props) {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const { map, functions, selected } = props
  const [toEdit, setToEdit] = useState(false);


  function onClickfoo(event) {
    event.preventDefault();
    event.stopPropagation();
    setToEdit(true)
  }

  function handleLike(event) {
    event.stopPropagation();
    store.likeList(auth.user.email, map, auth.user)
  }
  function handleDislike(event) {
      event.stopPropagation();
      store.dislikeList(auth.user.email, map, auth.user)
  }

  if(toEdit) {
      return <Navigate to="/edit"/>
  }
  // async function handleDelete(event) {
  //   document.getElementById("map-create-modal").classList.add("is-visible")
  // }D
  let dropdown = <div className='options-button'>
    <Dropdown>
      <Dropdown.Toggle variant="light" id="dropdown-basic" disabled={!auth.loggedIn}>
        <ThreeDotsVertical />
      </Dropdown.Toggle>
      <Dropdown.Menu className='dropdown-menu'>
        <Dropdown.Item onClick={functions.handleFork} className='options-button-options'>Fork</Dropdown.Item>
        <Dropdown.Item onClick={functions.handleDeleteMap} className='options-button-options'>Delete</Dropdown.Item>
        <Dropdown.Item className='options-button-options'>Rename</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </div>

  let mapCardButtons = <div className='d-flex flex-row-reverse'>
    <Button className='btn btn-light dislike-button' disabled={!auth.loggedIn}><PencilFill onClick={onClickfoo}/></Button>
  </div>
  if (map.published) {
    dropdown = <div className='options-button'>
      <Dropdown>
        <Dropdown.Toggle variant="light" id="dropdown-basic" disabled={!auth.loggedIn}>
          <ThreeDotsVertical />
        </Dropdown.Toggle>
        <Dropdown.Menu className='dropdown-menu'>
          <Dropdown.Item onClick={functions.handleFork} className='options-button-options'>Fork</Dropdown.Item>
          <Dropdown.Item onClick={functions.handleDeleteMap} className='options-button-options'>Delete</Dropdown.Item>
          <Dropdown.Item onClick={functions.handleExport} className='options-button-options'>Export</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>

    mapCardButtons = <div className='d-flex flex-row-reverse'>
      <Button className='btn btn-light dislike-button' onClick={handleDislike} disabled={!auth.loggedIn}><HandThumbsDownFill /> {map.dislikes.length}</Button>
      <Button className='btn btn-light like-button' onClick={handleLike} disabled={!auth.loggedIn}><HandThumbsUpFill /> {map.likes.length}</Button>
    </div>
  }

  return (
    <div>
      <div className="card map-card">
        <div className="card-header">
          <p className="map-title">{map.name}</p>
          {dropdown}

        </div>

        <div className="card-body" >
          <p className="card-text comment-text">By: {map.ownerName}</p>
          {mapCardButtons}
        </div>
      </div>
    </div>


  )

}