import React from 'react'
import { PersonCircle } from 'react-bootstrap-icons';

export default function CommentCard() {
  return (
    <div className="card" style={{ marginTop: '-8px',marginBottom: '18px' }}>
      <div className="card-header" style={{ maxHeight: '6vh', overflow: 'hidden' }}>
        <PersonCircle style={{ float: 'left', marginLeft: '-6px', marginRight: '8px', fontSize: '26px' }} />
        <p style={{ float: 'left', margin: 0 }}>Example User</p>
      </div>

      <div className="card-body" >
        <p className="card-text" style={{ float: 'left' }}>Example Comment :P</p>
      </div>
    </div>
  )
}