import * as React from 'react';
import { Box, Chip, Typography, TextField, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

interface TodoStripProps {
  description: string;
  priority?: string;
  dueDate?: string; // Make dueDate optional by adding '?'
  onDelete: () => void;
  onEdit: (newDescription: string) => void;
}

const TodoStrip: React.FC<TodoStripProps> = ({ description, priority, dueDate, onDelete, onEdit }) => {
  const [editMode, setEditMode] = React.useState(false);
  const [newDescription, setNewDescription] = React.useState(description);

  const handleEdit = () => {
    // Toggle edit mode
    setEditMode(!editMode);
    // If exiting edit mode, save the changes
    if (!editMode) {
      onEdit(newDescription);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewDescription(event.target.value);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: "20px" }}>
      {editMode ? (
        <TextField
          id="outlined-textarea"
          label="Description"
          multiline
          rows={4}
          value={newDescription}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          autoFocus
          InputLabelProps={{ sx: { marginTop: '5px' } }}
          sx={{ overflowY: 'auto', textAlign: "left" }}
        />
      ) : (
        <Typography variant="body1" sx={{ flexGrow: 1, overflowY: 'auto', textAlign: "left"}}>
          {description}
        </Typography>
      )}
      {priority && (
        <Chip label={priority} variant="outlined" sx={{ mx: 1 }} />
      )}
      {dueDate && (
        <Chip label={dueDate} variant="outlined" sx={{ mx: 1 }} />
      )}
      <IconButton onClick={handleEdit} sx={{ mx: 1 }}>
        {editMode ? (
          <SaveIcon color='info' />
        ) : (
          <EditIcon />
        )}
      </IconButton>
      {editMode && (
        <IconButton onClick={onDelete} sx={{ mx: 1 }}>
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default TodoStrip;
