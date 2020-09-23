import React, {useState, useEffect} from 'react';
import
{
    Paper, Grid, Container, CssBaseline,Radio,RadioGroup,
    FormControlLabel,FormControl,FormLabel, ListItem, List,ListItemText,ListItemIcon, IconButton,ListItemSecondaryAction,
    Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions, Button,
    Snackbar,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import MuiAlert from '@material-ui/lab/Alert';

import ms from 'pretty-ms';
import {makeStyles} from '@material-ui/core/styles';
import axios from 'axios';

function Alert(props)
{
    return <MuiAlert elevation={6} variant="filled" {...props}/>;
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        position: 'fixed',
        left: '50%',        
    },
    scramble: {
        spacing: 4,
    },
    paper: {
        opacity: 0.85,
        padding: "10px",
        margin: "10px",
        display:'flex',
        flexDirection: 'column',
        textAlign: "center",
        alignItems: 'center',
        color: theme.palette.text.secondary,
    },
    list: {
        width: '100%',
        maxWidth: 350,
        maxHeight: '30vh',
        overflow: 'auto',
    }
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
            penalty: null,
            unsavedSolve: false,            
        };
        this.startTimer = this.startTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
        this.resetTimer = this.resetTimer.bind(this);
        this.toggleTimer = this.toggleTimer.bind(this);        
        this.keyEvent = this.keyEvent.bind(this);
        this.setPenalty = this.setPenalty.bind(this);
    }

    keyEvent(event)
    {
        if (event.keyCode === 32)
        {
            this.toggleTimer();            
        }
        else if (event.keyCode === 13)
        {            
            //this.props.addSolve(this.state.time, this.state.penalty);
            console.log(this.state.unsavedSolve);
        }
    }
    componentDidMount()
    {
        document.addEventListener("keyup", this.keyEvent, false);
    }
    componentWillUnmount()
    {
        document.removeEventListener("keyup", this.keyEvent, false);
    }
    //This is where the solve is saved
    setPenalty = (event) =>
    {
        this.setState({penalty: event.target.value});
    }

    toggleTimer()
    {
        if(this.state.isOn)
        {
            this.stopTimer();
            this.setState({unsavedSolve: true});
            this.props.getScramble();
        }
        else
        {
            if (this.state.unsavedSolve)
            {
                if(this.state.penalty === null)
                {
                    this.props.openSnackbar();
                    return;
                }
                this.props.addSolve(this.state.time, this.state.penalty);
                
            }            
            this.resetTimer();            
            this.setState({penalty: null, unsavedSolve: false}); 
            this.startTimer();
        }
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
        //this.props.getScramble();
        this.setState({time: 0});
    }

    render () {
        return (
            <div>        
              <h1>{
                this.state.penalty==='dnf' ? 'DNF'
                  :
                  this.state.penalty==='plustwo'?  `${ms(this.state.time, {colonNotation:true,secondsDecimalDigits: 2})} +2` :
                  ms(this.state.time, {colonNotation:true,secondsDecimalDigits: 2})
              }</h1>

              <FormControl>
                <FormLabel>Penalty:</FormLabel>
                <RadioGroup value={this.state.penalty} onChange={this.setPenalty}>
                  <FormControlLabel disabled={!this.state.unsavedSolve} value="none" control={<Radio />}label="None" />
                  <FormControlLabel disabled={!this.state.unsavedSolve} value="plustwo" control={<Radio />}label="+2" />
                  <FormControlLabel disabled={!this.state.unsavedSolve} value="dnf" control={<Radio />}label="DNF" />
                </RadioGroup>
              </FormControl>
            </div>
        );
    }
}

class Solve
{
    constructor(id,time, penalty,scramble)
    {
        this.id=id;
        this.time = time;
        this.penalty = penalty;
        this.scramble = scramble;
    }
}



export default function Timer()
{
    const comps = useStyles();
    const [currScramble, setCurrScramble] = useState('');
    const [lastScramble, setLastScramble] = useState('');
    const [solves, setSolves] = useState([]);
    const [lastSolveId, setLastSolveId] = useState(0);
    const [delDialog, setDelDialog] = React.useState(false);
    const [doDel, setDoDel] = React.useState(null);
    const [snackbar, setSnackbar] = useState(false);
    
    useEffect(() => {
        getScramble();
    }, []);

    const delDialogOpen = () => {
        setDelDialog(true);        
    };
    const delDialogClose = () => {
        setDelDialog(false);
        setDoDel(null);
    };

    function addSolve(time, penalty)
    {
        let newSolve= new Solve(lastSolveId,time, penalty);
        let newId = lastSolveId +1;
        setLastSolveId(newId);
        setSolves(solves=>[...solves,newSolve]);
    }
    
    function getScramble()
    {
        axios.get('http://localhost:8080/scramble')
            .then(response => {
                //console.log(response.data[0]);
                setLastScramble(currScramble);                
                setCurrScramble(response.data[0]);
                console.log('cur '+currScramble);
                console.log('last '+lastScramble);
            })
            .catch(error => {
                if (error.response)
                {
                    console.log('error getting scramble!');
                }                
            });
        return 'error!';
    }
    function handleRemove(e)
    {
        //Tag id of item we want to delete
        setDoDel(e);
        //open deletion dialog
        delDialogOpen();
    }

    function delItem()
    {
        let id = doDel;
        const newList = solves.filter((item)=>
            item.id !== id);
        setSolves(newList);
        delDialogClose();
        setDoDel(null);
    }
    const items = solves.map((solve) =>
        <ListItem>
          <ListItemText>          
            {solve.penalty==='dnf' ? 'DNF'
                  :
             solve.penalty==='plustwo'?  `${ms(solve.time, {colonNotation:true,secondsDecimalDigits: 2})} +2` :
             ms(solve.time, {colonNotation:true,secondsDecimalDigits: 2})}
          </ListItemText>
          <ListItemSecondaryAction>
            <IconButton edge="end" onClick={()=>{
                document.activeElement.blur();
                handleRemove(solve.id);   
            }}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
    );
     const openSnackbar = () => {
            setSnackbar(true);
        };
        const closeSnackbar = (event,reason) => {
            if (reason === 'clickaway') {
                return;
            }        
            setSnackbar(false);
        };
    function showLastScramble()
    {
        return (lastScramble !== '' ?
                <div>
                  <h5>Last Scramble: {lastScramble}</h5>
                </div> : null
               );
    }
    
    return(
        <Container component="main" maxwidth="xs">
          <CssBaseline />
          
          <Snackbar
            open={snackbar}
            autoHideDuration={3000}
            onClose={closeSnackbar}>
            
            <Alert onClose={closeSnackbar}severity="warning">Select your penalty first!</Alert>            
          </Snackbar>
          <div className={comps.paper}>
            
            <Paper fullWidth elevation={1} variant="outlined" classes={comps.scramble}>                
              <h3>Current Scramble:</h3>
              <h2>{currScramble}</h2>
            </Paper>
            <Clock getScramble={getScramble} addSolve={addSolve} openSnackbar={openSnackbar}/>
            <div>Solves in this session:</div>
            <List  className={comps.list} >{items}</List>
          </div>

          {/*confirm del dialog*/}
          <Dialog
            open={delDialog}
            onClose={delDialogClose}
          >
            <DialogTitle>{"Confirm Delete"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this solve?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={delDialogClose} color="secondary">
                Cancel
              </Button>
              <Button onClick={()=>{
                  delItem();
              }} color="primary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
    );
};
