import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import
{
    CssBaseline,Fab,List,ListItem,ListItemText,ListItemSecondaryAction,
    Container, Paper, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton, Button, Select, MenuItem
}
from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        color: theme.palette.text.secondary,               
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing(10),
        right: theme.spacing(10),
    }
}));

class Session
{
    constructor(id,user,date,puzzle)
    {
        this.id_session = id;
        this.id_user = user;
        this.date_session = date;
        this.puzzle_type = puzzle;
    }
}

export default function Sessions({user})
{
    const comps = useStyles();
    const [sessions, setSessions] = useState([]);
    const [dialog, setDialog] = useState(false);
    //defaults to 3x3 puzzle
    const [scrambleType, setScrambleType] = useState(3);
    const [doDel, setDoDel] = React.useState(null);

    const [delDialog, setDelDialog] = React.useState(false);

    const handleScramble = (e) => {
        setScrambleType(e.target.value);
        console.log(scrambleType);
    };

    function addSession(id,date,puzzle)
    {
        let newSess = new Session(id,user.id_user,date,puzzle);
        setSessions(sessions=>[...sessions,newSess]);
    }
    const delDialogOpen = () => {
         setDelDialog(true);        
    };
    const delDialogClose = () => {
        setDelDialog(false);
        setDoDel(null);
    };
    function getSessions()
    {
        setSessions([]);
        axios.get('http://localhost:8080/sessions', {
            params: {
                id_user: `${user.id_user}`
            }
        }).then(response => {
            console.log(response.data);
            response.data.forEach(data =>
                addSession(data.id_session,data.date_session,data.puzzle_type));
            
        }).catch(error => {
            console.log(error);
        });
    }

    function createSession()
    {
        axios.post('http://localhost:8080/session', {}, {
            params: {
                user: `${user.id_user}`,
                puzzle: `${scrambleType}`,
            }
        }).then(() => {
            closeDialog();
            getSessions();
        })
            .catch(error => {
                console.log(error); 
            });
    }

    const items = sessions.map((session) =>
        <ListItem>
          <ListItemText>
            {session.date_session} {" -  "+session.puzzle_type+"x"+session.puzzle_type}
          </ListItemText>
          <ListItemSecondaryAction>
            <IconButton edge="end" onClick={()=>{
                document.activeElement.blur();
                handleRemove(session.id_session);   
            }}>
              <DeleteIcon />
            </IconButton>            
          </ListItemSecondaryAction>
        </ListItem>
    );

    function handleRemove(e)
    {
        setDoDel(e);
        delDialogOpen();
    }
    function delItem()
    {
        axios.delete("http://localhost:8080/session", {
            params: {
                id_user: `${user.id_user}`,
                id_session: `${doDel}`,
            }
        }).then(() => {
            delDialogClose();
            getSessions();
        })
            .catch(error => {
                console.log(error); 
            });
    }
    
    const openDialog = () => {
        setDialog(true);
    };
    const closeDialog= () => {
        setDialog(false);
    };

    const newSession = () => {
        openDialog();
    };
    useEffect(() => {
        getSessions();
    }, []);
    return(
        <Container component="main" maxwidth="xs">
          <CssBaseline />
          <div className={comps.paper}>
          <Fab color="primary" onClick={newSession}            
               className={comps.fab} >
            <AddIcon />
          </Fab>
          <Paper>
            Sessions:
            <List>
              {items}
            </List>
        </Paper>
          {/*confirm exit dialog*/}
          <Dialog
            open={dialog}
            onClose={closeDialog}
          >
            <DialogTitle>{"New Session"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Select the puzzle type for this session:
              </DialogContentText>
              <Select
                value={scrambleType}
                onChange={handleScramble}
              >
                <MenuItem value={2}>2x2</MenuItem>
                <MenuItem value={3}>3x3</MenuItem>
                <MenuItem value={4}>4x4</MenuItem>
                <MenuItem value={5}>5x5</MenuItem>
                <MenuItem value={6}>6x6</MenuItem>
                <MenuItem value={7}>7x7</MenuItem>
              </Select>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={closeDialog} color="secondary">
                Cancel
              </Button>
              <Button onClick={()=>{
                  createSession();
              }} color="primary">
                Create
              </Button>
            </DialogActions>
          </Dialog>
          </div>

          {/*confirm del dialog*/}
          <Dialog
            open={delDialog}
            onClose={delDialogClose}
          >
            <DialogTitle>{"Confirm Delete"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this session?
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
}


