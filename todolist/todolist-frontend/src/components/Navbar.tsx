import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Popover,
  Box,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import logoSrc from "../todo-logo-transparent.png"; // Adjust the path as needed

interface NavbarProps {
  username: string;
}

const Navbar: React.FC<NavbarProps> = ({ username }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const navigate = useNavigate();

  // Open the popover
  const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the popover
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  // Handle logout by closing the popover and redirecting to /login
  const handleLogout = () => {
    handlePopoverClose();
    navigate("/login");
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {/* Logo */}
          <img
            src={logoSrc}
            alt="Logo"
            style={{ height: "40px", marginRight: "16px" }}
          />

          {/* Todo list option */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todo list
          </Typography>

          {/* Account button */}
          <Button
            color="inherit"
            startIcon={<Avatar />}
            onClick={handlePopoverOpen}
          >
            Account
          </Button>
        </Toolbar>
      </AppBar>

      {/* Popover */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box
          sx={{
            p: 2,
            width: 200,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Welcome, {username}!
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Oh, are you not {username}?{" "}
          </Typography>
          <Link
            component="button"
            variant="body1"
            onClick={handleLogout}
            sx={{ color: "blue", cursor: "pointer", marginTop: "10px" }}
          >
            Logout
          </Link>
        </Box>
      </Popover>
    </>
  );
};

export default Navbar;
