/* @author Elven Li */

import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Card from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function CommentCard(props) {
    const { user, comment } = props;
    const { store } = useContext(GlobalStoreContext);

    let userText = "User: " + user

    let commentCard = 
        <Card wordWrap="break-word" sx={{width: "400px", m: "10px", px: "10px", py: "20px", borderRadius: "4px", fontSize: "18pt", wordWrap: "break-word"}}>
            <Typography sx={{fontSize: "14px"}}>
                {userText}
            </Typography>
            <Typography sx={{fontSize: "18px"}}>
                {comment}
            </Typography>
        </Card>

    return commentCard;
}