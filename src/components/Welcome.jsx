import React from 'react';
import {Typography} from '@material-ui/core';
import logo from '../images/cubeworld-logo.png';

export default function Welcome({name})
{
    function greet()
    {
        return "Welcome to CubeWorld, "+name+".";
    }
    return(
        <div align="center">
          <img src={logo} alt="CubeWorld" style={{ height: 120 }} />
	  <p />
          <Typography variant="h6">{greet()}</Typography>
          <Typography variant="h6">Begin a new session using the first button on the left.</Typography>
        </div>
    );
};
