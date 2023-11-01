/* @author Elven Li */

import React, { useContext, useEffect } from 'react';
import { GlobalStoreContext } from '../store';
import AuthContext from '../auth'

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import List from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

import CommentCard from './CommentCard';

export default function CommentsTab() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    // THESE HANDLE THE COMMENTS SECTION FOR THE PLAYLIST
    function handleComment(event) {
        if (event.code === "Enter") {
            if (event.target.value === '' || !store.currentList) {
                return;
            }
            store.addComment(event.target.value, auth.user);
            event.target.value = "";
        }
    }

    let comments = ""
    if (store.currentList && store.currentList.comments) {
        comments =
            store.currentList.comments.map((userComment) => (
                <Paper>
                    <CommentCard
                        user={userComment.user}
                        comment={userComment.comment}
                    />
                </Paper>
            ))
    }

    let isGuest = false;
    if (auth.user && auth.user.email == "guest@gmail.com") isGuest = true;

    return (

        <Grid container>
            <Grid item xs={12} height={'507px'}>
                <List id="playlist-cards" sx={{ overflow: 'scroll', overflowX: "hidden", height: '100%', width: '100%', backgroundImage: "linear-gradient(to top, #ffffff, #f397ff)" }}>
                    {comments}
                </List>
            </Grid>
            <Grid item xs={12} sx={{ mt: "20px", mb: "0px" }}>
                <TextField
                    id="Comment-Bar"
                    label="Comment"
                    variant="outlined"
                    color="secondary"
                    disabled={isGuest}
                    style={{ width: '100%' }}
                    onKeyPress={handleComment}
                />
            </Grid>
        </Grid>
    );
}

