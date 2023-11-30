import React from 'react'
import { useState, useContext, useEffect } from 'react';
import { Button, Dropdown } from "react-bootstrap";
import { HandThumbsUpFill, HandThumbsDownFill, ThreeDotsVertical, PencilFill, HandThumbsUp, HandThumbsDown, } from 'react-bootstrap-icons';
import './MapCard.scss'
import { Navigate } from 'react-router-dom';
import AuthContext from '../../auth'
import { GlobalStoreContext } from '../../store'
export default function MapCard(props) {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const { map, functions, selected } = props
  const [toEdit, setToEdit] = useState(false);
  const email = auth.getEmail();


  function onClickfoo(event) {
    event.preventDefault();
    event.stopPropagation();
    setToEdit(true)
  }

  function handleLike(event) {
    event.stopPropagation();
    let alreadyLiked = false;
        let likeArr = map.likes
        let dislikeArr = map.dislikes
        let likeCount = likeArr.length;
        let dislikeCount = dislikeArr.length;
        
        if(likeCount == 0 && dislikeCount == 0) {
            likeArr.push(auth.user.email)
        }
        else if(likeCount == 0 && dislikeCount > 0) {
            
            for(let i = 0; i < dislikeCount; i++) {
                if(dislikeArr[i] === auth.user.email) {
                    dislikeArr.splice(i, 1); 
                }
            }
            likeArr.push(auth.user.email)
        }
        else if(likeCount > 0 && dislikeCount == 0) {
            let isLiked = false;
            for(let i = 0; i < likeArr.length; i++) {
                if(likeArr[i] === auth.user.email) {
                    isLiked = true;
                    likeArr.splice(i, 1); 
                }
            }
            console.log("isLiked: " + isLiked)
            if(!isLiked) {
                likeArr.push(auth.user.email)
            }
        }
        else {
            let isLiked = false;
            for(let i = 0; i < likeCount; i++) {
                if(likeArr[i] === auth.user.email) {
                    isLiked = true;
                    likeArr.splice(i, 1); 
                }
            }
            for(let i = 0; i < dislikeCount; i++) {
                if(dislikeArr[i] === auth.user.email) {
                    dislikeArr.splice(i, 1); 
                }
            }
            if(!isLiked) {
                likeArr.push(auth.user.email)
            }
          }
        
          store.updateLikeDislike(map._id, map);


   // store.likeList(auth.user.email, map, auth.user)
  }
  function handleDislike(event) {
      event.stopPropagation();
      let likeArr = map.likes
      let dislikeArr = map.dislikes
      let alreadyLiked = false;
      let likeCount = likeArr.length;
      let dislikeCount = dislikeArr.length;
      if(likeCount == 0 && dislikeCount == 0) {
          dislikeArr.push(auth.user.email)
      }
      else if(dislikeCount == 0 && likeCount > 0) {
          
          for(let i = 0; i < likeCount; i++) {
              if(likeArr[i] === auth.user.email) {
                  likeArr.splice(i, 1); 
              }
          }
          dislikeArr.push( auth.user.email)
      }
      else if(dislikeCount > 0 && likeCount == 0) {
          let isLiked = false;
          for(let i = 0; i < dislikeArr.length; i++) {
              if(dislikeArr[i] === auth.user.email) {
                  isLiked = true;
                  dislikeArr.splice(i, 1); 
              }
          }
          console.log("isLiked: " + isLiked)
          if(!isLiked) {
              dislikeArr.push(auth.user.email)
          }
      }
      else {
          let isLiked = false;
          for(let i = 0; i < dislikeCount; i++) {
              if(dislikeArr[i] === auth.user.email) {
                  isLiked = true;
                  dislikeArr.splice(i, 1); 
              }
          }
          for(let i = 0; i < likeCount; i++) {
              if(likeArr[i] === auth.user.email) {
                  likeArr.splice(i, 1); 
              }
          }
          if(!isLiked) {
              dislikeArr.push(auth.user.email)
          }
        }
        
        store.updateLikeDislike(map._id, map);
        /*
        {
          name: map.name,
          ownerName: map.ownerName,
          ownerEmail: map.ownerEmail,
          mapType: map.mapType,
          comments: map.comments,
          published: map.published,
          publishedDate: map.publishedDate,
          likes: map.likes,
          dislikes: map.dislikes,
          views: map.views,
      }*/

   //   store.dislikeList(auth.user.email, map, auth.user)
  }
  function handleToggleEdit(event) {
    event.stopPropagation();
    store.setCurrentList(map._id);
        // event.stopPropagation();
        // if (event.detail === 2) {
        //     store.setCurrentList(idNamePair._id);
        //     toggleEdit();
        // }
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
      <Button className='btn btn-light dislike-button' onClick={handleDislike} disabled={!auth.loggedIn}>{map.dislikes.includes(email)? <HandThumbsDownFill/>:<HandThumbsDown/>} {map.dislikes.length}</Button>
      <Button className='btn btn-light like-button' onClick={handleLike} disabled={!auth.loggedIn}>{map.likes.includes(email)? <HandThumbsUpFill/>:<HandThumbsUp/>} {map.likes.length}</Button>
    </div>
  }

  return (
    <div>
      <div className={`card map-card ${(store.currentList != null)&&(store.currentList._id == map._id)? 'selected' : ''}`} onClick={handleToggleEdit}>
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