import {
  Alert,
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { createTask } from "../../../js/services/tasks/tasks";
import { createTodo } from "../../../js/services/todo";
import { getTaskSeverity } from "../../../js/tasks.utils";
import UsersAutocompleteList from "../../form/usersAutocompleteList";
import EnhencedModal from "../EnhencedModal";

const TodoFormModal = ({ projectId, todoId, open, handleClose }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  const [title, setTitle] = useState("");

  const handleUserAutocompleteFailed = (message) => {
    console.log(message);
    setLoading(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setGlobalError(null);
    setLoading(true);

    const todo = {
      title,
      projectId,
      // assigneesIds: assigneesIds.map((a) => a.id),
    };
    createTodo(todo)
      .then(({ data }) => {
        setLoading(false);
        enqueueSnackbar(data.message, { variant: "success" });
        handleClose(true);
      })
      .catch((err) => {
        setLoading(false);
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };

  return (
    <EnhencedModal
      sx={{ width: "500px" }}
      open={open}
      handleClose={handleClose}
      loading={loading}
    >
      <Card>
        <form onSubmit={handleFormSubmit}>
          <Stack gap={2} p={2}>
            {globalError && (
              <Alert severity="error" title="One of the inputs is not valid" />
            )}
            <Typography component="h1" variant="h5">
              Adding new todo-list
            </Typography>
            <TextField
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              label="Title"
            />

            <Button type="submit" variant="contained">
              Add
            </Button>
          </Stack>
        </form>
      </Card>
    </EnhencedModal>
  );
};

export default TodoFormModal;
