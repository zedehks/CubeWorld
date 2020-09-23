import React from 'react';
import clsx from 'clsx';
import
{
    Drawer,
    AppBar,
    Toolbar,
    List,
    CssBaseline,    
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    DialogActions,
    Button,
}from '@material-ui/core';
import RestoreIcon from '@material-ui/icons/Restore';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import TimelineIcon from  '@material-ui/icons/Timeline';
import AddAlarmIcon from '@material-ui/icons/AddAlarm';
import {makeStyles, useTheme} from '@material-ui/core/styles';

import Timer from '../components/Timer';
import Welcome from '../components/Welcome';
import Sessions from '../components/Session';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',            
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width','margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width','margin'], {
            easing:theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),                
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',                
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',                
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),                
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0,1),
        
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));


export default function Main({rec_user, logout})
{
    const comps = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [exitDialog, setExitDialog] = React.useState(false);
    const statuses = ['idle', 'timer', 'stats', 'session'];
    const [status, setStatus] = React.useState('idle');
    //const user=JSON.parse(rec_user);

    const exitDialogOpen = () => {
        setExitDialog(true);        
    };
    const exitDialogClose = () => {
        setExitDialog(false);        
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);        
    };

    function drawApp()
    {
        switch(status)
        {
            case 'idle':
            return <Welcome name={rec_user.first_name === null ? rec_user.username : rec_user.first_name}/>;
            case 'timer':
            return <Timer />;
            case 'session':
            return <Sessions user={rec_user} />;
            case 'stats':
            return (
                <div>
                  <label>heck</label>
                  <input></input>
                </div>
            );
            default:
            return <Welcome name={rec_user.first_name === null ? rec_user.username : rec_user.first_name}/>;
        }
    }
    function findIcon(index)
    {
        switch(index){
        case 0:
            return <RestoreIcon />;
        case 1:
            return <TimelineIcon />;
        case 2:
            return <ExitToAppIcon />;
        case 3:
            return <AddAlarmIcon />;
        default:
            return null;
        }
    }

    function handleDrawerClick()
    {}
    
    return (
        <div className={comps.root}>
          <CssBaseline />
          <AppBar
            position="fixed"
            className={clsx(comps.appBar, {
                [comps.appBarShift]: open,
            })}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(comps.menuButton, {
                    [comps.hide]: open,
                })}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap>
                CubeWorld
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            className={clsx(comps.drawer, {
                [comps.drawerOpen]: open,
                [comps.drawerClose]: !open,
            })}
            classes={{
                paper: clsx({
                    [comps.drawerOpen]: open,
                    [comps.drawerClose]: !open,
                }),
            }}
          >
            <div className={comps.toolbar}>
              <IconButton onClick={handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <List>
              <ListItem button key="Timer" onClick={()=> {setStatus(statuses[1]);}}>
                <ListItemIcon>{findIcon(3)}</ListItemIcon>
                <ListItemText primary='Timer' />
              </ListItem>
              <ListItem button key='Sessions' onClick={() =>{setStatus(statuses[3]);}}>
                <ListItemIcon>{findIcon(0)}</ListItemIcon>
                <ListItemText primary='Sessions' />
              </ListItem>
              <ListItem button key='Statistics' onClick={() => {setStatus(statuses[2]);}}>
                <ListItemIcon>{findIcon(1)}</ListItemIcon>
                <ListItemText primary='Statistics' />
              </ListItem>
              <ListItem button key='LogOut' onClick={exitDialogOpen}>
                <ListItemIcon>{findIcon(2)}</ListItemIcon>
                <ListItemText primary='Log Out' />
              </ListItem>
            </List>
          </Drawer>
          <main className={comps.content}>
            <div className={comps.toolbar}/>
            {drawApp()}
          </main>

          {/*confirm exit dialog*/}
          <Dialog
            open={exitDialog}
            onClose={exitDialogClose}
          >
            <DialogTitle>{"Log out?"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to log out?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={exitDialogClose} color="primary">
                Cancel
              </Button>
              <Button onClick={logout} color="primary">
                Log Out
              </Button>
            </DialogActions>
          </Dialog>
        </div>  
    );
}
