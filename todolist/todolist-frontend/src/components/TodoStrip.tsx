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
  Select,
  SelectChangeEvent,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { AddToCalendarButton } from "add-to-calendar-button-react";

interface TodoStripProps {
  description: string;
  priority?: string;
  dueDate?: string; // Make dueDate optional by adding '?'
  onDelete: (todoId: string, status: string) => void;
  status: string; // Completed or Pending
  onToggleStatus: (todoId: string, newStatus: string) => void;
  onEdit: (
    newDescription: string,
    newStatus: string,
    newPriority: string,
    newDueDate: string
  ) => void;
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
  const [isStatusModalOpen, setStatusModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [newPriority, setNewPriority] = React.useState(priority || "low");
  const [newDueDate, setNewDueDate] = React.useState(dueDate || "");

  // Open the status confirmation modal
  const handleStatusModalOpen = () => {
    setStatusModalOpen(true);
  };

  // Close the status confirmation modal
  const handleStatusModalClose = () => {
    setStatusModalOpen(false);
  };

  // Open the delete confirmation modal
  const handleDeleteModalOpen = () => {
    setDeleteModalOpen(true);
  };

  // Close the delete confirmation modal
  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
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
        const newStatus = checked ? "completed" : "pending";
        const updatedTodo = {
          description: newDescription,
          added_date: new Date().toISOString().split("T")[0], // Today's date
          due_date: newDueDate, // Use the updated due date
          status: newStatus,
          priority: newPriority || "low",
          user_id: user_id,
        };

        // Make a PUT request to update the todo
        const response = await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/api/todos/${todoId}`,
          updatedTodo
        );

        if (response.status === 200) {
          showToast("Todo updated successfully!", "success");
          onEdit(newDescription, newStatus, newPriority, newDueDate); // Trigger any additional edit handling logic if needed
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
      handleStatusModalClose();
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

  const handleTodoDelete = async () => {
    try {
      // Send a DELETE request to remove the todo
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/todos/${todoId}`,
        { params: { user_id } } // Include user_id as a parameter
      );

      if (response.status === 200) {
        showToast("Todo deleted successfully!", "success");
        onDelete(todoId, status); // Call the parent-provided onDelete function to update the UI
      } else {
        showToast("Error deleting todo. Please try again.", "error");
      }
    } catch (error) {
      showToast(
        "Error deleting todo: " + (error.response?.data.error || error.message),
        "error"
      );
      console.error("Error deleting todo:", error);
    }
  };

  const getPriorityChipColor = (priority: string | undefined) => {
    switch (priority) {
      case "low":
        return { backgroundColor: "#078019", color: "white" };
      case "medium":
        return { backgroundColor: "#eac518", color: "white" };
      case "high":
        return { backgroundColor: "red", color: "white" };
      default:
        return {};
    }
  };

  const handlePriorityChange = (event: SelectChangeEvent<string>) => {
    setNewPriority(event.target.value); // event.target.value is already a string
  };

  const handleDueDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewDueDate(event.target.value);
  };

  const dueDateObj = dueDate ? new Date(dueDate) : new Date(); // If `dueDate` is undefined, fallback to the current date
  const endDateObj = new Date(dueDateObj.getTime() + 15 * 24 * 60 * 60 * 1000); // Add 15 days to the due date
  const currentTime = new Date(); // Get the current time
  const startTimeObj = new Date(currentTime.getTime() + 1 * 60 * 60 * 1000); // Add 1 hour to the current time
  const endTimeObj = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours to the current time

  // Convert the Date objects to strings in "YYYY-MM-DD" and "HH:MM" formats
  const startDate = dueDateObj.toISOString().split("T")[0]; // "YYYY-MM-DD" format
  const endDate = endDateObj.toISOString().split("T")[0];
  const startTime = startTimeObj
    .toTimeString()
    .split(":")
    .slice(0, 2)
    .join(":"); // "HH:MM" format
  const endTime = endTimeObj.toTimeString().split(":").slice(0, 2).join(":");

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: "20px",
        borderBottom: "2px solid #ebe3e3",
      }}
    >
      {editMode ? (
        <>
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
          <Select
            value={newPriority}
            onChange={handlePriorityChange}
            variant="outlined"
            sx={{ mx: 1 }}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
          <TextField
            type="date"
            label="Due Date"
            value={newDueDate}
            onChange={handleDueDateChange}
            variant="outlined"
            sx={{ mx: 1 }}
          />
        </>
      ) : (
        <>
          <Typography
            variant="body1"
            sx={{ flexGrow: 1, overflowY: "auto", textAlign: "left" }}
          >
            {description}
          </Typography>
          {priority && (
            <Chip
              label={priority}
              variant="outlined"
              sx={{ mx: 1, ...getPriorityChipColor(priority) }}
            />
          )}
          {dueDate && (
            <Chip
              label={dueDate}
              variant="outlined"
              color="warning"
              sx={{ mx: 1 }}
            />
          )}
        </>
      )}
      <AddToCalendarButton
        name="Event Title"
        options={[
          "Apple",
          "Google",
          "Outlook.com",
          "Microsoft365",
          "MicrosoftTeams",
        ]}
        location="New York"
        startDate={startDate}
        endDate={endDate}
        startTime={startTime}
        endTime={endTime}
        timeZone="America/New_York"
        hideCheckmark={true}
        size={"5|3|3"}
      ></AddToCalendarButton>
      {/* {priority && (
        <Chip
          label={priority}
          variant="outlined"
          sx={{ mx: 1, ...getPriorityChipColor(priority) }}
        />
      )} */}
      {/* {dueDate && (
        <Chip
          label={dueDate}
          variant="outlined"
          color="warning"
          sx={{ mx: 1 }}
        />
      )} */}
      {/* Checkbox IconButton */}
      <IconButton onClick={handleStatusModalOpen} sx={{ mx: 1 }}>
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
        <IconButton onClick={handleDeleteModalOpen} sx={{ mx: 1 }}>
          <DeleteIcon color="warning" />
        </IconButton>
      )}
      {/* Status Confirmation Modal */}
      <Modal open={isStatusModalOpen} onClose={handleStatusModalClose}>
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
              onClick={handleStatusModalClose}
              color="error"
              variant="contained"
            >
              <CloseIcon />
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal open={isDeleteModalOpen} onClose={handleDeleteModalClose}>
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
            Are you sure you want to delete this todo?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}>
            <Button
              onClick={handleTodoDelete}
              color="success"
              variant="contained"
            >
              <CheckIcon />
            </Button>
            <Button
              onClick={handleDeleteModalClose}
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
