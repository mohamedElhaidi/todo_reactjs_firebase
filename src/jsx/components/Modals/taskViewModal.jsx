import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onSnapshot } from "firebase/firestore";
import { submitComment } from "../../../js/services/comments/comments";
import { COMMENT_TYPE_TASK } from "../../../js/services/comments/types";
import Comments from "../comments";
import EnhencedModal from "../EnhencedModal";
import DoneIcon from "@mui/icons-material/Done";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Input,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import TextEnhenced from "../TextEnhenced";
import { formatDate, getDateFromTimestamp } from "../../../js/utils";
import { markTaskAsFinished } from "../../../js/services/todo";
import TaskFormModal from "./taskFormModal";
import { useSnackbar } from "notistack";

const TaskViewModal = ({ taskRef, open, handleClose }) => {
  const [task, setTask] = useState(null);
  const [todo, setTodo] = useState(null);
  const [assignee, setAssignee] = useState(null);

  const [openEditTaskModal, setOpenEditTaskModal] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!taskRef) return;
    const listener = onSnapshot(
      taskRef,
      (snap) => {
        setTask({ id: taskRef.id, ...snap.data() });
        setAssignee(snap.data().assignee);
      },
      (error) => console.log(error.message)
    );

    return () => listener();
  }, [taskRef]);
  useEffect(() => {
    if (!task) return;
    const todoRef = task.todo.ref;
    const listener = onSnapshot(
      todoRef,
      (snap) => {
        setTodo(
          snap.data().statuses.map((s, index) => {
            return { index, id: s.id, name: s.name };
          })
        );
      },
      (error) => console.log(error.message)
    );

    return () => listener();
  }, [task]);

  const handleMarkAsFinished = () => {
    const data = {
      projectId: task.project.id,
      todoId: task.todo.id,
      taskId: taskRef.id,
    };
    markTaskAsFinished(data)
      .then((r) => {
        console.log(r);
      })
      .catch((err) => {});
  };

  if (!task) return;
  return (
    <EnhencedModal open={open} handleClose={handleClose}>
      <Box minWidth={750}>
        <Box
          minHeight={35}
          display="flex"
          justifyContent="start"
          py={2}
          px={1}
          position="sticky"
          top={0}
          bgcolor="background.paper"
          zIndex={9}
        >
          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              onClick={() => setOpenEditTaskModal(true)}
            >
              Edit
            </Button>

            <Button
              disabled={!task.status}
              disableElevation
              size="small"
              color="success"
              variant="contained"
              endIcon={<DoneIcon />}
              onClick={handleMarkAsFinished}
            >
              Mark as finished
            </Button>
            <Box display="flex" gap={1} alignItems="center">
              <TextEnhenced text="Due" />
              <Input disabled value={formatDate(task.dueDate)} type="date" />
            </Box>
          </Box>

          <Box display={"flex"} gap={1} position="absolute" right={0}></Box>
        </Box>
        <Box>
          <Box
            display="flex"
            flexDirection="row"
            gap={1}
            width="100%"
            mx="auto"
            px={2}
          >
            <Stack gap={1} flex={1} minWidth={500}>
              <Box maxWidth="450px">
                <Typography noWrap variant="h5" component="h1">
                  {task.title}
                </Typography>
              </Box>
              <Divider />
              <Typography variant="body1" component="div">
                {task.description}
              </Typography>
              <Divider />
              <Typography>Assignee:</Typography>
              <Box>
                <Tooltip title={assignee.name}>
                  <Chip
                    onClick={() => navigate(`/users/${assignee.id}/profile`)}
                    size="small"
                    avatar={
                      assignee ? (
                        <Avatar
                          sx={{ width: 25, height: 25 }}
                          src={assignee.pfp}
                        />
                      ) : null
                    }
                    label={assignee ? assignee.name : ""}
                  />
                </Tooltip>
              </Box>
            </Stack>
            <Box
              flex={1}
              position="sticky"
              top={70}
              height="fit-content"
              minWidth={350}
            >
              <TaskComments taskRef={taskRef} />
            </Box>
          </Box>
        </Box>
      </Box>

      <TaskFormModal
        taskToEdit={task}
        open={openEditTaskModal}
        handleClose={() => setOpenEditTaskModal(false)}
      />
    </EnhencedModal>
  );
};

const TaskComments = ({ taskRef }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const projectId = taskRef.parent.parent.parent.parent.id;
  const todoId = taskRef.parent.parent.id;
  const handleSubmitting = (content, triggerSuccess, triggerFailed) => {
    const options = {
      projectId,
      todoId,
      taskId: taskRef.id,
    };
    submitComment({ content, type: COMMENT_TYPE_TASK, options })
      .then(({ data }) => {
        triggerSuccess();
        enqueueSnackbar(data.message, { variant: "success" });
        console.log(data);
      })
      .catch((err) => {
        triggerFailed();
        enqueueSnackbar(err.message, { variant: "error" });
        console.log(err);
      });
  };

  return (
    <Comments
      firestorePath={`/projects/${projectId}/todos/${todoId}/tasks/${taskRef.id}/comments`}
      handleSubmittingComment={handleSubmitting}
      sx={{ minHeight: 100 }}
    />
  );
};

export default TaskViewModal;
