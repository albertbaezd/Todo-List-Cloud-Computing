import * as React from 'react';
import { Box, Button, Chip, Typography, TextField, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';


const TodoStrip = ({ description, priority, editable, onDelete, onEdit }) => {
  const [editMode, setEditMode] = React.useState(editable || false);
  const [newDescription, setNewDescription] = React.useState(description);

  const handleEdit = () => {
    setEditMode(!editMode);
    if (editMode) {
      onEdit(newDescription);
    }
  };

  const handleChange = (event) => {
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
          sx={{ overflowY: 'auto' }}
        />
      ) : (
        <Typography variant="body1" sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {description}
        </Typography>
      )}
      <Chip label={priority} variant="outlined" sx={{ mx: 1 }} />
      {editable ? (
        <>
          <IconButton onClick={handleEdit} sx={{ mx: 1 }}>
            <SaveIcon color='info'/>
          </IconButton>
          
          <IconButton onClick={onDelete} sx={{ mx: 1 }}>
            <DeleteIcon color='error'/>
          </IconButton>
         
        </>
      ) :  <>
            <IconButton disabled sx={{ mx: 1 }}>
                <EditIcon />
            </IconButton>
            
            <IconButton disabled sx={{ mx: 1 }}>
                <DeleteIcon />
            </IconButton>
        </>}
    </Box>
  );
};

export default TodoStrip;
