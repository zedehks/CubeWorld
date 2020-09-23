import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import{
    CssBaseline, Paper, Container, Grid
} from '@material-ui/core';

import axios from 'axios';

import ms from 'pretty-ms';

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

export default function Stats({user})
{
    const [avg,setAvg] = React.useState(0);
    const [best,setBest] = React.useState(0);
    const [worst,setWorst] = React.useState(0);
     useEffect(() => {
         getAvg();
         getBest();
         getWorst();
    }, []);

    function getAvg()
    {
         axios.get('http://localhost:8080/avgtime', {
            params: {
                id_user: `${user.id_user}`,
            }
        }).then((response) => {
            let data = response.data.avg;
            console.log(data);
            setAvg(data);
        })
            .catch(error => {
                console.log(error); 
            });
    }
    function getBest()
    {
        axios.get('http://localhost:8080/besttime',  {
            params: {
                id_user: `${user.id_user}`,
            }
        }).then((response) => {
            let data = response.data.solve_time;
            console.log(data);
            setBest(data);
        })
            .catch(error => {
                console.log(error); 
            });
    }
    function getWorst()
    {
         axios.get('http://localhost:8080/worsttime',  {
            params: {
                id_user: `${user.id_user}`,
            }
        }).then((response) => {
            let data = response.data.solve_time;
            console.log(data);
            setWorst(data);
        })
            .catch(error => {
                console.log(error); 
            });
    }
    
    const Avg = () =>
    {
        return(
            <Paper>
              Global average time:
              { avg !== 0 ?
                ms(avg, {colonNotation:true,secondsDecimalDigits: 2})
                : 'N.A.'
              }
            </Paper>
        );
    };

    const Best = () =>
    {
        return(
            <Paper>
              Best time: {
              best !== 0? 
                  ms(best, {colonNotation:true,secondsDecimalDigits: 2})
                      : 'N.A.'
              }
            </Paper>
        );

    };

    function Worst()
    {
        return(
            <Paper>
              Worst time: {
                  worst !==0 ?
                  ms(worst, {colonNotation:true,secondsDecimalDigits: 2})
                      : 'N.A.'
              }
            </Paper>
        );        
    };

    
    return (
        <Container component="main" maxWidth="m">
          <h1>Stats</h1>
          {Avg()}
          {Best()}
          {Worst()}
        </Container>  
    );
}
