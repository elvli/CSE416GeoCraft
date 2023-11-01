/* @author Elven Li */

import { useContext, useState } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AuthContext from '../auth'

export default function MUISameNameModal() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext)

    function handleCloseButton() {
        store.hideModals();
    }

    return (
        <Dialog 
            open = {store.isSameNameModalOpen()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            hideBackdrop={true}
            PaperProps={{
                elevation: 0,
                sx: {border: "solid 1px gray",}
              }}
            sx={{color: 'beige', boxShadow: 24,}}
            >
            <Box sx={{backgroundImage: 'linear-gradient(to bottom, #f397ff, #ffffff)'}}>
                <DialogTitle id="alert-dialog-title">
                    Playlist Rename Error
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Another Playlist already has the same name.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        size="small"
                        id="dialog-no-button"
                        className="modal-button"
                        onClick={handleCloseButton}
                        color='secondary'
                    >
                        Close
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
