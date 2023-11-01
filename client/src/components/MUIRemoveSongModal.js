/* @author Elven Li */

import { useContext } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box, Typography } from '@mui/material';

export default function MUIRemoveSongModal() {
    const { store } = useContext(GlobalStoreContext);

    function handleConfirmRemoveSong () {
        store.addRemoveSongTransaction();
    }

    function handleCancelRemoveSong () {
        store.hideModals();
    }
    
    let modalClass = "modal";
    if (store.isRemoveSongModalOpen()) {
        modalClass += " is-visible";
    }

    let songTitle = "";
    if (store.currentSong) {
        songTitle = store.currentSong.title;
    }

    return (
        <Dialog
            open={store.currentModal === "REMOVE_SONG"}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            hideBackdrop={true}
            PaperProps={{
                elevation: 0,
                sx: {border: "solid 1px gray",}
              }}
            sx={{color: 'beige', boxShadow: false}}
        >
            <Box sx={{backgroundImage: 'linear-gradient(to bottom, #f397ff, #ffffff)'}}>
                <DialogTitle id="alert-dialog-title">
                    {"Remove song?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to remove <Typography display="inline" id="modal-modal-description" variant="h6" sx={{color: "#820747CF" ,fontWeight: 'bold', mt: 2, textDecoration: 'underline'}}>{songTitle}</Typography> from the playlist?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmRemoveSong} color="secondary">
                        Confirm
                    </Button>
                    <Button onClick={handleCancelRemoveSong} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Box>
      </Dialog>
    );
}