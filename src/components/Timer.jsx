import React, {useState} from 'react';
import
{
    Paper, Grid, Container, CssBaseline
} from '@material-ui/core';
import ms from 'pretty-ms';
import {makeStyles} from '@material-ui/core/styles';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(8),
        display:'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: theme.palette.text.secondary,
    },
}));

class Clock extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            time: 0,
            start: 0,
            isOn: false,
        };
       
        this.startTimer = this.startTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
        this.resetTimer = this.resetTimer.bind(this);
    }

    startTimer(){
        this.setState({
            time: this.state.time,
            start: Date.now() - this.state.time,
            isOn: true,
        });
        this.timer = setInterval(() => this.setState({
            time: Date.now() - this.state.start,
        }),1);
    }
    stopTimer() {
        this.setState({isOn: false});
        clearInterval (this.timer);
    }
    resetTimer() {
        this.setState({time: 0});
    }

    render () {
        let start = (this.state.time === 0) ?
            <button onClick={this.startTimer}>start</button> :
            null;
        let stop = (this.state.isOn) ?
            <button onClick={this.stopTimer}>stop</button> :
            null;
        let reset = (this.state.time !== 0 && !this.state.isOn) ?
            <button onClick={this.resetTimer}>reset</button> :
            null;

        return (
            <div>
              <h1>{ms(this.state.time, {colonNotation:true,secondsDecimalDigits: 2})}</h1>
              {start}
              {stop}
              {reset}
            </div>
        );
    }
}

export default function Timer()
{
    const comps = useStyles();
    const [currScramble, setCurrScramble] = useState('');
    
    function getScramble()
    {
        axios.get('http://localhost:8080/scramble')
            .then(response => {
                console.log(response.data[0]);
                setCurrScramble(response.data[0]);
            })
            .catch(error => {
                if (error.response)
                {
                    console.log('error getting scramble!');
                }                
            });
        return 'error!';
    }
    
    return(
        <Container component="main" maxwidth="xs">
          <CssBaseline />
          <div className={comps.paper}>
            <Paper elevation={3}>Scramble: <h1>{currScramble}</h1></Paper>
            <Clock />
            <button onClick={getScramble}>scramble</button> 
          </div>
        </Container>
    );
};
