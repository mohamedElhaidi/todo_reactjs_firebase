import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { timeSince } from "../../../js/utils";
import { EnhencedTableModified } from "../../components/EnhencedTableModified";

import { IconButton, Chip } from "@mui/material";
import OpenInFullOutlinedIcon from "@mui/icons-material/OpenInFullOutlined";
import AddCircleOutlineOutlined from "@mui/icons-material/AddCircleOutlineOutlined";
import LoadingOverlay from "../../components/LoadingOverlay";
import { Box } from "@mui/system";
import { collection, onSnapshot } from "firebase/firestore";
import { firestoreInstance } from "../../../js/services/firebase/firestore";
import TaskViewModal from "../../components/Modals/taskViewModal";
import { deleteTodos } from "../../../js/services/todo";
import TodoFormModal from "../../components/Modals/todoFormModal";
import { useSnackbar } from "notistack";

const TodosListOverviewTable = ({ projectId }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);

  const [todos, setTodos] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [selectedTask, setSelectedTask] = React.useState(null);
  const [openTaskModal, setOpenTaskModal] = React.useState(false);
  const [openTaskFormModal, setOpenTaskFormModal] = React.useState(false);

  const params = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    setRows(todos.map((m) => createRow(m)));
  }, [todos]);

  React.useEffect(() => {
    // referece tasks collection
    const tasksColRef = collection(
      firestoreInstance,
      "projects/",
      projectId,
      "todos"
    );

    // listen to tasks
    const unsubscribe = onSnapshot(tasksColRef, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        const todo = {
          id: change.doc.id,
          ...change.doc.data(),
        };
        if (change.type === "added") {
          setTodos((prev) => [...prev, todo]);
        }
        if (change.type === "modified") {
          setTodos((prev) => [
            ...prev.map((task) => (task.id === change.doc.id ? todo : task)),
          ]);
        }
        if (change.type === "removed") {
          setTodos((prev) => prev.filter((task) => task.id !== change.doc.id));
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // navigates to todo page
  const handleOpenTodoPage = (todoId) => {
    // setSelectedTask(id);
    // setOpenTaskModal(true);
    navigate(`/projects/${params.projectId}/todos/${todoId}`);
  };

  const handleDeletion = (ids) => {
    setLoading(true);
    deleteTodos({ todosIds: ids, projectId: params.projectId })
      .then(({ data }) => {
        setLoading(false);
        enqueueSnackbar(data.message, { variant: "success" });
      })
      .catch((err) => {
        setLoading(false);
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };

  const handleAddNewTask = () => {
    setOpenTaskFormModal(true);
  };
  const createRow = (todo) => {
    return {
      id: todo.id,
      title:
        todo.title && todo.title.length <= 45
          ? todo.title
          : todo.title.slice(0, 50) + "...",
      submitterName: todo.submitter.name,
      createdAt: {
        value: todo.createdAt,
        label: timeSince(todo.createdAt),
      },
      viewAction: {
        value: "",
        label: (
          <Chip
            size="small"
            icon={<OpenInFullOutlinedIcon />}
            onClick={() => handleOpenTodoPage(todo.id)}
            label="View"
          />
        ),
      },
    };
  };
  return (
    <Box sx={{ position: "relative", height: "fit-content" }}>
      {loading && <LoadingOverlay />}
      <EnhencedTableModified
        tableTitle=""
        tableheadCells={[
          {
            id: "title",
            visible: true,
            align: "left",
            disablePadding: true,
            sortable: true,
            label: "Title",
          },
          {
            id: "submitterName",
            visible: true,
            disablePadding: true,
            sortable: true,
            label: "Submitter",
          },
          {
            id: "createdAt",
            visible: true,
            disablePadding: true,
            sortable: true,
            label: "Created At",
          },
          {
            id: "viewAction",
            visible: true,
            disablePadding: true,
            sortable: true,
            label: "",
          },
        ]}
        rows={rows}
        sx={{ maxWidth: "100%" }}
        handleDeletion={(ids) => handleDeletion(ids)}
        filters={["title", "submitter"]}
        selectable={true}
        actionButtons={[
          <IconButton key={0} onClick={() => handleAddNewTask()}>
            <AddCircleOutlineOutlined />
          </IconButton>,
        ]}
      />
      <TodoFormModal
        projectId={params.projectId}
        open={openTaskFormModal}
        handleClose={() => setOpenTaskFormModal(false)}
      />
      {openTaskModal && (
        <TaskViewModal
          task={todos.find((t) => t.id === selectedTask)}
          open={true}
          handleClose={() => setOpenTaskModal(false)}
        />
      )}
    </Box>
  );
};

export default TodosListOverviewTable;
