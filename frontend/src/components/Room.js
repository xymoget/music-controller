import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

export default function Room() {
    const { roomCode } = useParams();
    const [state, setState] = useState({
        votesToSkip: 2,
        guestCanPause: false,
        isHost: false,
    });
    useEffect(() => {getRoomDetails();}, []);

    const getRoomDetails = () => {
        fetch('/api/get-room' + '?code=' + roomCode).then((response) => response.json()).then((data) => {
            console.log(data);
            setState({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host
            })
        });
    }

    return (
        <div>
            <h3>{roomCode}</h3>
            <p>Votes: {state.votesToSkip}</p>
            <p>Guest Can Pause: {state.guestCanPause.toString()}</p>
            <p>Host: {state.isHost.toString()}</p>
        </div>
    );
}
