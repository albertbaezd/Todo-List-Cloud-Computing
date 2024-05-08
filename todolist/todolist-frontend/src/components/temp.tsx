import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Box, Button, Divider, MenuItem, Select, TextField, InputLabel } from '@mui/material';
import Navbar from "./components/Navbar";
import TodoStrip from "./components/TodoStrip";
import StatusBar from "./components/StatusBar";

type Todo = {
  id: string;
  description: string;
  added_date: Date;
  due_date: Date;
  status: boolean;
  priority_id: number;
}

export default function TodolistContainer() {
  const [activeFilter, setActiveFilter] = React.useState(false);
  const [todos, setTodos] = React.useState<Todo[]>([
    {
      id: '1',
      description: 'First Todo',
      added_date: new Date(),
      due_date: new Date('2024-12-31'),
      status: false,
      priority_id: 1
    },
    {
      id: '2',
      description: 'Second Todo',
      added_date: new Date(),
      due_date: new Date('2024-06-15'),
      status: false,
      priority_id: 2
    },
    {
      id: '3',
      description: 'Third Todo',
      added_date: new Date(),
      due_date: new Date('2024-08-22'),
      status: true,
      priority_id: 3
    }
  ]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  const handleFilterChange = (filter: boolean) => {
    setActiveFilter(filter);
  };

  const handleTodosChange = (id: string, newValues: Partial<Todo>) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, ...newValues } : todo
      )
    );
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
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
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
            <Divider orientation="vertical" flexItem sx={{ marginY: "20px", bgcolor: '#a0a3a6', height: "5px" }} />
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
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
          <Box sx={{
              backgroundColor: "white",
              marginTop: "30px",
              borderRadius: '10px',
              boxShadow: '2px 5px 20px #696363',
              height: 'auto',
              display: 'flex',
              flexDirection: 'column'
            }}>
            <StatusBar activeFilter={activeFilter} onFilterChange={handleFilterChange} />
            {todos.map((todo) => (
              <TodoStrip
                key={todo.id}
                description={todo.description}
                priority={"priority"}
                onDelete={() => {}}
                onEdit={() => {}}
                dueDate={todo.due_date.toISOString().split('T')[0]}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </React.Fragment>
  );
}
