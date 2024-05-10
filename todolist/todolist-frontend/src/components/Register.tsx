import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/register`,
        { username, password, email }
      );
      if (response.status === 201) {
        // Registration successful
        setSuccess("User registered successfully. Please log in.");
        setError("");
        navigate("/login"); // Redirect to login after successful registration
      }
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.error || "Registration failed");
        setSuccess("");
      } else {
        setError("An unknown error occurred");
        setSuccess("");
      }
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        marginTop: "20%",
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
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{ color: "black" }}
      >
        Register
      </Typography>
      <form onSubmit={handleRegister} style={{ width: "100%" }}>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            type="password"
            label="Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginY: "20px" }}
        >
          Register
        </Button>
      </form>
    </Box>
  );
}

export default RegisterPage;
