import {
  Alert,
  Box,
  Button,
  Card,
  FormControl,
  FormControlLabel,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { createTask, editTask } from "../../../js/services/tasks/tasks";
import { getTaskSeverity } from "../../../js/tasks.utils";
import { formatDate } from "../../../js/utils";
import UsersAutocompleteList from "../../form/usersAutocompleteList";
import EnhencedModal from "../EnhencedModal";

const TaskFormModal = ({
  taskToEdit,
  projectId,
  todoId,
  open,
  handleClose,
}) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState(null);

  const [title, setTitle] = useState(taskToEdit ? taskToEdit.title : "");
  const [description, setDescription] = useState(
    taskToEdit ? taskToEdit.description : ""
  );

  const [severity, setSeverity] = useState(
    taskToEdit ? taskToEdit.severity : 0
  );
  const [dueDate, setDueDate] = useState(
    taskToEdit ? formatDate(taskToEdit.dueDate) : formatDate(Date.now())
  );
  const [sevirities, setSevirities] = useState([0, 1, 2]);
  const [assignee, setAssignee] = useState(null);

  const handleUserAutocompleteSelectionChange = (user) => {
    setAssignee(user);
  };

  const handleUserAutocompleteSucceeded = (users) => {
    if (taskToEdit)
      setAssignee(users.find((u) => u.id === taskToEdit.assignee.id));
    else setAssignee(users[0]);
  };

  const handleUserAutocompleteFailed = (message) => {
    console.log(message);
    setLoading(false);
  };

  const handleSeveritySelectionChange = (id) => {
    setSeverity(id);
  };
  const handleDueDateChange = (e) => {
    const { value } = e.currentTarget;
    setDueDate(value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setGlobalError(null);

    const data = {
      projectId: taskToEdit ? taskToEdit.project.id : projectId,
      todoId: taskToEdit ? taskToEdit.todo.id : todoId,
      title,
      description,
      severity,
      assigneeId: assignee.id,
      dueDate: new Date(dueDate).getTime(),
    };
    if (taskToEdit) {
      console.log(taskToEdit);
      data.taskId = taskToEdit.id;
      editTask(data)
        .then(({ data }) => {
          setLoading(false);
          console.log(data);
          enqueueSnackbar(data.message, { variant: "success" });
          handleClose(true);
        })
        .catch((err) => {
          setLoading(false);
          enqueueSnackbar(err.message, { variant: "error" });
          console.log(err.message);
        });
    } else
      createTask(data)
        .then(({ data }) => {
          setLoading(false);
          console.log(data);
          enqueueSnackbar(data.message, { variant: "success" });

          handleClose(true);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          enqueueSnackbar(err.message, { variant: "error" });
        });
  };

  return (
    <EnhencedModal
      sx={{ minWidth: "700px" }}
      open={open}
      handleClose={handleClose}
    >
      <Card>
        <form onSubmit={handleFormSubmit}>
          <Stack gap={2} p={2} px={3}>
            {globalError && (
              <Alert severity="error" title="One of the inputs is not valid" />
            )}
            <Typography component="h1" variant="h5">
              Adding new task
            </Typography>
            <Box display="flex" gap={1}>
              <FormControl sx={{ width: 200 }}>
                <InputLabel id="severity-label">Severity</InputLabel>
                <Select
                  labelId="severity-label"
                  id="severity"
                  value={severity}
                  label="Severity"
                  onChange={(e) =>
                    handleSeveritySelectionChange(e.target.value)
                  }
                  disabled={loading}
                >
                  {sevirities &&
                    sevirities.map((s) => (
                      <MenuItem key={s} value={s}>
                        {getTaskSeverity(s)}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.currentTarget.value)}
                label="Title"
              />
            </Box>

            <TextField
              multiline
              maxRows={15}
              minRows={2}
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              label="Description"
            />
            <Box display="flex" gap={1} var>
              <Typography>Due date:</Typography>
              <Input
                value={dueDate}
                onChange={handleDueDateChange}
                variant="outlined"
                type="date"
              />
            </Box>

            <UsersAutocompleteList
              value={assignee}
              disabled={loading}
              onFetchSucceeded={handleUserAutocompleteSucceeded}
              onFetchFailed={handleUserAutocompleteFailed}
              handleSelectionChange={handleUserAutocompleteSelectionChange}
            />

            <Button type="submit" variant="contained">
              {taskToEdit ? "Apply Modifications" : "Add"}
            </Button>
          </Stack>
        </form>
      </Card>
    </EnhencedModal>
  );
};

export default TaskFormModal;
