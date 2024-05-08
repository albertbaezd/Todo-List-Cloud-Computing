import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
// import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// import TextField from '@mui/material/TextField';
import { Box, Button, IconButton, InputAdornment, MenuItem, Select, TextField } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import Navbar from "./components/Navbar.tsx"

export default function TodolistContainer() {

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
  };
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ bgcolor: '#d3dfed', height: '100vh', margin:"5%", borderRadius:"5%", padding:"5%"}}>
          {/* <Typography variant="h2" gutterBottom sx={{color:"white", }}>
          Todolist App
          </Typography> */}
          <Navbar/>

          {/* <Box sx={{component:"form", bgcolor:"white", padding:"24px", borderRadius:"20px", boxShadow:"2px 5px 20px #696363", height:"100px"}}>

          </Box> */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              bgcolor: 'white',
              padding: '24px',
              borderRadius: '20px',
              boxShadow: '2px 5px 20px #696363',
              height: 'auto', // Adjust height as needed
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Textarea */}
            <TextField
              id="outlined-textarea"
              label="Description"
              multiline
              rows={4}
              variant="outlined"
              sx={{ mb: 2 }}
            />

            {/* Date Selector */}
            <TextField
              id="date"
              label="Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {/* <IconButton>
                      <CalendarToday />
                    </IconButton> */}
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* Priority Selector */}
            <Select
              label="Priority"
              id="priority"
              variant="outlined"
              defaultValue="low"
              sx={{ mb: 2 }}
            >
              <MenuItem value="low">Low Priority</MenuItem>
              <MenuItem value="medium">Medium Priority</MenuItem>
              <MenuItem value="high">High Priority</MenuItem>
            </Select>

            {/* Submit button */}
            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
          </Box>
        </Box>

      </Container>
    </React.Fragment>
  );
}