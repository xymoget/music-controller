import React, { Component, useEffect, useState } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room"
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import { TextField, Button, Grid, Typography, ButtonGroup } from "@material-ui/core";


export default function HomePage() {
    const [roomCode, setRoomCode] = useState(null)

    useEffect(() => {
        fetch('/api/user-in-room').then((response) => response.json()).then((data) => {
            setRoomCode(data.code);
        });
    }, [])

    const componentDidMount = async () => {
        
    }

    const renderHomePage = () => {
        return (
            <Grid container spacing={3} alignItems="center" direction="column">
                <Grid item xs={12}>
                    <Typography variant="h3" component="h3">
                        House Party
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" to='/join' component={ Link }>
                            Join a Room
                        </Button>
                        <Button color="secondary" to='/create' component={ Link }>
                            Create a Room
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    }

    return (
    <Router>
        <Routes>
            <Route exact path='/' element={roomCode ? <Navigate to={`room/${roomCode}`} /> : renderHomePage()} />
            <Route path='/join' element={<RoomJoinPage />} />
            <Route path='/create' element={<CreateRoomPage />} />
            <Route path='/room/:roomCode' element={<Room />} />
        </Routes>
    </Router>)

}