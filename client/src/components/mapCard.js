import React, { useState } from 'react'
import Button from "react-bootstrap/Button";
import { Trash } from 'react-bootstrap-icons';
export default function MapCard(){
    let icon = "apples"
    async function handleDelete(event) {
        document.getElementById("map-create-modal").classList.add("is-visible")
    }

    return(
        <Button type="button" onClick={handleDelete}><Trash/></Button>
    )

}