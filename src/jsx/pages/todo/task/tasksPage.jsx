import * as React from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import withAuth from "../../../../js/hoc/withAuth";
import TitlePageWrap from "../../../components/pageTitleWrap";

import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import {
  Card,
  Checkbox,
  Chip,
  FormControlLabel,
  FormLabel,
  ListItem,
  Modal,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { timeSince } from "../../../../js/utils";
import EnhencedModal from "../../../components/EnhencedModal";
import TaskViewModal from "../../../components/Modals/taskViewModal";
import {
  TodoStatusTasksList,
  TodoStatusTasksListItem,
} from "../../../components/todo/listview/todoStatusList";

const tasksData = [
  {
    id: 0,
    title: "Something to do must be specified over here",
    createdAt: 1629535641984,
    finishedAt: 1629535641984,
    assignee: {},
    severity: 0,
    isFinished: true,
  },
  {
    id: 1,
    title: "Something to do must be specified over here",
    createdAt: 1629535641984,
    finishedAt: 1629535641984,
    assignee: {},
    severity: 0,
    isFinished: false,
  },
  {
    id: 2,
    title: "Something to do must be specified over here",
    createdAt: 1629535641984,
    finishedAt: 1629535641984,
    assignee: {},
    severity: 0,
    isFinished: false,
  },
  {
    id: 3,
    title: "Something to do must be specified over here",
    createdAt: 1629535641984,
    finishedAt: 1629535641984,
    assignee: {},
    severity: 0,
    isFinished: false,
  },
  {
    id: 4,
    title: "Something to do must be specified over here",
    createdAt: 1629535641984,
    finishedAt: 1629535641984,
    assignee: {},
    severity: 0,
    isFinished: false,
  },
  {
    id: 5,
    title: "Something to do must be specified over here",
    createdAt: 1629535641984,
    finishedAt: 1629535641984,
    assignee: {},
    severity: 0,
    isFinished: true,
  },
];

function TasksPage() {
  const [openTaskModal, setOpenTaskModal] = React.useState(false);

  const [tasks, setTasks] = React.useState(tasksData);
  const [selectedTask, setSelectedTask] = React.useState(null);
  const [toggledTodosList, setToggledTodosList] = React.useState(true);
  const [toggledInWorkList, setToggledInWorkList] = React.useState(true);
  const [toggledFinishedList, setToggledFinishedList] = React.useState(true);

  const handleToggleTaskFinish = (taskId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, isFinished: !t.isFinished } : t
      )
    );
  };
  const handleTaskClick = (taskId) => {
    setSelectedTask(tasks.find((t) => t.id === taskId));
    setOpenTaskModal(true);
  };

  const handleClosingViewTaskModal = () => {
    setOpenTaskModal(false);
  };

  return (
    <TitlePageWrap title="Tasks">
      <Box display="flex" flexDirection="column" p={2} gap={1}>
        <Stack direction="row" gap={1}>
          <FormControlLabel
            label="Todos"
            control={
              <Checkbox
                checked={toggledTodosList}
                onChange={(e) => setToggledTodosList((prev) => !prev)}
              />
            }
          />
          <FormControlLabel
            label="In work"
            control={
              <Checkbox
                checked={toggledInWorkList}
                onChange={(e) => setToggledInWorkList((prev) => !prev)}
              />
            }
          />
          <FormControlLabel
            label="Finished"
            control={
              <Checkbox
                checked={toggledFinishedList}
                onChange={(e) => setToggledFinishedList((prev) => !prev)}
              />
            }
          />
        </Stack>
        {toggledTodosList ? (
          <TodoStatusTasksList title="ToDos">
            {tasks
              .filter((t) => !t.isFinished)
              .map((t) => (
                <TodoStatusTasksListItem
                  key={t.id}
                  handleTaskSelection={handleTaskClick}
                  handleToggleTaskFinish={handleToggleTaskFinish}
                  {...t}
                />
              ))}
          </TodoStatusTasksList>
        ) : null}
        {toggledFinishedList ? (
          <TodoStatusTasksList title="Finished">
            {tasks
              .filter((t) => t.isFinished)
              .map((t) => (
                <TodoStatusTasksListItem
                  key={t.id}
                  onClick={handleTaskClick}
                  handleToggleTaskFinish={handleToggleTaskFinish}
                  {...t}
                />
              ))}
          </TodoStatusTasksList>
        ) : null}
      </Box>

      {openTaskModal && (
        <TaskViewModal
          open={true}
          handleClose={handleClosingViewTaskModal}
          task={selectedTask}
        />
      )}
    </TitlePageWrap>
  );
}

export default withAuth(TasksPage);
