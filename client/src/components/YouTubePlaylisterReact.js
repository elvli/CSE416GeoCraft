/* @author Elven Li */

import React, { useContext, useRef, useState} from 'react'
import YouTube from 'react-youtube';
import { GlobalStoreContext } from '../store/index.js'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import { Card } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import Pause from '@mui/icons-material/Pause';

export default function YouTubePlayerExample() {
    const { store } = useContext(GlobalStoreContext);
    const playerRef = useRef(null);

    // THIS HAS THE YOUTUBE IDS FOR THE SONGS IN OUR PLAYLIST
    let titles = [];
    let artists = [];
    let playlist = [];

    if (store.currentList){
        let songs = store.currentList.songs;
        titles = [];
        artists = [];
        playlist = [];

        songs.forEach(song => { 
            titles.push(song.title)
            artists.push(song.artist)
            playlist.push(song.youTubeId)
        });

    }

    // THIS IS THE INDEX OF THE SONG CURRENTLY IN USE IN THE PLAYLIST
    let currentSong = store.currentSongIndex;

    const playerOptions = {
        height: '350',
        width: '591',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    };

    // THIS FUNCTION LOADS THE CURRENT SONG INTO
    // THE PLAYER AND PLAYS IT
    function loadAndPlayCurrentSong(player) {
        let song = playlist[currentSong];
        player.loadVideoById(song);
        player.playVideo();
    }

    // THIS FUNCTION INCREMENTS THE PLAYLIST SONG TO THE NEXT ONE
    function incSong() {
        currentSong++;
        currentSong = currentSong % playlist.length;
        store.setCurrentSong(currentSong, store.currentList.songs[currentSong]);
    }

    // THIS FUNCTION DECREMENTS THE PLAYLIST SONG TO THE NEXT ONE
    function decSong() {
        currentSong--;
        if (currentSong < 0) {currentSong = playlist.length - 1}
        store.setCurrentSong(currentSong, store.currentList.songs[currentSong]);
    }

    function onPlayerReady(event) {
        playerRef.current = event.target;
    }

    // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
    // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
    // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
    // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
    function onPlayerStateChange(event) {
        let playerStatus = event.data;
        let player = event.target;
        if (playerStatus === -1) {
            // VIDEO UNSTARTED
            console.log("-1 Video unstarted");
        } else if (playerStatus === 0) {
            // THE VIDEO HAS COMPLETED PLAYING
            console.log("0 Video ended");
            incSong();
            loadAndPlayCurrentSong(player);
        } else if (playerStatus === 1) {
            // THE VIDEO IS PLAYED
            console.log("1 Video played");
        } else if (playerStatus === 2) {
            // THE VIDEO IS PAUSED
            console.log("2 Video paused");
        } else if (playerStatus === 3) {
            // THE VIDEO IS BUFFERING
            console.log("3 Video buffering");
        } else if (playerStatus === 5) {
            // THE VIDEO HAS BEEN CUED
            console.log("5 Video cued");
        }
    }

    const handlePrevious = () => {
        console.log("handlePrevious")
        decSong();
        loadAndPlayCurrentSong(playerRef.current);
    }
    const handlePause = () => {
        playerRef.current.pauseVideo()
    }
    const handlePlay = () => {
        playerRef.current.playVideo();
    }
    const handleNext = () => {
        incSong();
        loadAndPlayCurrentSong(playerRef.current);
    }
    
    let playlistName = "";
    if (store.currentList) {
        playlistName = store.currentList.name
    }

    let infoCard = 
        <Card elevation={3} sx={{mt: "10px", backgroundImage: "linear-gradient(to top, #ffffff, #f397ff)"}}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h4">
                        Playlist: {playlistName}
                    </Typography>
                    <Typography component="div" variant="h5">
                        Title: {titles[store.currentSongIndex]}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        Artist: {artists[store.currentSongIndex]}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        Song: {store.currentSongIndex + 1}
                    </Typography>
                </CardContent>

                <Box sx={{ display: 'flex', m: 'auto' ,pl: 1, pb: 1}}>                                
                    <IconButton onClick={handlePrevious} id="prevBtn"aria-label="previous" color= 'secondary' title="Previous">
                        <SkipPreviousIcon sx={{height: 38, width: 38 }} />
                    </IconButton>
                    <IconButton onClick={handlePause} id="pauseBtn" aria-label="pause" color= 'secondary' title="Pause">
                        <Pause sx={{ height: 38, width: 38 }} />
                    </IconButton>
                    <IconButton onClick={handlePlay} id="playBtn" aria-label="play/pause" color= 'secondary' title="Play">
                        <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                    </IconButton>
                    <IconButton onClick={handleNext} id="nextBtn" aria-label="next" color= 'secondary' title="Next">
                        <SkipNextIcon sx={{ height: 38, width: 38 }} />
                    </IconButton>
                </Box>
            </Box>
        </Card>

    return <>
            <YouTube
            id="youTubePlayer"
            ref={playerRef}
            videoId={playlist[currentSong]}
            opts={playerOptions}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange} />
            {infoCard}
        </>
}
