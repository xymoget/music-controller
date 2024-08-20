import React, { Component, useState } from "react";
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText"
import FormControl from "@material-ui/core/FormControl"
import { Link, useNavigate } from "react-router-dom"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { FormLabel, Collapse } from "@material-ui/core";

export default function CreateRoomPage(props) {
    console.log(props.guestCanPause);
    const defaultProps = {
        votesToSkip: 2,
        guestCanPause: true,
        update: false,
        roomCode: null,
        updateCallback: () => {},
    }

    const [guestCanPause, setGuestCanPause] = useState(props.guestCanPause ? typeof props.guestCanPause == "boolean" : defaultProps.guestCanPause);
    const [votesToSkip, setVotesToSkip] = useState(props.votesToSkip || defaultProps.votesToSkip);
    const [msg, setMsg] = useState(null)
    props.roomCode = props.roomCode || defaultProps.roomCode;
    props.updateCallback = props.updateCallback || defaultProps.updateCallback
    const navigate = useNavigate();

    const handleVotesChange = (e) => {
        setVotesToSkip(e.target.value);
    };

    const handleGuestCanPauseChange = (e) => {
        setGuestCanPause(e.target.value === "true");
    };

    const handleRoomButtonPressed = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause
            })
        };
        fetch('/api/create-room/', requestOptions)
            .then((response) => response.json())
            .then((data) => navigate('/room/' + data.code));
    };

    const handleUpdateButtonPressed = () => {
        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause,
                code: props.roomCode,
            })
        };
        fetch('/api/update-room/', requestOptions)
            .then((response) => {
                console.log(response.json());
                if (response.ok) {
                    setMsg("Room updated successfully");
                } else {
                    setMsg("Error updating room...");
                }
            });
        setTimeout(props.updateCallback, 5000);
    };

    const renderCreateButtons = () => {
        return (<Grid container spacing={1}>
            <Grid item xs={12} align="center">
            <Button color="primary" variant="contained" onClick={handleRoomButtonPressed}>
                Create Room
            </Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" to="/" component={Link}>
                    Back
                </Button>
            </Grid>
        </Grid>);
    }

    const renderUpdateButtons = () => {
        return (<Grid container spacing={1}>
            <Grid item xs={12} align="center">
            <Button color="primary" variant="contained" onClick={handleUpdateButtonPressed}>
                Update Room
            </Button>
            </Grid>
        </Grid>);
    }

    const title = props.update ? "Update Room" : "Create a Room";

    return (<Grid container spacing={1}>
        <Grid item xs={12} align="center">
            <Collapse in={msg != null}>
                {msg}
            </Collapse>
        </Grid>
        <Grid item xs={12} align="center">
            <Typography component='h4' variant="h4">
                {title}
            </Typography>
        </Grid>
        <Grid item xs={12} align="center">
            <FormControl component="fieldset">
                <FormHelperText>
                    <div align='center'>Guest Control of Playback State</div>
                </FormHelperText>
                <RadioGroup row defaultValue={guestCanPause.toString()} onChange={handleGuestCanPauseChange}>
                    <FormControlLabel value="true" control={<Radio color="primary"></Radio>} label="Play/Pause" labelPlacement="bottom"/>
                    <FormControlLabel value="false" control={<Radio color="secondary"></Radio>} label="No Control" labelPlacement="bottom"/>
                </RadioGroup>
            </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
            <FormControl>
                <TextField required={true} type="number" defaultValue={votesToSkip} inputProps={{ min: 1, style: { textAlign: "center" } }} onChange={handleVotesChange}/>
                <FormHelperText>
                    <div align="center">
                        Votes Required to Skip a Song
                    </div>
                </FormHelperText>
            </FormControl>
        </Grid>
        {props.update ? renderUpdateButtons() : renderCreateButtons()}
    </Grid>);
}