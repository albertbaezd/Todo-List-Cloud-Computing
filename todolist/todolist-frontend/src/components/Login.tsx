import React, { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import logoSrc from "../todo-logo-black.png"; // Adjust the path as needed

interface LoginPageProps {
  username: string;
  password: string;
  onUsernameChange: (username: string) => void;
  onPasswordChange: (password: string) => void;
  onUserIdChange: (userId: string) => void;
}

function LoginPage({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onUserIdChange,
}: LoginPageProps) {
  const navigate = useNavigate();
  const [error, setError] = React.useState<string>("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/login`,
        { username, password }
      );
      if (response.status === 200) {
        // Redirect to Todolist page
        onUserIdChange(response.data.user_id);
        navigate("/todolist");
      }
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.error || "Login failed");
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        marginTop: "30%",
        width: "70%",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        p: 3,
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
        mt: 4,
      }}
    >
      <img
        src={logoSrc}
        alt="Logo"
        style={{ height: "40px", marginRight: "16px" }}
      />
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{ color: "black" }}
      >
        Welcome!
      </Typography>
      <form onSubmit={handleLogin} style={{ width: "100%" }}>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            sx={{}}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            type="password"
            label="Password"
            variant="outlined"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
          />
        </Box>
        {error && <Alert severity="error">{error}</Alert>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginY: "20px" }}
        >
          Login
        </Button>
      </form>
    </Box>
  );
}

export default LoginPage;
