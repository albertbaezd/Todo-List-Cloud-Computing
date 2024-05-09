import * as React from "react";
import axios from "axios";
import {
  Box,
  Chip,
  Typography,
  TextField,
  IconButton,
  Checkbox,
  Modal,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

interface TodoStripProps {
  description: string;
  priority?: string;
  dueDate?: string; // Make dueDate optional by adding '?'
  onDelete: () => void;
  status: string; // Completed or Pending
  onToggleStatus: (todoId: string, newStatus: string) => void;
  onEdit: (newDescription: string) => void;
  todoId: string;
  showToast: (message: string, severity: "success" | "error") => void;
  user_id: string;
}

const TodoStrip: React.FC<TodoStripProps> = ({
  description,
  priority,
  dueDate,
  onDelete,
  onEdit,
  todoId,
  status,
  onToggleStatus,
  showToast,
  user_id,
}) => {
  const [editMode, setEditMode] = React.useState(false);
  const [newDescription, setNewDescription] = React.useState(description);
  const [checked, setChecked] = React.useState(status === "completed");
  const [isModalOpen, setModalOpen] = React.useState(false);

  // Open the confirmation modal
  const handleModalOpen = () => {
    setModalOpen(true);
  };

  // Close the confirmation modal
  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleEdit = async () => {
    // Toggle edit mode
    setEditMode(!editMode);
    // If exiting edit mode, save the changes
    // if (!editMode) {
    //   onEdit(newDescription);
    // }
    if (editMode) {
      try {
        const updatedTodo = {
          description: newDescription,
          added_date: new Date().toISOString().split("T")[0], // Assuming today is the added date
          due_date: dueDate,
          status: checked ? "completed" : "pending",
          priority: priority || "low", // Ensure priority is set or default to "low"
          user_id: user_id, // Adjust accordingly to include the relevant user ID
        };

        // Make a PUT request to update the todo
        const response = await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/api/todos/${todoId}`,
          updatedTodo
        );

        if (response.status === 200) {
          showToast("Todo updated successfully!", "success");
          onEdit(newDescription); // Trigger any additional edit handling logic if needed
        } else {
          showToast("Error updating todo. Please try again.", "error");
        }
      } catch (error) {
        showToast(
          "Error updating todo: " +
            (error.response?.data.error || error.message),
          "error"
        );
        console.error("Error updating todo:", error);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewDescription(event.target.value);
  };

  const confirmToggleStatus = async () => {
    const newStatus = checked ? "pending" : "completed";

    try {
      // Make a PATCH request to update the todo status
      // `${process.env.REACT_APP_API_BASE_URL}/api/todos/${todoId}/status`
      const response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/api/todos/${todoId}/status`,
        {
          status: newStatus,
        }
      );
      onToggleStatus(todoId, newStatus);
      setChecked(!checked);
      handleModalClose();
      showToast("Status updated successfully!", "success");
      console.log(response.data.message); // Log success message
    } catch (error) {
      showToast("Error updating status. Please try again.", "error");
      console.error(
        "Error updating todo status:",
        error.response?.data || error.message
      );
    }
  };

  // Function to toggle status and make a PATCH request
  // const handleCheckboxToggle = async () => {
  //   const newStatus = checked ? "pending" : "completed";
  //   onToggleStatus(todoId, newStatus);
  //   setChecked(!checked);

  // };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: "20px",
      }}
    >
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
          InputLabelProps={{ sx: { marginTop: "5px" } }}
          sx={{ overflowY: "auto", textAlign: "left" }}
        />
      ) : (
        <Typography
          variant="body1"
          sx={{ flexGrow: 1, overflowY: "auto", textAlign: "left" }}
        >
          {description}
        </Typography>
      )}
      {priority && <Chip label={priority} variant="outlined" sx={{ mx: 1 }} />}
      {dueDate && <Chip label={dueDate} variant="outlined" sx={{ mx: 1 }} />}
      {/* Checkbox IconButton */}
      <IconButton onClick={handleModalOpen} sx={{ mx: 1 }}>
        <Checkbox
          checked={checked}
          icon={<CheckBoxOutlineBlankIcon />}
          checkedIcon={<CheckBoxIcon />}
        />
      </IconButton>

      <IconButton onClick={handleEdit} sx={{ mx: 1 }}>
        {editMode ? <SaveIcon color="info" /> : <EditIcon />}
      </IconButton>
      {editMode && (
        <IconButton onClick={onDelete} sx={{ mx: 1 }}>
          <DeleteIcon color="warning" />
        </IconButton>
      )}
      {/* Confirmation Modal */}
      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            {`Are you sure you want to set this to ${
              checked ? "pending" : "completed"
            }?`}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}>
            <Button
              onClick={confirmToggleStatus}
              color="success"
              variant="contained"
            >
              <CheckIcon />
            </Button>
            <Button
              onClick={handleModalClose}
              color="error"
              variant="contained"
            >
              <CloseIcon />
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default TodoStrip;
