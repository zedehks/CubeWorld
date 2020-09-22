// Webapp header navbar thing
import React from 'react';
import
{
    AppBar,
    Toolbar,
    Typography,
} from '@material-ui/core';

const AppHeader = () => (
    <AppBar position = "Static">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          CubeWorld
        </Typography>
      </Toolbar>
    </AppBar>
);

export default AppHeader;
            
