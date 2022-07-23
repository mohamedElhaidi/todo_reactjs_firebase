import React from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { firestoreInstance } from "../../../js/services/firebase/firestore";

import {
  Box,
  Button,
  FormControlLabel,
  Input,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import TaskFormModal from "../../components/Modals/taskFormModal";

import TodoListviewDisplay from "./todoListViewDisplay";
import EnhencedModal from "../../components/EnhencedModal";
import TitlePageWrap from "../../components/pageTitleWrap";
import { addStatus } from "../../../js/services/todo";
import LoadingOverlay from "../../components/LoadingOverlay";
import withAuth from "../../../js/hoc/withAuth";
import withSideMenuAndNavBar from "../../../js/hoc/withSideMenuAndNavBar";
import TaskViewModal from "../../components/Modals/taskViewModal";
import { useSnackbar } from "notistack";

const TodoPage = () => {
  const { projectId, todoId } = useParams();
  const [taskRefFromUrlSearch, setTaskRefFromUrlSearch] = React.useState(null);
  const [todo, setTodo] = React.useState(null);
  const [horizontalDisplay, setHorizontalDisplay] = React.useState(false);
  const [openTaskFormModal, setOpenTaskFormModal] = React.useState(false);
  const [openAddStatusModal, setOpenAddStatusModal] = React.useState(false);

  React.useEffect(() => {
    /*
     * this to open task modal if the taskId is defined in url
     */
    const urlSearchParams = new URLSearchParams(window.location.search);
    const TaskToOpenId = urlSearchParams.get("taskId");
    const TaskToOpenRef = doc(
      firestoreInstance,
      `/projects/${projectId}/todos/${todoId}/tasks/${TaskToOpenId}`
    );
    if (TaskToOpenId) setTaskRefFromUrlSearch(TaskToOpenRef);
    /*
     * get todos
     */
    const todoDocRef = doc(
      firestoreInstance,
      "/projects/" + projectId + "/todos/" + todoId
    );

    const todoTasksColRef = collection(
      firestoreInstance,
      "/projects/" + projectId + "/todos/" + todoId + "/tasks"
    );

    if (!todoDocRef) return;
    const unsubTodoDocListener = onSnapshot(
      todoDocRef,
      (snap) => {
        setTodo({ id: snap.ref.id, ...snap.data() });
      },
      (error) => console.log(error.message)
    );

    if (!todoDocRef || !todoTasksColRef) return;

    return () => {
      unsubTodoDocListener();
    };
  }, []);
  if (!todo) return;
  return (
    <TitlePageWrap title={todo.title}>
      <Box
        width="100%"
        flexWrap="nowrap"
        overflow="auto"
        p={2}
        display="flex"
        flexDirection="column"
        gap={1}
      >
        <Typography component="h1" variant="h4">
          {todo.title}
        </Typography>
        <Box display="flex" flexDirection="row" gap={1}>
          <Button onClick={() => setOpenTaskFormModal(true)} variant="outlined">
            Add a task
          </Button>
          <Button
            onClick={() => setOpenAddStatusModal(true)}
            variant="outlined"
          >
            Add a status
          </Button>
          <Stack direction="row" alignItems="center">
            <FormControlLabel
              control={
                <Switch
                  value={horizontalDisplay}
                  onChange={(e) =>
                    setHorizontalDisplay(e.currentTarget.checked)
                  }
                />
              }
              label="Horizontal"
            />
          </Stack>
        </Box>
        <TodoListviewDisplay
          horizontal={horizontalDisplay}
          todo={todo}
          todoId={todoId}
          projectId={projectId}
        />
        {/* <TodoGroupView todo={todo} /> */}
        <TaskFormModal
          projectId={projectId}
          todoId={todoId}
          open={openTaskFormModal}
          handleClose={() => setOpenTaskFormModal(false)}
        />
        <AddTodoStatusModal
          todo={todo}
          open={openAddStatusModal}
          handleClose={() => setOpenAddStatusModal(false)}
        />
        <TaskViewModal
          taskRef={taskRefFromUrlSearch}
          open={Boolean(taskRefFromUrlSearch)}
          handleClose={() => setTaskRefFromUrlSearch(null)}
        />
      </Box>
    </TitlePageWrap>
  );
};

export default withAuth(withSideMenuAndNavBar(TodoPage));

const AddTodoStatusModal = ({ open, handleClose, todo }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const [statusName, setStatusName] = React.useState("");
  const [bgColor, setBgColor] = React.useState("#ffffff");
  const [textColor, setTextColor] = React.useState("#000000");
  const handleAddingStatus = () => {
    setLoading(true);
    const data = {
      projectId: todo.project.id,
      todoId: todo.id,
      statusName: statusName,
      bgColor,
      textColor,
    };
    addStatus(data)
      .then(({ data }) => {
        setLoading(false);
        enqueueSnackbar(data.message, { variant: "success" });
        handleClose(true);
      })

      .catch((err) => {
        console.log(err.message);
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };
  return (
    <EnhencedModal open={open} handleClose={handleClose}>
      {loading && <LoadingOverlay />}
      <Stack p={3}>
        <TextField
          value={statusName}
          label="Status Name"
          onChange={(e) => setStatusName(e.currentTarget.value)}
        />
        <Typography>color: </Typography>
        <FormControlLabel
          control={
            <Input
              sx={{ width: 50 }}
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.currentTarget.value)}
            />
          }
          label="Background color"
        />
        <FormControlLabel
          control={
            <Input
              sx={{ width: 50 }}
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.currentTarget.value)}
            />
          }
          label="Text Color"
        />

        <Button onClick={handleAddingStatus}>Add</Button>
      </Stack>
    </EnhencedModal>
  );
};
