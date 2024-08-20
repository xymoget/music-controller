import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Button, Typography } from "@material-ui/core"
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";

export default function Room(props) {
    const { roomCode } = useParams();
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {getRoomDetails();}, []);

    const getRoomDetails = () => {
        fetch('/api/get-room' + '?code=' + roomCode).then((response) => {
            if (!response.ok) {
                props.leaveRoomCallback();
                navigate('/');
            } else {
                return response.json()
            }
        }
        ).then((data) => {
            console.log(data.is_host)
            setIsHost(data.is_host);
            setVotesToSkip(data.votes_to_skip)
            setGuestCanPause(data.guest_can_pause)
            if (data.is_host) {
                authenticateSpotify();
            }
        });
    }

    const authenticateSpotify = () => {
        fetch('/spotify/is-authenticated').then((response) => response.json()).then((data) => {
            setSpotifyAuthenticated(data.status);
            if (!data.status) {
                fetch('/spotify/get-auth-url').then((response) => response.json()).then((data) => {
                    window.location.replace(data.url);
                })
            }
        })

    }

    const leaveButtonPressed = () => {
        const requestData = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
        };
        fetch('/api/leave-room/', requestData).then((_response) => {navigate('/')})
    }

    const renderSettingsButton = () => {
        return (
            <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={() => setShowSettings(true)}>
                    Settings
                </Button>
            </Grid>
        )
    }

    const renderSettings = () => {
        return (
        <Grid container spacing={1} alignItems="center" direction="column">
            <Grid item xs={12}>
                <CreateRoomPage update={true} votesToSkip={votesToSkip} guestCanPause={guestCanPause} roomCode={roomCode} updateCallback={getRoomDetails}></CreateRoomPage>
            </Grid>
            <Grid item xs={12}>
                <Button color="primary" variant="contained" onClick={() => setShowSettings(false)}>
                    Close
                </Button>
            </Grid>
        </Grid>
        )
    }
    
    if (showSettings) {
        return renderSettings()
    }
    return (
        <Grid container spacing={1} alignItems="center" direction="column">
            <Grid item xs={12}>
                <Typography variant="h4" component="h4">
                    Code: {roomCode}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" component="h6">
                    Votes: {votesToSkip}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" component="h6">
                    Guest can Pause: {guestCanPause.toString()}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" component="h6">
                    Host: {isHost.toString()}
                </Typography>
            </Grid>
            {isHost ? renderSettingsButton() : null}
            <Grid item xs={12}>
                <Button variant="contained" color="secondary" onClick={leaveButtonPressed}>
                    Leave Room    
                </Button>
            </Grid>
        </Grid>
        
    );
}
