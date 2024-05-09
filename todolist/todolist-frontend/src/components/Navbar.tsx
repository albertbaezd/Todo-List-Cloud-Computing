import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Modal,
  Box,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import logoSrc from "../todo-logo-transparent.png"; // Adjust the path as needed

interface NavbarProps {
  username: string;
}

const Navbar: React.FC<NavbarProps> = ({ username }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle modal visibility
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  // Handle logout by closing the modal and redirecting to /login
  const handleLogout = () => {
    handleModalClose();
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
            onClick={handleModalOpen}
          >
            Account
          </Button>
        </Toolbar>
      </AppBar>

      {/* Account Modal */}
      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Welcome, {username}!
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, color: "gray" }}>
            Oh, are you not {username}?{" "}
            <Link
              component="button"
              variant="body1"
              onClick={handleLogout}
              sx={{ color: "blue", cursor: "pointer" }}
            >
              Logout
            </Link>
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default Navbar;
