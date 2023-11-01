/* @author Elven Li */

import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import SongCard from './SongCard.js'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Grid from '@mui/material/Grid';
import { GlobalStoreContext } from '../store/index.js'
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();
    
    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }
    return (
        <Grid container sx={{ height: '100vh' }}>
            <Grid 
                item
                xs = {6}
                sm={8} md={5}>
                <Box id="list-selector-list">
                <List 
                    id="playlist-cards" 
                    sx={{overflow: 'scroll', height: '87%', width: '100%', bgcolor: '#8000F00F'}}
                >
                    {
                        store.currentList.songs.map((song, index) => (
                            <SongCard
                                id={'playlist-song-' + (index)}
                                key={'playlist-song-' + (index)}
                                index={index}
                                song={song}
                            />
                        ))  
                    }
                </List>            
                { modalJSX }
                </Box>
            </Grid>

            <Grid 
                item
                xs = {6}
                sm={8} md={5}>

                <div>hello</div>
            </Grid>
         </Grid>
    )
}

export default WorkspaceScreen;