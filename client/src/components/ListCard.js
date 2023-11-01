/* @author Elven Li */

import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Accordian from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { useHistory } from 'react-router-dom'
import SongCard from './SongCard.js'
import Grid from '@mui/material/Grid';
import * as React from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Add from '@mui/icons-material/Add';
import Undo from '@mui/icons-material/Undo';
import Redo from '@mui/icons-material/Redo';
import Publish from '@mui/icons-material/Publish';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ThumbUp from '@mui/icons-material/ThumbUp';
import ThumbDown from '@mui/icons-material/ThumbDown';

import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import MUISameNameModal from './MUISameNameModal'

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const [expanded, setExpanded] = React.useState(false);
    const { idNamePair, selected } = props;

    store.history = useHistory();

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
        if (store.currentList) {
            if (idNamePair._id === store.currentList._id) {
                store.closeCurrentList();
            }
            else if (idNamePair._id !== store.currentList._id) {
                store.closeCurrentList()
                store.incListens(idNamePair._id);
            }
        }
        else {
            store.incListens(idNamePair._id);
        }

    };

    function handleToggleEdit(event) {
        event.stopPropagation();
        if (event.detail === 2) {
            store.setCurrentList(idNamePair._id);
            toggleEdit();
        }
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            for (let i = 0; i < store.idNamePairs.length; i++) {
                if (text === store.idNamePairs[i].name && store.currentList._id != store.idNamePairs[i]._id) {
                    store.showSameNameModal();
                    return;
                }
            }
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, event.target.value);
            toggleEdit();
        }
    }

    function handleUpdateText(event) {
        setText(event.target.value);
    }

    //  CONTROLLED ACCORDIAN HANDLER
    let open = false
    if (store.currentList) {
        if (store.currentList._id == idNamePair._id) open = true
        else open = false
        console.log(open)
    }

    let isGuest = false;
    if (auth.user && auth.user.email == "guest@gmail.com") isGuest = true;

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }

    // EDIT TOOLBAR FUNCTIONS
    function handleAddNewSong() {
        store.addNewSong();
    }
    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }

    // LIST MANIPULATION HANDLERS
    function handlePublish() {
        store.publishList();
        store.refreshLists();
    }
    function handleDuplicate() {
        store.duplicateList();
    }

    let isPublished = false
    if (store.currentList && store.currentList.published) {
        isPublished = true
    }

    let datePublished = <></>
    if (idNamePair.published) {
        let date = new Date(idNamePair.publishedDate);

        datePublished =
            <>
                <Typography sx={{ fontSize: '15px', mt: "10px" }}>
                    By: {idNamePair.ownerName}
                </Typography>
                <Typography sx={{ fontSize: '15px', mt: '10px' }}>
                    Published: {date.toLocaleDateString()}
                </Typography>
            </>
    }
    else {
        datePublished =
            <Typography sx={{ fontSize: '15px', mt: "10px", transform: "translate( 0%, 14%)" }}>
                By: {idNamePair.ownerName}
            </Typography>
    }

    function handleLike(event) {
        event.stopPropagation();
        store.likeList(auth.user.email, idNamePair, auth.user)
    }
    function handleDislike(event) {
        event.stopPropagation();
        store.dislikeList(auth.user.email, idNamePair, auth.user)
    }

    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }
    else if (store.isSameNameModalOpen()) {
        modalJSX = <MUISameNameModal />
    }
    // LIST OF SONGS IN THE PLAYLIST
    let songListJSX = ""
    if (store.currentList != null) {
        songListJSX =
            <Box id="list-selector-list">
                <List id="playlist-cards" sx={{ overflow: 'scroll', overflowX: "hidden", height: '100%', width: '100%', bgcolor: '#8000F00F' }}>
                    {store.currentList.songs.map((song, index) => (
                        <SongCard
                            id={'playlist-song-' + (index)}
                            key={'playlist-song-' + (index)}
                            index={index}
                            song={song}
                        />
                    ))}
                </List>
                {modalJSX}

            </Box>
    }

    let cardElement =
        //  SONG CARD ACCORDIAN
        <Accordian
            expanded={open}
            onChange={handleChange('panel' + idNamePair._id)}
            elevation={3}
            disableGutters={true}
            sx={{ borderRadius: "4px", margin: "20px", mt: '10px' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box
                    id={idNamePair._id}
                    key={idNamePair._id}
                    sx={{ borderRadius: "25px", p: "10px", bgcolor: '#FFFFFF', marginTop: '10px', display: 'flex', p: 1 }}
                    style={{ transform: "translate(1%,0%)", width: '98%', fontSize: '48pt' }}
                    button
                >
                    <Grid container>
                        <Grid item xs={8}>
                            <Grid item xs={8}>
                                <Box onClick={handleToggleEdit} component="div" sx={{ fontSize: "34px", p: 0 }}>{idNamePair.name}</Box>
                            </Grid>

                            <Grid item>
                                {datePublished}
                            </Grid>
                        </Grid>

                        <Grid item xs={2}>
                            <IconButton onClick={handleLike} disabled={!idNamePair.published || isGuest} sx={{ px: "10px", py: "0px", transform: "translate(0%, -90%)" }} color='secondary' aria-label='like' title="like">
                                <ThumbUp style={{ fontSize: '25pt' }} />
                                <Typography sx={{ transform: "translate(100%, 0%)" }}>
                                    {idNamePair.likes.length}
                                </Typography>
                            </IconButton>

                            <Grid item>
                                <Typography sx={{ fontSize: '15px', mt: "10px", transform: "translate(11%, -20%)" }}>
                                    Listens: {idNamePair.listens}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid item xs={2}>
                            <IconButton onClick={handleDislike} disabled={!idNamePair.published || isGuest} sx={{ px: "10px", py: "0px", transform: "translate(0%, -90%)" }} color='secondary' aria-label='dislike' title="dislike">
                                <ThumbDown style={{ fontSize: '25pt' }} />
                                <Typography sx={{ transform: "translate(100%, 0%)" }}>
                                    {idNamePair.dislikes.length}
                                </Typography>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Box>
            </AccordionSummary>

            {/* PLAYLIST LIST AND EDITING BUTTONS */}

            <AccordionDetails>
                <Grid Container overflow='hidden'>
                    <Grid item xs={12} overflow='hidden' height='398px' style={{ transform: "translate(0%, -10%)" }}>
                        {songListJSX}
                    </Grid>

                    {/* EDITING BUTTONS */}

                    <Grid item xs={10} sx={{ transform: "translate(0%,-12%)" }}>
                        <IconButton onClick={handleAddNewSong} disabled={isPublished} color='secondary' aria-label='add-new-song' title="Add New Song">
                            <Add style={{ fontSize: '32pt' }} />
                        </IconButton>
                        <IconButton onClick={handleUndo} disabled={!store.canUndo() || isPublished} color='secondary' aria-label='undo' title="Undo">
                            <Undo style={{ fontSize: '32pt' }} />
                        </IconButton>
                        <IconButton onClick={handleRedo} disabled={!store.canRedo() || isPublished} color='secondary' aria-label='redo' title="Redo">
                            <Redo style={{ fontSize: '32pt' }} />
                        </IconButton>

                        {/* LIST MANIPULATION BUTTONS */}
                        <Box sx={{ float: "right", transform: "translate(180%, 0%)" }}>
                            <IconButton onClick={handleDuplicate} disabled = {isGuest} color='secondary' aria-label='duplicate' title="Duplicate List">
                                <ContentCopy style={{ fontSize: '32pt' }} />
                            </IconButton>
                        </Box>
                        <Box sx={{ float: "right", transform: "translate(180%, 0%)" }}>
                            <IconButton onClick={(event) => { handleDeleteList(event, idNamePair._id) }} disabled = {isGuest || store.currentList && auth.user.email !== store.currentList.ownerEmail} color='secondary' aria-label='delete' title="Delete List">
                                <DeleteIcon style={{ fontSize: '32pt' }} />
                            </IconButton>
                        </Box>
                        <Box sx={{ float: "right", transform: "translate(180%, 0%)" }}>
                            <IconButton onClick={handlePublish} disabled={isPublished} color='secondary' aria-label='publish' title="Publish List">
                                <Publish style={{ fontSize: '32pt' }} />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordian>

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{ style: { fontSize: 48 } }}
                InputLabelProps={{ style: { fontSize: 24 } }}
                autoFocus
                variant='outlined'
                color='secondary'
                sx={{ p: 0, bgcolor: "white", transform: "translate(3.5%, 0%)" }}
            />
    }
    return (
        cardElement
    );
}

export default ListCard;