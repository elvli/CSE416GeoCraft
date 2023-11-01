/* @author Elven Li */

import { useContext } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box, Typography } from '@mui/material';

export default function MUIDeleteModal() {
    const { store } = useContext(GlobalStoreContext);
    let name = "";
    if (store.listMarkedForDeletion) {
        name = store.listMarkedForDeletion.name;
    }
    function handleDeleteList(event) {
        store.deleteMarkedList();
    }
    function handleCloseModal(event) {
        store.hideModals();
    }

    return (
        <Dialog
            open={store.listMarkedForDeletion !== null}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            hideBackdrop="true"
        >
            <Box sx={{backgroundImage: 'linear-gradient(to bottom, #f397ff, #ffffff)'}}>
                <DialogTitle id="alert-dialog-title">
                    {"Remove List?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete the <Typography display="inline" id="modal-modal-description" variant="h6" sx={{color: "#820747CF" ,fontWeight: 'bold', mt: 2, textDecoration: 'underline'}}>{name}</Typography> playlist?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteList} color="secondary">
                        Confirm
                    </Button>
                    <Button onClick={handleCloseModal} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}