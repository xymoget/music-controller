import React from "react";
import { Grid, Typography, Card, IconButton, LinearProgress } from "@material-ui/core"
import { PlayArrow, SkipNext, Pause } from "@material-ui/icons"

export default function MusicPlayer(props) {
    const songProgress = (props.time / props.duration) * 100;
    return (
        <Card>
            <Grid container alignItems="center">
                <Grid item align="center" xs={4}>
                    <img src={props.image_url} height="100%" width="100%"/>
                </Grid>
                <Grid item align="center" xs={8}>
                    <Typography component="h5" variant="h5">
                        { props.title }
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle1">
                        { props.artist }
                    </Typography>
                    <div>
                        <IconButton>
                            {props.is_playing ? <Pause></Pause> : <PlayArrow></PlayArrow>}
                        </IconButton>
                        <IconButton>
                            <SkipNext></SkipNext>
                        </IconButton>
                    </div>
                </Grid>
            </Grid>
            <LinearProgress variant="determinate" value={songProgress}></LinearProgress>
        </Card>
    )
}