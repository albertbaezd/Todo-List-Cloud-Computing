import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Box, Button, Divider, MenuItem, Select, TextField, InputAdornment, InputLabel, formLabelClasses, Typography } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import Navbar from "./components/Navbar.tsx"
import TodoStrip from "./components/TodoStrip.tsx"
import StatusBar from "./components/StatusBar.tsx"

export default function TodolistContainer() {

  const [activeFilter, setActiveFilter] = React.useState(false); // Declare activeFilter and initialize it to 0

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ bgcolor: '#d3dfed', height: '100%', margin: "5%", borderRadius: "20px", padding: "5%" }}>
          <Navbar />
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              bgcolor: 'white',
              padding: '24px',
              borderRadius: '20px',
              boxShadow: '2px 5px 20px #696363',
              height: 'auto',
              display: 'flex',
              flexDirection: 'column',
              marginTop: "20px"
            }}
          >
            <TextField
              id="outlined-textarea"
              label="Description"
              multiline
              rows={4}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              id="date"
              label="Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              // InputProps={{
              //   endAdornment: (
              //     <InputAdornment position="end">
              //       <CalendarToday />
              //     </InputAdornment>
              //   ),
              // }}
              sx={{ mb: 2 }}
            />
            {/* Priority */}
            <InputLabel htmlFor="priority" sx={{ mt: 2, mb: 1 }}>Priority</InputLabel>
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
            <Button type="submit" variant="contained" color="primary" sx={{ mb: 2 }}>
              Add
            </Button>
            {/* Divider */}
            <Divider orientation="vertical" flexItem sx={{ marginY: "20px", bgcolor: '#a0a3a6', height: "5px" }} />
            {/*Filters Box */}
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
              {/* Filter select */}
              <Box sx={{ width: '50%', paddingRight: '8px' }}>
                <Box sx={{ mb: 2 }}>
                  <InputLabel htmlFor="filter" sx={{ mt: 2, mb: 1 }}>Filter</InputLabel>
                  <Select
                    label="Filter"
                    id="filter"
                    variant="outlined"
                    defaultValue="pending"
                    sx={{ width: "100%" }}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </Box>
              </Box>
              {/* Sort select */}
              <Box sx={{ width: '50%', paddingLeft: '8px' }}>
                <Box sx={{ mb: 2 }}>
                  <InputLabel htmlFor="sort" sx={{ mt: 2, mb: 1 }}>Sort</InputLabel>
                  <Select
                    label="Sort"
                    id="sort"
                    variant="outlined"
                    defaultValue="added-date"
                    sx={{ width: "100%" }}
                  >
                    <MenuItem value="added-date">Added date</MenuItem>
                    <MenuItem value="due-date">Due date</MenuItem>
                  </Select>
                </Box>
              </Box>
            </Box>
            
          </Box>
          {/* TodoStrip Cards container */}
          <Box sx={{backgroundColor:"white", 
              marginTop:"30px", 
              borderRadius:'10px',
              boxShadow: '2px 5px 20px #696363',
              height: 'auto',
              display: 'flex',
              flexDirection: 'column'}}>
            <StatusBar activeFilter={activeFilter} onFilterChange={handleFilterChange}/>
            <TodoStrip description={"description descriptiondescriptiondescriptiondescriptiondescription"} priority={"priority"} onDelete={()=>{}} onEdit={()=>{}}/>
            <TodoStrip description={"description descriptiondescriptiondescriptiondescriptiondescription"} priority={"priority"} onDelete={()=>{}} onEdit={()=>{}}/>
            <TodoStrip description={"description descriptiondescriptiondescriptiondescriptiondescription"} priority={"priority"} onDelete={()=>{}} onEdit={()=>{}} dueDate='2018-22-03'/>
          </Box>  

        </Box>
      </Container>
    </React.Fragment>
  );
}
