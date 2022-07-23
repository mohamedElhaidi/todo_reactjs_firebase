import {
  TodoStatusTasksList,
  TodoStatusTasksListItem,
} from "../../components/todo/listview/todoStatusList";
import { Box, Button } from "@mui/material";
import React, { useRef, useState } from "react";

import TaskViewModal from "../../components/Modals/taskViewModal";
import {
  changeStatusPosition,
  changeTaskPosition,
  deleteStatus,
} from "../../../js/services/todo";
import { deleteTasks } from "../../../js/services/tasks/tasks";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useSnackbar } from "notistack";

const TodoListviewDisplay = ({ todo, horizontal }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const statusGroupElementsRefs = useRef({});
  const taskElementsRefs = useRef({});
  const isTaskDragged = useRef(false);

  const [openTaskViewModal, setOpenTaskViewModal] = React.useState(false);
  const [selectedTaskRef, setSelectedTaskRef] = React.useState(null);

  const handleDeletingstatus = (statusId) => {
    const data = {
      projectId: todo.project.id,
      todoId: todo.id,
      statusId,
    };
    deleteStatus(data)
      .then(({ data }) => enqueueSnackbar(data.message, { variant: "success" }))
      .catch((err) => enqueueSnackbar(err.message, { variant: "error" }));
  };

  const handleChangingStatusPosition = (statusId, position) => {
    if (position <= 1 || position > todo.statuses.length - 1) {
      console.error("Cant change");
      return;
    }
    const data = {
      projectId: todo.project.id,
      todoId: todo.id,
      statusId,
      position,
    };
    changeStatusPosition(data)
      .then(({ data }) => {
        enqueueSnackbar(data.message, { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };
  const handleChangingTaskPosition = (status, task, position) => {
    if (position < 0 || position > status.tasks.length - 1) {
      console.error("Cant change");
      return;
    }
    const data = {
      projectId: todo.project.id,
      todoId: todo.id,
      taskId: task.id,
      statusId: status.id,
      position,
    };
    changeTaskPosition(data)
      .then(({ data }) => {
        {
          enqueueSnackbar(data.message, { variant: "success" });
        }
      })
      .catch((err) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };

  const handleDeletingTask = (taskId) => {
    const data = {
      projectId: todo.project.id,
      todoId: todo.id,
      tasksIds: [taskId],
    };

    deleteTasks(data)
      .then(({ data }) => enqueueSnackbar(data.message, { variant: "success" }))
      .catch((err) => enqueueSnackbar(err.message, { variant: "success" }));
  };
  const handleOpenTaskModal = (task) => {
    setSelectedTaskRef(task.ref);
    setOpenTaskViewModal(true);
  };

  const handleChangingOverlappedStatusElementStyle = (statusElement) => {
    const { current: elms } = statusGroupElementsRefs;
    for (const key in elms) {
      if (Object.hasOwnProperty.call(elms, key)) {
        const element = elms[key];
        element.classList.remove("overlap");
      }
    }
    statusElement.classList.add("overlap");
  };

  const removeOverlappedStatus = () => {
    const { current: elms } = statusGroupElementsRefs;
    for (const key in elms) {
      if (Object.hasOwnProperty.call(elms, key)) {
        const element = elms[key];
        element.classList.remove("overlap");
      }
    }
  };

  const handleTaskDropOnNewStatus = (
    taskId,
    currentStatusId,
    targetStatusId,
    targetPosition
  ) => {
    setLoading(true);
    const data = {
      projectId: todo.project.id,
      todoId: todo.id,
      taskId,
      currentStatusId,
      targetStatusId,
      targetPosition,
    };
    changeTaskPosition(data)
      .then(({ data }) => enqueueSnackbar(data.message, { variant: "success" }))
      .catch((err) => enqueueSnackbar(err.message));
    removeOverlappedStatus();
  };

  const removeUndefinedStatusElementRef = (key) => {
    delete statusGroupElementsRefs.current[key];
  };
  function getOverlappedStatusElement(pos) {
    let overlayedContainer = null;
    const { current } = statusGroupElementsRefs;
    for (const key in current) {
      if (Object.hasOwnProperty.call(current, key)) {
        const statusElement = current[key];
        if (!statusElement) {
          removeUndefinedStatusElementRef(key);
          continue;
        }
        const rect = statusElement.getBoundingClientRect();
        if (pos.x >= rect.x && pos.x <= rect.x + rect.width)
          if (pos.y >= rect.y && pos.y <= rect.y + rect.height)
            overlayedContainer = statusElement;
      }
    }

    return overlayedContainer;
  }
  function getTaskElementClosestIndex(
    originalIndex,
    pos,
    statusId,
    isSameStatus
  ) {
    let currentIndex = isSameStatus ? originalIndex : 0;
    let previousDistance = null;
    const { current } = taskElementsRefs;
    for (const key in current) {
      if (Object.hasOwnProperty.call(current, key)) {
        const el = current[key];
        if (el.dataset.statusId !== statusId) continue;
        const rect = el.getBoundingClientRect();
        const halfY = rect.y + rect.height / 2;
        const offset = pos.y - halfY;
        if (previousDistance === null || Math.abs(offset) < previousDistance) {
          // new index
          const index = Number(el.dataset.index);
          // const index =
          //   offset > 0
          //     ? Number(el.dataset.index) + 1
          //     : Number(el.dataset.index);
          // remember the new index
          currentIndex = index;
          // remember this is shortest distance
          previousDistance = Math.abs(offset);
        }
      }
    }
    // fix for when the dragged element dropped just under and uppon itself
    // in the same status
    // if (
    //   isSameStatus &&
    //   currentIndex <= originalIndex + 1 &&
    //   currentIndex >= originalIndex
    // ) {
    //   return originalIndex;
    // }
    return currentIndex;
  }

  const renderStatusOverlapAndPositionHighlight = (
    taskElement,
    overlappedStatusElement
  ) => {
    if (overlappedStatusElement) {
      if (taskElement.dataset.statusId !== overlappedStatusElement.dataset.id)
        handleChangingOverlappedStatusElementStyle(overlappedStatusElement);
    } else {
      removeOverlappedStatus();
      return null;
    }
  };

  const handleAddingListenersToTaskElement = (taskElement) => {
    taskElement.addEventListener("dragstart", (e) => {
      const mousePosition = { x: e.x, y: e.y };
      taskElement.classList.add("dragging");
    });
    taskElement.addEventListener("drag", (e) => {
      const mousePosition = { x: e.x, y: e.y };
      const overlappedStatusElement = getOverlappedStatusElement(mousePosition);
      renderStatusOverlapAndPositionHighlight(
        taskElement,
        overlappedStatusElement
      );
    });

    taskElement.addEventListener("dragend", (e) => {
      taskElement.classList.remove("dragging");
      const taskId = taskElement.dataset.id;
      const taskStatusId = taskElement.dataset.statusId;
      const taskIndex = Number(taskElement.dataset.index);
      const mousePosition = { x: e.x, y: e.y };
      const overlappedStatusElement = getOverlappedStatusElement(mousePosition);
      const targetStatusId = overlappedStatusElement.dataset.id;
      const newTaskIndex = getTaskElementClosestIndex(
        Number(taskIndex),
        mousePosition,
        targetStatusId,
        targetStatusId === taskStatusId
      );

      if (!(taskStatusId === targetStatusId && taskIndex === newTaskIndex)) {
        // handle change in backend
        handleTaskDropOnNewStatus(
          taskId,
          taskStatusId,
          targetStatusId,
          newTaskIndex
        );
      }
    });
  };

  if (!todo) return;
  return (
    <>
      <Box
        display="flex"
        flexDirection={!horizontal ? "column" : "row"}
        gap={1}
        maxWidth={!horizontal ? "100%" : "fit-content"}
        position="relative"
      >
        {loading && <LoadingOverlay />}
        {todo &&
          todo.statuses &&
          todo.statuses.map((status, statusIndex) => {
            return statusIndex !== 0 ? (
              <TodoStatusTasksList
                undeletable={statusIndex === 1}
                sx={{ width: !horizontal ? "100%" : "470px" }}
                key={status.id}
                data-id={status.id}
                id={status.id}
                title={status.name}
                headerBgColor={
                  statusIndex !== 1
                    ? status.bgColor
                      ? status.bgColor
                      : "#fff"
                    : "#9797fa"
                }
                headerTextColor={
                  statusIndex !== 1
                    ? status.textColor
                      ? status.textColor
                      : "#000000"
                    : "#000000"
                }
                handleElementRef={(element) =>
                  (statusGroupElementsRefs.current[status.id] = element)
                }
                onUpClick={() =>
                  handleChangingStatusPosition(status.id, statusIndex - 1)
                }
                onDownClick={() =>
                  handleChangingStatusPosition(status.id, statusIndex + 1)
                }
                onDeleteClick={() => handleDeletingstatus(status.id)}
              >
                {status.tasks &&
                  status.tasks.map((task, taskIndex) => {
                    return (
                      <TodoStatusTasksListItem
                        key={taskIndex}
                        data-status-id={status.id}
                        data-id={task.id}
                        data-index={taskIndex}
                        id={task.id}
                        task={task}
                        handleElementRef={(element) => {
                          if (!element) return;
                          const hooked = element.dataset.hooked;
                          if (!hooked) {
                            taskElementsRefs.current[task.id] = element;
                            handleAddingListenersToTaskElement(element);
                            element.dataset.hooked = true;
                          }
                        }}
                        onClick={() => handleOpenTaskModal(task)}
                        onUpClick={() =>
                          handleChangingTaskPosition(
                            status,
                            task,
                            taskIndex - 1
                          )
                        }
                        onDownClick={() =>
                          handleChangingTaskPosition(
                            status,
                            task,
                            taskIndex + 1
                          )
                        }
                        handleDeletion={() => handleDeletingTask(task.id)}
                      />
                    );
                  })}
              </TodoStatusTasksList>
            ) : null;
          })}
        {todo && todo.statuses && (
          <TodoStatusTasksList
            undeletable
            sx={{ width: !horizontal ? "100%" : "470px" }}
            data-id={todo.statuses[0].id}
            title={todo.statuses[0].name}
            headerBgColor="#9797fa"
            handleElementRef={(element) =>
              (statusGroupElementsRefs.current[todo.statuses[0].id] = element)
            }
          >
            {todo.statuses[0].tasks &&
              todo.statuses[0].tasks.map((task, taskIndex) => (
                <TodoStatusTasksListItem
                  key={taskIndex}
                  data-status-id={todo.statuses[0].id}
                  data-id={task.id}
                  data-index={taskIndex}
                  task={task}
                  onClick={() => {
                    if (!isTaskDragged.current) handleOpenTaskModal(task);
                  }}
                  handleElementRef={(element) => {
                    if (!element) return;
                    const hooked = element.dataset.hooked;
                    if (!hooked) {
                      handleAddingListenersToTaskElement(element);
                      element.dataset.hooked = true;
                    }
                  }}
                />
              ))}
          </TodoStatusTasksList>
        )}
        <TaskViewModal
          taskRef={selectedTaskRef}
          open={openTaskViewModal}
          handleClose={() => setOpenTaskViewModal(false)}
        />
      </Box>
    </>
  );
};

export default TodoListviewDisplay;
