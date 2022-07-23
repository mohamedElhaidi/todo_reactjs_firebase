import AddCircleOutlineOutlined from "@mui/icons-material/AddCircleOutlineOutlined";
import { Box, Chip, IconButton } from "@mui/material";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../../../js/services/Context/StoreContext";
import { firestoreInstance } from "../../../js/services/firebase/firestore";
import { deleteProjects } from "../../../js/services/projects";
import { timeSince } from "../../../js/utils";
import { EnhencedTableModified } from "../../components/EnhencedTableModified";
import LoadingOverlay from "../../components/LoadingOverlay";
import OpenInFullOutlinedIcon from "@mui/icons-material/OpenInFullOutlined";
import withAuth from "../../../js/hoc/withAuth";
import withSideMenuAndNavBar from "../../../js/hoc/withSideMenuAndNavBar";
import TitlePageWrap from "../../components/pageTitleWrap";
import { getTicketSeverity, getTicketType } from "../../../js/tickets.utils";
import { getTaskSeverity } from "../../../js/tasks.utils";

const UserTasksPage = () => {
  const { isAuth, user } = useStore()[0];
  const [loading, setLoading] = React.useState(false);
  const [tasks, setTasks] = React.useState([]);

  const params = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) return;
    // referece tasks collection
    const tasksBelongsToMeColRef = collection(
      firestoreInstance,
      `/users/${user.uid}/tasks`
    );

    const unsubscribe = onSnapshot(tasksBelongsToMeColRef, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        const task = {
          id: change.doc.id,
          ...change.doc.data(),
        };
        if (change.type === "added") {
          setTasks((prev) => [...prev, task]);
        }
        if (change.type === "modified") {
          setTasks((prev) => [
            ...prev.map((p) => (p.id === change.doc.id ? task : p)),
          ]);
        }
        if (change.type === "removed") {
          setTasks((prev) => prev.filter((p) => p.id !== change.doc.id));
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  const createRow = (task) => {
    const projectId = task.ref.parent.parent.parent.parent.id;
    const todoId = task.ref.parent.parent.id;
    console.log(projectId, todoId);
    return {
      id: task.id,
      title:
        task.title && task.title.length <= 45
          ? task.title
          : task.title.slice(0, 50) + "...",
      type: {
        value: task.type,
        label: (
          <Chip
            variant="outlined"
            size="small"
            color={"primary"}
            label={getTicketType(task.type)}
          />
        ),
      },
      severity: {
        value: task.severity,
        label: (
          <Chip
            variant="contained"
            size="small"
            color={
              task.severity === 2
                ? "error"
                : task.severity === 1
                ? "secondary"
                : "primary"
            }
            label={getTaskSeverity(task.severity)}
          />
        ),
      },
      createdAt: {
        value: task.createdAt,
        label: timeSince(task.createdAt),
      },
      viewAction: {
        value: "",
        label: (
          <Chip
            size="small"
            icon={<OpenInFullOutlinedIcon />}
            onClick={() =>
              navigate(
                `/projects/${projectId}/todos/${todoId}?taskId=${task.id}`
              )
            }
            label="View"
          />
        ),
      },
    };
  };

  return (
    <TitlePageWrap title={`My Tasks ${tasks.length}`}>
      <Box
        width="100%"
        p={3}
        sx={{ position: "relative", height: "fit-content" }}
      >
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
              label: "Task Title",
            },
            {
              id: "severity",
              visible: true,
              align: "left",
              disablePadding: true,
              sortable: true,
              label: "Priority",
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
          rows={tasks.map((ticket) => createRow(ticket))}
          sx={{ maxWidth: "100%" }}
          filters={["name", "severity"]}
          selectable={false}
        />
      </Box>
    </TitlePageWrap>
  );
};

export default withAuth(withSideMenuAndNavBar(UserTasksPage));
