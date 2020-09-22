import React from 'react';
import
{
    Typography,
} from '@material-ui/core';
import logo from '../images/cubeworld-logo.png';

export default () => (
    <div align="center">
      <img src={logo} alt="CubeWorld" style={{ height: 160 }} />
	<p />
    <Typography variant="h2">CubeWorld Puzzle Timer</Typography>
   </div>
);
