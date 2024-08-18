import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Button, Typography } from "@material-ui/core"
import RoomJoinPage from "./RoomJoinPage";

export default function Room(props) {
    const { roomCode } = useParams();
    const [state, setState] = useState({
        votesToSkip: 2,
        guestCanPause: false,
        isHost: false,
    });
    const navigate = useNavigate();
    useEffect(() => {getRoomDetails();}, []);

    const getRoomDetails = () => {
        fetch('/api/get-room' + '?code=' + roomCode).then((response) => {
            if (!response.ok) {
                props.leaveRoomCallback();
                navigate('/');
            } else {
                console.log(response.json())
                return response.json()
            }
        }
        ).then((data) => {
            setState({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host
            })
        });
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

    return (
        <Grid container spacing={1} alignItems="center" direction="column">
            <Grid item xs={12}>
                <Typography variant="h4" component="h4">
                    Code: {roomCode}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" component="h6">
                    Votes: {state.votesToSkip}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" component="h6">
                    Guest can Pause: {state.guestCanPause.toString()}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" component="h6">
                    Host: {state.isHost.toString()}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="secondary" onClick={leaveButtonPressed}>
                    Leave Room    
                </Button>
            </Grid>
        </Grid>
        
    );
}
