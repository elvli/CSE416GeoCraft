import React, { useState } from 'react'
import {Button, Dropdown} from "react-bootstrap";
import { HandThumbsUpFill, HandThumbsDownFill, ThreeDotsVertical, PenFill } from 'react-bootstrap-icons';
import './MapCard.scss'
<<<<<<< HEAD
import { Navigate } from 'react-router-dom';
export default function MapCard(props) {
  const { map, functions } = props
  const [toEdit, setToEdit] = useState(false);
  if(toEdit) {
    return <Navigate to="/edit"/>
  }
  async function handleDelete(event) {
    document.getElementById("map-create-modal").classList.add("is-visible")
  }
  
  let dropdown = <div className='options-button'>
    <Dropdown>
      <Dropdown.Toggle variant="light" id="dropdown-basic">
        <ThreeDotsVertical />
      </Dropdown.Toggle>
      <Dropdown.Menu className='dropdown-menu'>
        <Dropdown.Item className='options-button-options'>Fork</Dropdown.Item>
        <Dropdown.Item onClick={functions} className='options-button-options'>Delete</Dropdown.Item>
        <Dropdown.Item className='options-button-options'>Rename</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </div>

  let others = <div className='d-flex flex-row-reverse'>
    <Button className='btn btn-light dislike-button' onClick={()=>{setToEdit(true)}}><PenFill /></Button>
  </div>
=======
export default function MapCard(props){
    const { map, functions } = props
    let icon = "apples"
    async function handleDelete(event) {
        document.getElementById("map-create-modal").classList.add("is-visible")
    }
    let dropdown = <div className='options-button'>
                        <Dropdown>
                            <Dropdown.Toggle variant="light" id="dropdown-basic">
                                <ThreeDotsVertical />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className='dropdown-menu'>
                                <Dropdown.Item onClick={functions.handleFork} className='options-button-options'>Fork</Dropdown.Item>
                                <Dropdown.Item onClick={functions.handleDeleteMap} className='options-button-options'>Delete</Dropdown.Item>
                                <Dropdown.Item className='options-button-options'>Rename</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

    let others = <div className='d-flex flex-row-reverse'>
                    <Button className='btn btn-light dislike-button'><PenFill/></Button>
                 </div>
    if (map.published){
        dropdown = <div className='options-button'>
                        <Dropdown>
                            <Dropdown.Toggle variant="light" id="dropdown-basic">
                                <ThreeDotsVertical />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className='dropdown-menu'>
                                <Dropdown.Item onClick={functions.handleFork} className='options-button-options'>Fork</Dropdown.Item>
                                <Dropdown.Item onClick={functions.handleDeleteMap} className='options-button-options'>Delete</Dropdown.Item>
                                <Dropdown.Item onClick={functions.handleExport} className='options-button-options'>Export</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

        others = <div className='d-flex flex-row-reverse'>
                        <Button className='btn btn-light dislike-button'><HandThumbsDownFill/> {map.dislikes.length}</Button>
                        <Button className='btn btn-light like-button'><HandThumbsUpFill/> {map.likes.length}</Button>
                     </div>
    }
>>>>>>> c121ef08d876236bab046711082ebd52596af6c7

    return(
        <div>
            <div className="card map-card">
                <div className="card-header">
                    <p className="username">{map.title}</p>
                    {dropdown}
                    
                </div>

                <div className="card-body" >
                    <p className="card-text comment-text">By: {map.author}</p>
                    {others}
                    
                </div>
            </div>
        </div>
        
        
    )

}
