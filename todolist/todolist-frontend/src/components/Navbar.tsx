import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logoSrc from '../todo-logo-transparent.png'; // Adjust the path as needed

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* Menu icon */}
        {/* <IconButton edge="start" color="inherit" aria-label="menu">
          <Logo style={{ height: '40px', marginRight: '16px' }} />
        </IconButton> */}

        {/* Logo */}
        <img src={logoSrc} alt="Logo" style={{ height: '40px', marginRight: '16px' }} />

        {/* Todo list option */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Todo list
        </Typography>

        {/* Account button */}
        <Button color="inherit" startIcon={<Avatar />}>
          Account
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
