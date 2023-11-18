import React from 'react'
import './CommentCard.scss'
import { PersonCircle } from 'react-bootstrap-icons';

export default function CommentCard() {
  return (
    <div className="card comment-card">
      <div className="card-title">
        <PersonCircle className="profile-pic-comm" />
        <p className="username">Example User</p>
      </div>

      <div className="card-body" >
        <p className="card-text comment-text">Example Comment :P</p>
      </div>
    </div>
  )
}